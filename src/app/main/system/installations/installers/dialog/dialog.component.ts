import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge, BehaviorSubject, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { InstallersService } from 'app/main/system/installations/installers/services/installers.service';
import { InstallersDataSource } from "app/main/system/installations/installers/services/installers.datasource"
import { InstallerDetail } from "app/main/system/installations/installers/model/installer.model"
import { locale as installersEnglish } from 'app/main/system/installations/installers/i18n/en';
import { locale as installersSpanish } from 'app/main/system/installations/installers/i18n/sp';
import { locale as installersFrench } from 'app/main/system/installations/installers/i18n/fr';
import { locale as installersPortuguese } from 'app/main/system/installations/installers/i18n/pt';

@Component({
    selector: 'installer-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InstallerDialogComponent implements OnInit {
    installer: InstallerDetail = {};
    flag: any;
    installerForm: FormGroup;
    serviceDetail: InstallerDetail = {};

    userConncode: string;
    userID: number;

    private flagForSaving = new BehaviorSubject<boolean>(false);

    dataSource: InstallersDataSource;
    dataSourceCompany: InstallersDataSource;
    dataSourceGroup: InstallersDataSource;

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
        private installersService: InstallersService,
        private dialogRef: MatDialogRef<InstallerDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(installersEnglish, installersSpanish, installersFrench, installersPortuguese);
        this.flag = _data.flag;

        if (this.flag == 'edit') {
            this.installer = _data.serviceDetail;

        } else {

        }

        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

        this.filter_string = '';
    }

    ngOnInit() {
        this.dataSourceCompany = new InstallersDataSource(this.installersService);
        this.dataSourceGroup = new InstallersDataSource(this.installersService);

        this.dataSourceCompany.loadCompanyDetail(this.userConncode, this.userID, 0, 10, this.installer.company, "company_clist");
        if (this.installer.companyid != undefined) {
            this.dataSourceGroup.loadGroupDetail(this.userConncode, this.userID, 0, 10, this.installer.group, this.installer.companyid, "group_clist");
        }

        this.installerForm = this._formBuilder.group({
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
        this.installerForm.get('name').setValue(this.installer.name);
        this.installerForm.get('company').setValue(this.installer.companyid);
        this.installerForm.get('group').setValue(this.installer.groupid);
        this.installerForm.get('filterstring').setValue(this.filter_string);
    }

    getValue() {

        this.serviceDetail.id = this.installer.id;

        this.serviceDetail.name = this.installerForm.get('name').value;
        this.serviceDetail.companyid = this.installerForm.get('company').value;
        this.serviceDetail.groupid = this.installerForm.get('group').value ? this.installerForm.get('group').value : '';
        let currentInstaller = this.installersService.installerList.findIndex((service: any) => service.id == this.installer.id);
        this.installersService.installerList[currentInstaller].id = this.serviceDetail.id;
        this.installersService.installerList[currentInstaller].name = this.serviceDetail.name;
        this.installersService.installerList[currentInstaller].companyid = this.serviceDetail.companyid;
        this.installersService.installerList[currentInstaller].groupid = this.serviceDetail.groupid;
        let clist = this.installersService.unit_clist_item['company_clist'];

        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id == this.serviceDetail.companyid) {
                this.installersService.installerList[currentInstaller].company = clist[i].name;
            }
        }

        let glist = this.installersService.unit_clist_item['group_clist'];
        for (let i = 0; i < glist.length; i++) {
            if (glist[i].id == this.serviceDetail.groupid) {
                this.installersService.installerList[currentInstaller].group = glist[i].name;
            }
        }
        this.flagForSaving.next(true);
    }

    loadServiceDetail(method_string: string) {
        if (method_string == 'company') {
            this.dataSourceCompany.loadCompanyDetail(this.userConncode, this.userID, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'group') {
            let companyid = this.installerForm.get('company').value;

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

        if (this.method_string == 'group' && this.installerForm.get('company').value == '') {
            alert('Please choose company first');
        } else {
            let selected_element_id = this.installerForm.get(`${this.method_string}`).value;
            let clist = this.installersService.unit_clist_item[methodString];

            for (let i = 0; i < clist.length; i++) {
                if (clist[i].id == selected_element_id) {
                    this.installerForm.get('filterstring').setValue(clist[i].name);
                    this.filter_string = clist[i].name;
                }
            }

            this.managePageIndex(this.method_string);
            this.loadServiceDetail(this.method_string);
        }
    }

    onCompanyChange(event: any) {

        let current_companyID = this.installerForm.get('company').value;
        this.dataSourceGroup.loadGroupDetail(this.userConncode, this.userID, 0, 10, "", current_companyID, "group_clist");
    }

    clearFilter() {

        this.filter_string = '';
        this.installerForm.get('filterstring').setValue(this.filter_string);

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
        let companyid = this.installerForm.get('company').value;
        this.dataSourceGroup.loadGroupDetail(this.userConncode, this.userID, paginator.pageIndex, paginator.pageSize, this.filter_string, companyid, "group_clist");
    }

    save() {
        this.getValue();

        if (this.serviceDetail.name == '') {
            alert('Please enter Service Name')
        } else {

            if (this.flagForSaving) {
                this.installersService.saveInstaller(this.userConncode, this.userID, this.serviceDetail)
                    .subscribe((result: any) => {

                        if ((result.responseCode == 200) || (result.responseCode == 100)) {
                            alert("Success!");

                            this.flagForSaving.next(false);
                            this.dialogRef.close(this.installersService.installerList);
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
                this.installersService.saveInstaller(this.userConncode, this.userID, this.serviceDetail)
                    .subscribe((res: any) => {
                        if ((res.responseCode == 200) || (res.responseCode == 100)) {
                            alert("Success!");

                            this.flagForSaving.next(false);
                            this.dialogRef.close(this.installersService.installerList);

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
        this.serviceDetail.name = this.installerForm.get('name').value;
        this.serviceDetail.companyid = this.installerForm.get('company').value;
        this.serviceDetail.groupid = this.installerForm.get('group').value ? this.installerForm.get('group').value : '';

        let clist = this.installersService.unit_clist_item['company_clist'];

        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id == this.serviceDetail.companyid) {
                this.serviceDetail.company = clist[i].name;
            }
        }

        let glist = this.installersService.unit_clist_item['group_clist'];

        for (let i = 0; i < glist.length; i++) {
            if (glist[i].id == this.serviceDetail.groupid) {
                this.serviceDetail.group = glist[i].name;
            }
        }

        this.installersService.installerList = this.installersService.installerList.concat(this.serviceDetail);

        this.flagForSaving.next(true);
    }

    close() {
        this.dialogRef.close(this.installersService.installerList);
    }
}
