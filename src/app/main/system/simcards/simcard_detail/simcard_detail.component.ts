import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as simcardsEnglish } from 'app/main/system/simcards/i18n/en';
import { locale as simcardsFrench } from 'app/main/system/simcards/i18n/fr';
import { locale as simcardsPortuguese } from 'app/main/system/simcards/i18n/pt';
import { locale as simcardsSpanish } from 'app/main/system/simcards/i18n/sp';
import { SimcardDetail } from 'app/main/system/simcards/model/simcard.model';
import { SimcardDetailDataSource } from "app/main/system/simcards/services/simcard_detail.datasource";
import { SimcardDetailService } from 'app/main/system/simcards/services/simcard_detail.service';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";
import { isEmpty, isEqual } from 'lodash';

@Component({
    selector: 'app-simcard-detail',
    templateUrl: './simcard_detail.component.html',
    styleUrls: ['./simcard_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class SimcardDetailComponent implements OnInit {
    simcard_detail: any;
    public simcard: any;
    pageType: string;
    userConncode: string;
    userID: number;
    simcardModel_flag: boolean;
    simcardForm: FormGroup;
    simcardDetail: SimcardDetail = {};
    displayedColumns: string[] = ['name'];
    dataSource: SimcardDetailDataSource;
    dataSourceCarrier: SimcardDetailDataSource;
    filter_string: string = '';
    method_string: string = '';
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginatorCarrier: MatPaginator;

    constructor(
        public simcardDetailService: SimcardDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(simcardsEnglish, simcardsSpanish, simcardsFrench, simcardsPortuguese);
        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
            console.log(data);
            this.simcard = data;
        });
        if (isEmpty(this.simcard)) { this.pageType = 'new'; }
        else { this.pageType = 'edit'; }

        this.filter_string = '';
    }

    ngOnInit(): void {
        this.dataSourceCarrier = new SimcardDetailDataSource(this.simcardDetailService);
        this.dataSourceCarrier.loadSimcardDetail(0, 10, '', "carrier_clist");
        this.simcardForm = this._formBuilder.group({
            name: [null, Validators.required],
            phonenumber: [null, Validators.required],
            carrier: [null, Validators.required],
            created: [{ value: '', disabled: true }],
            createdbyname: [{ value: '', disabled: true }],
            deletedwhen: [{ value: '', disabled: true }],
            deletedbyname: [{ value: '', disabled: true }],
            lastmodifieddate: [{ value: '', disabled: true }],
            lastmodifiedbyname: [{ value: '', disabled: true }],
            filterstring: [null],
        });

        this.setValues();
        this.simcard_detail = this.simcardForm.value;
    }

    ngAfterViewInit() {
        merge(this.paginatorCarrier.page)
            .pipe(tap(() => { this.loadSimcardDetail("carrier") }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadSimcardDetail(method_string: string) {
        if (method_string == 'produccarrierttype') {
            this.dataSourceCarrier.loadSimcardDetail(this.paginatorCarrier.pageIndex, this.paginatorCarrier.pageSize, "", `${method_string}_clist`)
        }
    }

    managePageIndex(method_string: string) {
        switch (method_string) {
            case 'carrier':
                this.paginatorCarrier.pageIndex = 0;
                break;
        }
    }

    showCompanyList(item: string) {
        let methodString = item;
        this.method_string = item.split('_')[0];
        let selected_element_id = this.simcardForm.get(`${this.method_string}`).value;
        let clist = this.simcardDetailService.unit_clist_item[methodString];
        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id == selected_element_id) {
                this.simcardForm.get('filterstring').setValue(clist[i].name);
                this.filter_string = clist[i].name;
            }
        }

        this.managePageIndex(this.method_string);
        this.loadSimcardDetail(this.method_string);
    }

    clearFilter() {
        this.filter_string = '';
        this.simcardForm.get('filterstring').setValue(this.filter_string);
        this.managePageIndex(this.method_string);
        this.loadSimcardDetail(this.method_string);
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadSimcardDetail(this.method_string);
        }
    }

    setValues() {
        this.simcardForm.get('name').setValue(this.simcard.name);
        this.simcardForm.get('phonenumber').setValue(this.simcard.phonenumber);
        this.simcardForm.get('carrier').setValue(Number(this.simcard.carrierid));

        let created = this.simcard.created ? new Date(`${this.simcard.created}`) : '';
        let deletedwhen = this.simcard.deletedwhen ? new Date(`${this.simcard.deletedwhen}`) : '';
        let lastmodifieddate = this.simcard.lastmodifieddate ? new Date(`${this.simcard.lastmodifieddate}`) : '';

        this.simcardForm.get('created').setValue(this.dateFormat(created));
        this.simcardForm.get('createdbyname').setValue(this.simcard.createdbyname);
        this.simcardForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
        this.simcardForm.get('deletedbyname').setValue(this.simcard.deletedbyname);
        this.simcardForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
        this.simcardForm.get('lastmodifiedbyname').setValue(this.simcard.lastmodifiedbyname);
        this.simcardForm.get('filterstring').setValue(this.filter_string);
    }

    getValues(dateTime: any, mode: string) {
        this.simcardDetail.name = this.simcardForm.get('name').value || '';
        this.simcardDetail.phonenumber = this.simcardForm.get('phonenumber').value || '';
        this.simcardDetail.carrierid = this.simcardForm.get('carrier').value || 0;
        this.simcardDetail.isactive = this.simcard.isactive || true;
        this.simcardDetail.deletedwhen = this.simcard.deletedwhen || '';
        this.simcardDetail.deletedby = this.simcard.deletedby || 0;

        if (mode == "save") {
            this.simcardDetail.id = this.simcard.id;
            this.simcardDetail.created = this.simcard.created;
            this.simcardDetail.createdby = this.simcard.createdby;
            this.simcardDetail.lastmodifieddate = dateTime;
            this.simcardDetail.lastmodifiedby = this.userID;
        } else if (mode == "add") {
            this.simcardDetail.id = 0;
            this.simcardDetail.created = dateTime;
            this.simcardDetail.createdby = this.userID;
            this.simcardDetail.lastmodifieddate = dateTime;
            this.simcardDetail.lastmodifiedby = this.userID;
        }
    }

    dateFormat(date: any) {
        let str = '';
        if (date != '') {
            str =
                ("00" + (date.getMonth() + 1)).slice(-2)
                + "/" + ("00" + date.getDate()).slice(-2)
                + "/" + date.getFullYear() + " "
                + ("00" + date.getHours()).slice(-2) + ":"
                + ("00" + date.getMinutes()).slice(-2)
                + ":" + ("00" + date.getSeconds()).slice(-2);
        }
        return str;
    }

    saveSimcard(): void {
        let today = new Date().toISOString();
        this.getValues(today, "save");
        if (this.simcardDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.simcardDetailService.saveSimcardDetail(this.simcardDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['system/simcards/simcards']);
                    }
                });
        }
    }

    addSimcard(): void {
        let today = new Date().toISOString();
        this.getValues(today, "add");
        if (this.simcardDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.simcardDetailService.saveSimcardDetail(this.simcardDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['system/simcards/simcards']);
                    }
                });
        }
    }

    goBackUnit() {
        const currentState = this.simcardForm.value;
        console.log(this.simcard_detail, currentState);
        if (isEqual(this.simcard_detail, currentState)) {
            this.router.navigate(['system/simcards/simcards']);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = { simcard: "", flag: flag };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result == 'goback') {
                    this.router.navigate(['system/simcards/simcards']);
                }
            });
        }
    }
}