import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CarrierDetail } from 'app/main/system/carriers/model/carrier.model';
import { CourseDialogComponent } from "../dialog/dialog.component";
import { Subject, merge, Observable } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { CarrierDetailService } from 'app/main/system/carriers/services/carrier_detail.service';
import { locale as carriersEnglish } from 'app/main/system/carriers/i18n/en';
import { locale as carriersSpanish } from 'app/main/system/carriers/i18n/sp';
import { locale as carriersFrench } from 'app/main/system/carriers/i18n/fr';
import { locale as carriersPortuguese } from 'app/main/system/carriers/i18n/pt';
import { isEmpty, isEqual } from 'lodash';

@Component({
    selector: 'app-carrier-detail',
    templateUrl: './carrier_detail.component.html',
    styleUrls: ['./carrier_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class CarrierDetailComponent implements OnInit {
    carrier_detail: any;
    public carrier: any;
    pageType: string;
    userConncode: string;
    userID: number;
    carrierModel_flag: boolean;
    carrierForm: FormGroup;
    carrierDetail: CarrierDetail = {};
    displayedColumns: string[] = ['name'];
    filter_string: string = '';
    method_string: string = '';
    private _unsubscribeAll: Subject<any>;

    constructor(
        public carrierDetailService: CarrierDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(carriersEnglish, carriersSpanish, carriersFrench, carriersPortuguese);
        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
            console.log(data);
            this.carrier = data;
        });

        if (isEmpty(this.carrier)) {
            this.pageType = 'new';
        } else {
            this.pageType = 'edit';
        }
        this.filter_string = '';
    }

    ngOnInit(): void {
        this.carrierForm = this._formBuilder.group({
            name: [null, Validators.required],
            created: [{ value: '', disabled: true }],
            createdbyname: [{ value: '', disabled: true }],
            deletedwhen: [{ value: '', disabled: true }],
            deletedbyname: [{ value: '', disabled: true }],
            lastmodifieddate: [{ value: '', disabled: true }],
            lastmodifiedbyname: [{ value: '', disabled: true }],
        });

        this.setValues();
        this.carrier_detail = this.carrierForm.value;
    }

    ngAfterViewInit() { }
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    setValues() {
        this.carrierForm.get('name').setValue(this.carrier.name);
        let created = this.carrier.created ? new Date(`${this.carrier.created}`) : '';
        let deletedwhen = this.carrier.deletedwhen ? new Date(`${this.carrier.deletedwhen}`) : '';
        let lastmodifieddate = this.carrier.lastmodifieddate ? new Date(`${this.carrier.lastmodifieddate}`) : '';

        this.carrierForm.get('created').setValue(this.dateFormat(created));
        this.carrierForm.get('createdbyname').setValue(this.carrier.createdbyname);
        this.carrierForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
        this.carrierForm.get('deletedbyname').setValue(this.carrier.deletedbyname);
        this.carrierForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
        this.carrierForm.get('lastmodifiedbyname').setValue(this.carrier.lastmodifiedbyname);
    }

    getValues(dateTime: any, mode: string) {
        const userID: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        this.carrierDetail.name = this.carrierForm.get('name').value || '';
        this.carrierDetail.isactive = this.carrier.isactive || true;
        this.carrierDetail.deletedwhen = this.carrier.deletedwhen || '';
        this.carrierDetail.deletedby = this.carrier.deletedby || 0;
        if (mode == "save") {
            this.carrierDetail.id = this.carrier.id;
            this.carrierDetail.created = this.carrier.created;
            this.carrierDetail.createdby = this.carrier.createdby;
            this.carrierDetail.lastmodifieddate = dateTime;
            this.carrierDetail.lastmodifiedby = userID;
        } else if (mode == "add") {
            this.carrierDetail.id = 0;
            this.carrierDetail.created = dateTime;
            this.carrierDetail.createdby = userID;
            this.carrierDetail.lastmodifieddate = dateTime;
            this.carrierDetail.lastmodifiedby = userID;
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

    saveCarrier(): void {
        let today = new Date().toISOString();
        this.getValues(today, "save");
        if (this.carrierDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.carrierDetailService.saveCarrierDetail(this.carrierDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['system/carriers/carriers']);
                    }
                });
        }
    }

    addCarrier(): void {
        let today = new Date().toISOString();
        this.getValues(today, "add");
        if (this.carrierDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.carrierDetailService.saveCarrierDetail(this.carrierDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['system/carriers/carriers']);
                    }
                });
        }
    }

    goBackUnit() {
        const currentState = this.carrierForm.value;
        console.log(this.carrier_detail, currentState);
        if (isEqual(this.carrier_detail, currentState)) {
            this.router.navigate(['system/carriers/carriers']);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = { carrier: "", flag: flag };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result) {
                    this.router.navigate(['system/carriers/carriers']);
                }
            });
        }
    }
}