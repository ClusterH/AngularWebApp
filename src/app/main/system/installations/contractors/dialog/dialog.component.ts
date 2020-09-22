import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { ContractorsDataSource } from "app/main/system/installations/contractors/services/contractors.datasource"
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge, BehaviorSubject, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ContractorsService } from 'app/main/system/installations/contractors/services/contractors.service';
import { ContractorDetail } from "app/main/system/installations/contractors/model/contractor.model"
import { locale as contractorsEnglish } from 'app/main/system/installations/contractors/i18n/en';
import { locale as contractorsSpanish } from 'app/main/system/installations/contractors/i18n/sp';
import { locale as contractorsFrench } from 'app/main/system/installations/contractors/i18n/fr';
import { locale as contractorsPortuguese } from 'app/main/system/installations/contractors/i18n/pt';

@Component({
    selector: 'contractor-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContractorDialogComponent implements OnInit {
    contractor: ContractorDetail = {};
    flag: any;
    contractorForm: FormGroup;
    contractorDetail: ContractorDetail = {};
    private flagForSaving = new BehaviorSubject<boolean>(false);
    dataSourceCarrier: ContractorsDataSource;
    displayedColumns: string[] = ['name'];
    filter_string: string = '';
    method_string: string = '';
    @ViewChild(MatPaginator, { static: true })
    paginatorCarrier: MatPaginator;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private router: Router,
        private _formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private contractorsService: ContractorsService,
        private dialogRef: MatDialogRef<ContractorDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(contractorsEnglish, contractorsSpanish, contractorsFrench, contractorsPortuguese);
        this.flag = _data.flag;

        if (this.flag == 'edit') {
            this.contractor = _data.contractorDetail;
        } else {

        }
        this.filter_string = '';

    }

    ngOnInit() {
        this.dataSourceCarrier = new ContractorsDataSource(this.contractorsService);

        this.dataSourceCarrier.loadCarrierDetail(0, 10, this.contractor.carrier, "carrier_clist");
        this.contractorForm = this._formBuilder.group({
            name: [null, Validators.required],
            email: [null],
            contactname: [null],
            number: [null],
            noofinstallers: [null],
            carrier: [null],
            filterstring: [null],

        });

        this.setValues();
    }

    ngAfterViewInit() {
        merge(this.paginatorCarrier.page).pipe(tap(() => { this.loadContractorDetail("carrier") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
    }
    setValues() {
        this.contractorForm.get('name').setValue(this.contractor.name);
        this.contractorForm.get('contactname').setValue(this.contractor.contactname);
        this.contractorForm.get('number').setValue(this.contractor.contactphonenumber);
        this.contractorForm.get('email').setValue(this.contractor.notificationemail);
        this.contractorForm.get('noofinstallers').setValue(this.contractor.notificationcellphone);
        this.contractorForm.get('carrier').setValue(this.contractor.carrierid);
        this.contractorForm.get('filterstring').setValue(this.filter_string);

    }
    getValue() {
        this.contractorDetail.id = this.contractor.id;
        this.contractorDetail.name = this.contractorForm.get('name').value;
        this.contractorDetail.contactname = this.contractorForm.get('contactname').value;
        this.contractorDetail.contactphonenumber = this.contractorForm.get('number').value;
        this.contractorDetail.notificationemail = this.contractorForm.get('email').value;
        this.contractorDetail.notificationcellphone = this.contractorForm.get('noofinstallers').value;
        this.contractorDetail.carrierid = this.contractorForm.get('carrier').value;
        this.contractorDetail.isactive = this.contractor.isactive;
        this.contractorDetail.deletedby = this.contractor.deletedby;
        this.contractorDetail.deletedwhen = this.contractor.deletedwhen;
        this.contractorDetail.username = this.contractor.username;
        this.contractorDetail.password = this.contractor.password;

        let currentContractor = this.contractorsService.contractorList.findIndex((service: any) => service.id == this.contractor.id);
        this.contractorsService.contractorList[currentContractor].id = this.contractorDetail.id;
        this.contractorsService.contractorList[currentContractor].name = this.contractorDetail.name;
        this.contractorsService.contractorList[currentContractor].contactname = this.contractorDetail.contactname;
        this.contractorsService.contractorList[currentContractor].contactphonenumber = this.contractorDetail.contactphonenumber;
        this.contractorsService.contractorList[currentContractor].notificationemail = this.contractorDetail.notificationemail;
        this.contractorsService.contractorList[currentContractor].notificationcellphone = this.contractorDetail.notificationcellphone;
        this.contractorsService.contractorList[currentContractor].carrierid = this.contractorDetail.carrierid;
        this.contractorsService.contractorList[currentContractor].isactive = this.contractorDetail.isactive;
        this.contractorsService.contractorList[currentContractor].deleteby = this.contractorDetail.deletedby;
        this.contractorsService.contractorList[currentContractor].deletewhen = this.contractorDetail.deletedwhen;
        this.contractorsService.contractorList[currentContractor].username = this.contractorDetail.username;
        this.contractorsService.contractorList[currentContractor].password = this.contractorDetail.password;

        let clist = this.contractorsService.unit_clist_item['carrier_clist'];

        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id == this.contractorDetail.carrierid) {
                this.contractorsService.contractorList[currentContractor].carrier = clist[i].name;
            }
        }
        this.flagForSaving.next(true);
    }
    getNewvalue() {
        this.contractorDetail.id = '0';
        this.contractorDetail.name = this.contractorForm.get('name').value;
        this.contractorDetail.contactname = this.contractorForm.get('contactname').value;
        this.contractorDetail.contactphonenumber = this.contractorForm.get('number').value;
        this.contractorDetail.notificationemail = this.contractorForm.get('email').value;
        this.contractorDetail.notificationcellphone = this.contractorForm.get('noofinstallers').value;

        this.contractorsService.contractorList = this.contractorsService.contractorList.concat(this.contractorDetail);
        this.flagForSaving.next(true);
    }

    loadContractorDetail(method_string: string) {
        if (method_string == 'carrier') {
            this.dataSourceCarrier.loadCarrierDetail(this.paginatorCarrier.pageIndex, this.paginatorCarrier.pageSize, this.filter_string, `${method_string}_clist`)
        }
    }

    managePageIndex(method_string: string) {
        switch (method_string) {
            case 'company':
                this.paginatorCarrier.pageIndex = 0;
                break;
        }
    }

    showCarrierList(item: string) {
        let methodString = item;
        this.method_string = item.split('_')[0];
        let selected_element_id = this.contractorForm.get(`${this.method_string}`).value;
        let clist = this.contractorsService.unit_clist_item[methodString];

        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id == selected_element_id) {
                this.contractorForm.get('filterstring').setValue(clist[i].name);
                this.filter_string = clist[i].name;
            }
        }

        this.managePageIndex(this.method_string);
        this.loadContractorDetail(this.method_string);
    }

    clearFilter() {
        this.filter_string = '';
        this.contractorForm.get('filterstring').setValue(this.filter_string);
        this.managePageIndex(this.method_string);
        this.loadContractorDetail(this.method_string);
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadContractorDetail(this.method_string);
        }
    }

    carrierPagenation(paginator) {
        this.dataSourceCarrier.loadCarrierDetail(paginator.pageIndex, paginator.pageSize, this.filter_string, "carrier_clist");
    }

    save() {
        this.getValue();
        if (this.contractorDetail.name == '') {
            alert('Please enter Service Name')
        } else {
            if (this.flagForSaving) {
                this.contractorsService.saveContractor(this.contractorDetail).pipe(takeUntil(this._unsubscribeAll)).subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.flagForSaving.next(false);
                        this.dialogRef.close(this.contractorsService.contractorList);
                    } else {
                        alert('Failed saving!');
                    }
                });
            };
        }
    }

    add() {
        this.getNewvalue();
        if (this.contractorDetail.name == '') {
            alert('Please enter Service Name')
        } else {
            if (this.flagForSaving) {
                this.contractorsService.saveContractor(this.contractorDetail).pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {
                    if ((res.responseCode == 200) || (res.responseCode == 100)) {
                        alert("Success!");

                        this.flagForSaving.next(false);
                        this.dialogRef.close(this.contractorsService.contractorList);
                    } else {
                        alert('Failed adding!');
                    }
                });
            }
        }
    }
    close() {
        this.dialogRef.close(this.contractorsService.contractorList);
    }
}