import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as serviceitemsEnglish } from 'app/main/logistic/maintenance/serviceitems/i18n/en';
import { locale as serviceitemsFrench } from 'app/main/logistic/maintenance/serviceitems/i18n/fr';
import { locale as serviceitemsPortuguese } from 'app/main/logistic/maintenance/serviceitems/i18n/pt';
import { locale as serviceitemsSpanish } from 'app/main/logistic/maintenance/serviceitems/i18n/sp';
import { ServiceitemDetail } from "app/main/logistic/maintenance/serviceitems/model/serviceitem.model";
import { ServiceitemsDataSource } from "app/main/logistic/maintenance/serviceitems/services/serviceitems.datasource";
import { ServiceitemsService } from 'app/main/logistic/maintenance/serviceitems/services/serviceitems.service';
import { BehaviorSubject, merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'serviceitem-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ServiceItemDialogComponent implements OnInit, OnDestroy {
    serviceitem: ServiceitemDetail = {};
    flag: any;
    serviceitemForm: FormGroup;
    serviceDetail: ServiceitemDetail = {};
    private flagForSaving = new BehaviorSubject<boolean>(false);
    dataSource: ServiceitemsDataSource;
    dataSourceCompany: ServiceitemsDataSource;
    dataSourceGroup: ServiceitemsDataSource;
    filter_string: string = '';
    method_string: string = '';
    displayedColumns: string[] = ['name'];
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginatorCompany: MatPaginator;
    @ViewChild('paginatorGroup', { read: MatPaginator }) paginatorGroup: MatPaginator;

    constructor(
        private router: Router,
        private _formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private serviceitemsService: ServiceitemsService,
        private dialogRef: MatDialogRef<ServiceItemDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(serviceitemsEnglish, serviceitemsSpanish, serviceitemsFrench, serviceitemsPortuguese);
        this.flag = _data.flag;
        if (this.flag == 'edit') {
            this.serviceitem = _data.serviceDetail;
        }
        this.filter_string = '';
    }

    ngOnInit() {
        this.dataSourceCompany = new ServiceitemsDataSource(this.serviceitemsService);
        this.dataSourceGroup = new ServiceitemsDataSource(this.serviceitemsService);
        this.dataSourceCompany.loadCompanyDetail(0, 10, this.serviceitem.company, "company_clist");
        if (this.serviceitem.companyid != undefined) {
            this.dataSourceGroup.loadGroupDetail(0, 10, this.serviceitem.group, this.serviceitem.companyid, "group_clist");
        }

        this.serviceitemForm = this._formBuilder.group({
            name: [null, Validators.required],
            company: [null],
            group: [null],
            filterstring: [null],
        });

        this.setValues();
    }

    ngAfterViewInit() {
        merge(this.paginatorCompany.page)
            .pipe(tap(() => { this.loadServiceDetail("company") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        merge(this.paginatorGroup.page)
            .pipe(tap(() => { this.loadServiceDetail("group") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    setValues() {
        this.serviceitemForm.get('name').setValue(this.serviceitem.name);
        this.serviceitemForm.get('company').setValue(this.serviceitem.companyid);
        this.serviceitemForm.get('group').setValue(this.serviceitem.groupid);
        this.serviceitemForm.get('filterstring').setValue(this.filter_string);
    }

    getValue() {
        this.serviceDetail.id = this.serviceitem.id;
        this.serviceDetail.name = this.serviceitemForm.get('name').value;
        this.serviceDetail.companyid = this.serviceitemForm.get('company').value;
        this.serviceDetail.groupid = this.serviceitemForm.get('group').value ? this.serviceitemForm.get('group').value : '';
        this.serviceDetail.isactive = this.serviceitem.isactive ? this.serviceitem.isactive : 'true';
        let currentServiceItem = this.serviceitemsService.serviceitemList.findIndex((service: any) => service.id == this.serviceitem.id);
        this.serviceitemsService.serviceitemList[currentServiceItem].id = this.serviceDetail.id;
        this.serviceitemsService.serviceitemList[currentServiceItem].name = this.serviceDetail.name;
        this.serviceitemsService.serviceitemList[currentServiceItem].companyid = this.serviceDetail.companyid;
        this.serviceitemsService.serviceitemList[currentServiceItem].groupid = this.serviceDetail.groupid;
        this.serviceitemsService.serviceitemList[currentServiceItem].isactive = this.serviceDetail.isactive;
        let clist = this.serviceitemsService.unit_clist_item['company_clist'];
        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id == this.serviceDetail.companyid) {
                this.serviceitemsService.serviceitemList[currentServiceItem].company = clist[i].name;
            }
        }

        let glist = this.serviceitemsService.unit_clist_item['group_clist'];
        for (let i = 0; i < glist.length; i++) {
            if (glist[i].id == this.serviceDetail.groupid) {
                this.serviceitemsService.serviceitemList[currentServiceItem].group = glist[i].name;
            }
        }

        this.flagForSaving.next(true);
    }


    loadServiceDetail(method_string: string) {
        if (method_string == 'company') {
            this.dataSourceCompany.loadCompanyDetail(this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'group') {
            let companyid = this.serviceitemForm.get('company').value;

            this.dataSourceGroup.loadGroupDetail(this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, companyid, `${method_string}_clist`)
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
        if (this.method_string == 'group' && this.serviceitemForm.get('company').value == '') {
            alert('Please choose company first');
        } else {
            let selected_element_id = this.serviceitemForm.get(`${this.method_string}`).value;
            let clist = this.serviceitemsService.unit_clist_item[methodString];
            for (let i = 0; i < clist.length; i++) {
                if (clist[i].id == selected_element_id) {
                    this.serviceitemForm.get('filterstring').setValue(clist[i].name);
                    this.filter_string = clist[i].name;
                }
            }

            this.managePageIndex(this.method_string);
            this.loadServiceDetail(this.method_string);
        }
    }

    onCompanyChange(event: any) {
        let current_companyID = this.serviceitemForm.get('company').value;
        this.dataSourceGroup.loadGroupDetail(0, 10, "", current_companyID, "group_clist");
    }

    clearFilter() {
        this.filter_string = '';
        this.serviceitemForm.get('filterstring').setValue(this.filter_string);
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
        this.dataSourceCompany.loadCompanyDetail(paginator.pageIndex, paginator.pageSize, this.filter_string, "company_clist");
    }

    groupPagenation(paginator) {
        let companyid = this.serviceitemForm.get('company').value;
        this.dataSourceGroup.loadGroupDetail(paginator.pageIndex, paginator.pageSize, this.filter_string, companyid, "group_clist");
    }

    save() {
        this.getValue();
        if (this.serviceDetail.name == '') {
            alert('Please enter Service Name')
        } else {
            if (this.flagForSaving) {
                this.serviceitemsService.saveServiceitem(this.serviceDetail).pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((result: any) => {
                        if ((result.responseCode == 200) || (result.responseCode == 100)) {
                            alert("Success!");
                            this.flagForSaving.next(false);
                            this.dialogRef.close(this.serviceitemsService.serviceitemList);
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
                this.serviceitemsService.saveServiceitem(this.serviceDetail).pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((res: any) => {
                        if ((res.responseCode == 200) || (res.responseCode == 100)) {
                            alert("Success!");
                            this.flagForSaving.next(false);
                            this.dialogRef.close(this.serviceitemsService.serviceitemList);
                        } else {
                            alert('Failed adding!');
                        }
                    });
            }
        }
    }

    getNewvalue() {
        this.serviceDetail.id = '0';
        this.serviceDetail.name = this.serviceitemForm.get('name').value;
        this.serviceDetail.companyid = this.serviceitemForm.get('company').value;
        this.serviceDetail.groupid = this.serviceitemForm.get('group').value ? this.serviceitemForm.get('group').value : '';
        this.serviceDetail.isactive = this.serviceitem.isactive ? this.serviceitem.isactive : 'true';
        let clist = this.serviceitemsService.unit_clist_item['company_clist'];
        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id == this.serviceDetail.companyid) {
                this.serviceDetail.company = clist[i].name;
            }
        }
        let glist = this.serviceitemsService.unit_clist_item['group_clist'];
        for (let i = 0; i < glist.length; i++) {
            if (glist[i].id == this.serviceDetail.groupid) {
                this.serviceDetail.group = glist[i].name;
            }
        }
        this.serviceitemsService.serviceitemList = this.serviceitemsService.serviceitemList.concat(this.serviceDetail);
        this.flagForSaving.next(true);
    }

    close() {
        this.dialogRef.close(this.serviceitemsService.serviceitemList);
    }
}