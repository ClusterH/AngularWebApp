import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as syscommandsEnglish } from 'app/main/system/syscommands/i18n/en';
import { locale as syscommandsFrench } from 'app/main/system/syscommands/i18n/fr';
import { locale as syscommandsPortuguese } from 'app/main/system/syscommands/i18n/pt';
import { locale as syscommandsSpanish } from 'app/main/system/syscommands/i18n/sp';
import { SysCommandDetail } from 'app/main/system/syscommands/model/syscommand.model';
import { SysCommandDetailService } from 'app/main/system/syscommands/services/syscommand_detail.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";
import { isEmpty, isEqual } from 'lodash';

@Component({
    selector: 'app-syscommand-detail',
    templateUrl: './syscommand_detail.component.html',
    styleUrls: ['./syscommand_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class SysCommandDetailComponent implements OnInit {
    syscommand_detail: any;
    public syscommand: any;
    pageType: string;
    userConncode: string;
    userID: number;
    syscommandForm: FormGroup;
    syscommandDetail: SysCommandDetail = {};
    displayedColumns: string[] = ['name'];
    filter_string: string = '';
    method_string: string = '';
    private _unsubscribeAll: Subject<any>;

    constructor(
        public syscommandDetailService: SysCommandDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute
    ) {
        this._fuseTranslationLoaderService.loadTranslations(syscommandsEnglish, syscommandsSpanish, syscommandsFrench, syscommandsPortuguese);
        this._unsubscribeAll = new Subject();
        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {

            this.syscommand = data;
        });

        if (isEmpty(this.syscommand)) { this.pageType = 'new'; }
        else { this.pageType = 'edit'; }

        this.filter_string = '';
    }

    ngOnInit(): void {
        this.syscommandForm = this._formBuilder.group({
            name: [null, Validators.required],
            isactive: [null],
            created: [{ value: '', disabled: true }],
            createdbyname: [{ value: '', disabled: true }],
            lastmodifieddate: [{ value: '', disabled: true }],
            lastmodifiedbyname: [{ value: '', disabled: true }],
        });

        this.setValues();
        this.syscommand_detail = this.syscommandForm.value;
    }

    setValues() {
        this.syscommandForm.get('name').setValue(this.syscommand.name);
        let created = this.syscommand.createdwhen ? new Date(`${this.syscommand.createdwhen}`) : '';
        let lastmodifieddate = this.syscommand.lastmodifieddate ? new Date(`${this.syscommand.lastmodifieddate}`) : '';
        this.syscommandForm.get('created').setValue(this.dateFormat(created));
        this.syscommandForm.get('createdbyname').setValue(this.syscommand.createdbyname);
        this.syscommandForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
        this.syscommandForm.get('lastmodifiedbyname').setValue(this.syscommand.lastmodifiedbyname);
    }

    getValues(dateTime: any, mode: string) {
        const userID: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        this.syscommandDetail.name = this.syscommandForm.get('name').value || '';
        this.syscommandDetail.isactive = this.syscommand.isactive || true;

        if (mode == "save") {
            this.syscommandDetail.id = this.syscommand.id;
            this.syscommandDetail.createdwhen = this.syscommand.createdwhen;
            this.syscommandDetail.createdby = this.syscommand.createdby;
            this.syscommandDetail.lastmodifieddate = dateTime;
            this.syscommandDetail.lastmodifiedby = userID;
        } else if (mode == "add") {
            this.syscommandDetail.id = 0;
            this.syscommandDetail.createdwhen = dateTime;
            this.syscommandDetail.createdby = userID;
            this.syscommandDetail.lastmodifieddate = dateTime;
            this.syscommandDetail.lastmodifiedby = userID;
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

    saveSysCommand(): void {
        let today = new Date().toISOString();
        this.getValues(today, "save");
        if (this.syscommandDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.syscommandDetailService.saveSysCommandDetail(this.syscommandDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['system/syscommands/syscommands']);
                    }
                });
        }
    }

    addSysCommand(): void {
        let today = new Date().toISOString();
        this.getValues(today, "add");
        if (this.syscommandDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.syscommandDetailService.saveSysCommandDetail(this.syscommandDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['system/syscommands/syscommands']);
                    }
                });
        }
    }

    goBackUnit() {
        const currentState = this.syscommandForm.value;

        if (isEqual(this.syscommand_detail, currentState)) {
            this.router.navigate(['system/syscommands/syscommands']);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = { syscommand: "", flag: flag };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result) {
                    this.router.navigate(['system/syscommands/syscommands']);
                }
            });
        }
    }
}