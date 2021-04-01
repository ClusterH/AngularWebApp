import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as dashboardsEnglish } from 'app/main/system/dashboards/i18n/en';
import { locale as dashboardsFrench } from 'app/main/system/dashboards/i18n/fr';
import { locale as dashboardsPortuguese } from 'app/main/system/dashboards/i18n/pt';
import { locale as dashboardsSpanish } from 'app/main/system/dashboards/i18n/sp';
import { DashboardDetail } from 'app/main/system/dashboards/model/dashboard.model';
import { DashboardDetailService } from 'app/main/system/dashboards/services/dashboard_detail.service';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";
import { isEmpty, isEqual } from 'lodash';
import { faUser, faBuilding } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-dashboard-detail',
    templateUrl: './dashboard_detail.component.html',
    styleUrls: ['./dashboard_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class DashboardDetailComponent implements OnInit, OnDestroy {
    dashboard_detail: any;
    public dashboard: any;
    userConncode: string;
    userID: number;
    dashboardForm: FormGroup;
    dashboardDetail: DashboardDetail = {};
    method_string: string = '';
    isTimeSelected: boolean = false;
    isGroupSelected: boolean = false;
    dashboardclips_Clist: Array<any>;
    dashboardusers_Clist: Array<any>;
    clip_img_url: string = 'assets/icons/dashboard/'
    faUser = faUser;
    faBuilding = faBuilding;
    private _unsubscribeAll: Subject<any>;

    constructor(
        public dashboardDetailService: DashboardDetailService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute
    ) {
        this._fuseTranslationLoaderService.loadTranslations(dashboardsEnglish, dashboardsSpanish, dashboardsFrench, dashboardsPortuguese);
        this._unsubscribeAll = new Subject();
        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
            this.dashboard = data;

        });
    }

    ngOnInit(): void {
        this.dashboardForm = this._formBuilder.group({
            name: [null, Validators.required],
            createdbyname: [{ value: '', disabled: true }],
        });
        this.setValues();
        this.dashboardDetailService.getClip_List(this.dashboard.id, 'GetDashboardClips').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {

            this.dashboardclips_Clist = res.TrackingXLAPI.DATA;
        });
        this.dashboardDetailService.getClip_List(this.dashboard.id, 'GetDashboardUsers').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {

            this.dashboardusers_Clist = res.TrackingXLAPI.DATA;
        });
        this.dashboard_detail = this.dashboardForm.value;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    setValues() {
        this.dashboardForm.get('name').setValue(this.dashboard.name);
        this.dashboardForm.get('createdbyname').setValue(this.dashboard.user);
        this.isTimeSelected = (this.dashboard.timeselection == 'true') ? true : false;
        this.isGroupSelected = (this.dashboard.groupselection == 'true') ? true : false;
    }

    getValues(dateTime: any, mode: string) {
        const userID: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        this.dashboardDetail.name = this.dashboardForm.get('name').value || '';
        this.dashboardDetail.createdbyname = this.dashboardForm.get('createdbyname').value || '';
    }

    saveDashboard(): void {
        const today = new Date().toISOString();
        this.getValues(today, "save");
        if (this.dashboardDetail.name == '') {
            alert('Please enter Detail Name')
        } else {
            this.dashboardDetail.id = this.dashboard.id;
            this.dashboardDetail.isactive = this.dashboard.isactive;
            this.dashboardDetail.userid = this.dashboard.userid;
            this.dashboardDetail.timeselection = this.isTimeSelected;
            this.dashboardDetail.groupselection = this.isGroupSelected;
            this.dashboardDetailService.saveDashboardDetail(this.dashboardDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['system/dashboards/dashboards']);
                    }
                });
        }
    }

    goBackUnit() {
        const currentState = this.dashboardForm.value;

        if (isEqual(this.dashboard_detail, currentState)) {
            this.router.navigate(['system/dashboards/dashboards']);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = { dashboard: "", flag: flag };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result) {
                    this.router.navigate(['system/dashboards/dashboards']);
                }
            });
        }
    }
}