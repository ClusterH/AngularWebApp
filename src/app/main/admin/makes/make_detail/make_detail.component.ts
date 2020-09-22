import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as makesEnglish } from 'app/main/admin/makes/i18n/en';
import { locale as makesFrench } from 'app/main/admin/makes/i18n/fr';
import { locale as makesPortuguese } from 'app/main/admin/makes/i18n/pt';
import { locale as makesSpanish } from 'app/main/admin/makes/i18n/sp';
import { MakeDetail } from 'app/main/admin/makes/model/make.model';
import { MakeDetailService } from 'app/main/admin/makes/services/make_detail.service';
import { isEmpty, isEqual } from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'app-make-detail',
    templateUrl: './make_detail.component.html',
    styleUrls: ['./make_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class MakeDetailComponent implements OnInit {
    make_detail: any;
    public make: any;
    pageType: string;
    userConncode: string;
    userID: number;
    makeForm: FormGroup;
    makeDetail: MakeDetail = {};
    displayedColumns: string[] = ['name'];
    filter_string: string = '';
    method_string: string = '';
    private _unsubscribeAll: Subject<any>;

    constructor(
        public makeDetailService: MakeDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(makesEnglish, makesSpanish, makesFrench, makesPortuguese);
        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
            console.log(data);
            this.make = data;
        });
        if (isEmpty(this.make)) {
            this.pageType = 'new';
        } else {
            this.pageType = 'edit';
        }
        this.filter_string = '';
    }

    ngOnInit(): void {
        this.makeForm = this._formBuilder.group({
            name: [null, Validators.required],
            isactive: [null, Validators.required],
            created: [{ value: '', disabled: true }],
            createdbyname: [{ value: '', disabled: true }],
            lastmodifieddate: [{ value: '', disabled: true }],
            lastmodifiedbyname: [{ value: '', disabled: true }],
        });

        this.setValues();
        this.make_detail = this.makeForm.value;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    setValues() {
        this.makeForm.get('name').setValue(this.make.name);
        let created = this.make.createdwhen ? new Date(`${this.make.createdwhen}`) : '';
        let lastmodifieddate = this.make.lastmodifieddate ? new Date(`${this.make.lastmodifieddate}`) : '';
        this.makeForm.get('created').setValue(this.dateFormat(created));
        this.makeForm.get('createdbyname').setValue(this.make.createdbyname);
        this.makeForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
        this.makeForm.get('lastmodifiedbyname').setValue(this.make.lastmodifiedbyname);
    }

    getValues(dateTime: any, mode: string) {
        const userID: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        this.makeDetail.name = this.makeForm.get('name').value || '';
        this.makeDetail.isactive = this.make.isactive || true;
        if (mode == "save") {
            this.makeDetail.id = this.make.id;
            this.makeDetail.createdwhen = this.make.createdwhen;
            this.makeDetail.createdby = this.make.createdby;
            this.makeDetail.lastmodifieddate = dateTime;
            this.makeDetail.lastmodifiedby = userID;
        } else if (mode == "add") {
            this.makeDetail.id = 0;
            this.makeDetail.createdwhen = dateTime;
            this.makeDetail.createdby = userID;
            this.makeDetail.lastmodifieddate = dateTime;
            this.makeDetail.lastmodifiedby = userID;
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

    saveMake(): void {
        let today = new Date().toISOString();
        this.getValues(today, "save");
        if (this.makeDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.makeDetailService.saveMakeDetail(this.makeDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['admin/makes/makes']);
                    }
                });
        }
    }

    addMake(): void {
        let today = new Date().toISOString();
        this.getValues(today, "add");
        if (this.makeDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.makeDetailService.saveMakeDetail(this.makeDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['admin/makes/makes']);
                    }
                });
        }
    }

    goBackUnit() {
        this.filter_string = '';
        this.makeForm.get('filterstring').setValue(this.filter_string);
        const currentState = this.makeForm.value;
        console.log(this.make_detail, currentState);
        if (isEqual(this.make_detail, currentState)) {
            this.router.navigate(['admin/makes/makes']);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = { make: "", flag: flag };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result == 'goback') {
                    this.router.navigate(['admin/makes/makes']);
                }
            });
        }
    }
}