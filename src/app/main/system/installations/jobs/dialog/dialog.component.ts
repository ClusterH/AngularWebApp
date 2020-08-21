import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge, BehaviorSubject, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { JobsService } from 'app/main/system/installations/jobs/services/jobs.service';
import { JobsDataSource } from "app/main/system/installations/jobs/services/jobs.datasource"
import { JobDetail } from "app/main/system/installations/jobs/model/job.model"
import { locale as jobsEnglish } from 'app/main/system/installations/jobs/i18n/en';
import { locale as jobsSpanish } from 'app/main/system/installations/jobs/i18n/sp';
import { locale as jobsFrench } from 'app/main/system/installations/jobs/i18n/fr';
import { locale as jobsPortuguese } from 'app/main/system/installations/jobs/i18n/pt';

@Component({
    selector: 'job-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class JobDialogComponent implements OnInit {
    job: JobDetail = {};
    flag: any;
    jobForm: FormGroup;
    serviceDetail: JobDetail = {};

    userConncode: string;
    userID: number;

    private flagForSaving = new BehaviorSubject<boolean>(false);

    dataSource: JobsDataSource;
    dataSourceCompany: JobsDataSource;
    dataSourceGroup: JobsDataSource;

    filter_string: string = '';
    method_string: string = '';

    displayedColumns: string[] = ['name'];
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true })
    paginatorCompany: MatPaginator;
    @ViewChild('paginatorGroup', { read: MatPaginator })
    paginatorGroup: MatPaginator;

    constructor(
        private router: Router,
        private _formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private jobsService: JobsService,
        private dialogRef: MatDialogRef<JobDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(jobsEnglish, jobsSpanish, jobsFrench, jobsPortuguese);
        this.flag = _data.flag;

        if (this.flag == 'edit') {
            this.job = _data.serviceDetail;

        } else {

        }

        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

        this.filter_string = '';
    }

    ngOnInit() {
        this.dataSourceCompany = new JobsDataSource(this.jobsService);
        this.dataSourceGroup = new JobsDataSource(this.jobsService);

        this.dataSourceCompany.loadCompanyDetail(this.userConncode, this.userID, 0, 10, this.job.company, "company_clist");
        if (this.job.companyid != undefined) {
            this.dataSourceGroup.loadGroupDetail(this.userConncode, this.userID, 0, 10, this.job.group, this.job.companyid, "group_clist");
        }

        this.jobForm = this._formBuilder.group({
            name: [null, Validators.required],
            company: [null],
            group: [null],
            filterstring: [null],
        });

        this.setValues();
    }

    ngAfterViewInit() {


        merge(this.paginatorCompany.page)
            .pipe(
                tap(() => {
                    this.loadServiceDetail("company")
                })
            )
            .subscribe((res: any) => {

            });

        merge(this.paginatorGroup.page)
            .pipe(
                tap(() => {
                    this.loadServiceDetail("group")
                })
            )
            .subscribe((res: any) => {

            });
    }

    setValues() {
        this.jobForm.get('name').setValue(this.job.name);
        this.jobForm.get('company').setValue(this.job.companyid);
        this.jobForm.get('group').setValue(this.job.groupid);
        this.jobForm.get('filterstring').setValue(this.filter_string);
    }

    getValue() {

        this.serviceDetail.id = this.job.id;

        this.serviceDetail.name = this.jobForm.get('name').value;
        this.serviceDetail.companyid = this.jobForm.get('company').value;
        this.serviceDetail.groupid = this.jobForm.get('group').value ? this.jobForm.get('group').value : '';
        let currentJob = this.jobsService.jobList.findIndex((service: any) => service.id == this.job.id);
        this.jobsService.jobList[currentJob].id = this.serviceDetail.id;
        this.jobsService.jobList[currentJob].name = this.serviceDetail.name;
        this.jobsService.jobList[currentJob].companyid = this.serviceDetail.companyid;
        this.jobsService.jobList[currentJob].groupid = this.serviceDetail.groupid;
        let clist = this.jobsService.unit_clist_item['company_clist'];

        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id == this.serviceDetail.companyid) {
                this.jobsService.jobList[currentJob].company = clist[i].name;
            }
        }

        let glist = this.jobsService.unit_clist_item['group_clist'];
        for (let i = 0; i < glist.length; i++) {
            if (glist[i].id == this.serviceDetail.groupid) {
                this.jobsService.jobList[currentJob].group = glist[i].name;
            }
        }
        this.flagForSaving.next(true);
    }

    loadServiceDetail(method_string: string) {
        if (method_string == 'company') {
            this.dataSourceCompany.loadCompanyDetail(this.userConncode, this.userID, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'group') {
            let companyid = this.jobForm.get('company').value;

            this.dataSourceGroup.loadGroupDetail(this.userConncode, this.userID, this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, companyid, `${method_string}_clist`)
        }
    }

    managePageIndex(method_string: string) {
        switch (method_string) {
            case 'company':
                this.paginatorCompany.pageIndex = 0;
                break;

            case 'group':
                this.paginatorGroup.pageIndex = 0;
                break;
        }
    }

    showCompanyList(item: string) {
        let methodString = item;
        this.method_string = item.split('_')[0];

        if (this.method_string == 'group' && this.jobForm.get('company').value == '') {
            alert('Please choose company first');
        } else {
            let selected_element_id = this.jobForm.get(`${this.method_string}`).value;
            let clist = this.jobsService.unit_clist_item[methodString];

            for (let i = 0; i < clist.length; i++) {
                if (clist[i].id == selected_element_id) {
                    this.jobForm.get('filterstring').setValue(clist[i].name);
                    this.filter_string = clist[i].name;
                }
            }

            this.managePageIndex(this.method_string);
            this.loadServiceDetail(this.method_string);
        }
    }

    onCompanyChange(event: any) {

        let current_companyID = this.jobForm.get('company').value;
        this.dataSourceGroup.loadGroupDetail(this.userConncode, this.userID, 0, 10, "", current_companyID, "group_clist");
    }

    clearFilter() {

        this.filter_string = '';
        this.jobForm.get('filterstring').setValue(this.filter_string);

        this.managePageIndex(this.method_string);
        this.loadServiceDetail(this.method_string);
    }

    onKey(event: any) {
        this.filter_string = event.target.value;

        if (this.filter_string.length >= 3 || this.filter_string == '') {

            this.managePageIndex(this.method_string);
            this.loadServiceDetail(this.method_string);
        }


    }

    comapnyPagenation(paginator) {
        this.dataSourceCompany.loadCompanyDetail(this.userConncode, this.userID, paginator.pageIndex, paginator.pageSize, this.filter_string, "company_clist");
    }

    groupPagenation(paginator) {
        let companyid = this.jobForm.get('company').value;
        this.dataSourceGroup.loadGroupDetail(this.userConncode, this.userID, paginator.pageIndex, paginator.pageSize, this.filter_string, companyid, "group_clist");
    }

    save() {
        this.getValue();

        if (this.serviceDetail.name == '') {
            alert('Please enter Service Name')
        } else {

            if (this.flagForSaving) {
                this.jobsService.saveJob(this.userConncode, this.userID, this.serviceDetail)
                    .subscribe((result: any) => {

                        if ((result.responseCode == 200) || (result.responseCode == 100)) {
                            alert("Success!");

                            this.flagForSaving.next(false);
                            this.dialogRef.close(this.jobsService.jobList);
                        } else {
                            alert('Failed saving!');
                        }
                    });
            };
        }
    }

    add() {
        this.getNewvalue();

        if (this.serviceDetail.name == '') {
            alert('Please enter Service Name')
        } else {
            if (this.flagForSaving) {
                this.jobsService.saveJob(this.userConncode, this.userID, this.serviceDetail)
                    .subscribe((res: any) => {
                        if ((res.responseCode == 200) || (res.responseCode == 100)) {
                            alert("Success!");

                            this.flagForSaving.next(false);
                            this.dialogRef.close(this.jobsService.jobList);

                        } else {
                            alert('Failed adding!');
                        }
                    });
            } else {

            }
        }
    }

    getNewvalue() {
        this.serviceDetail.id = '0';
        this.serviceDetail.name = this.jobForm.get('name').value;
        this.serviceDetail.companyid = this.jobForm.get('company').value;
        this.serviceDetail.groupid = this.jobForm.get('group').value ? this.jobForm.get('group').value : '';

        let clist = this.jobsService.unit_clist_item['company_clist'];

        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id == this.serviceDetail.companyid) {
                this.serviceDetail.company = clist[i].name;
            }
        }

        let glist = this.jobsService.unit_clist_item['group_clist'];

        for (let i = 0; i < glist.length; i++) {
            if (glist[i].id == this.serviceDetail.groupid) {
                this.serviceDetail.group = glist[i].name;
            }
        }

        this.jobsService.jobList = this.jobsService.jobList.concat(this.serviceDetail);

        this.flagForSaving.next(true);
    }

    close() {
        this.dialogRef.close(this.jobsService.jobList);
    }
}
