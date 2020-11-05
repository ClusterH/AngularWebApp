import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { fuseAnimations } from '@fuse/animations';
import { AnalyticsDashboardService } from 'app/main/home/analytics/analytics.service';
import { LayoutComponent } from 'app/main/home/analytics/components/layout/layout.component';
import { CourseDialogComponent } from "app/main/home/analytics/dialog/mileagedialog/dialog.component";
import { WIDGET_MODEL } from 'app/main/home/analytics/model/clip.model';
import { LayoutService } from 'app/main/home/analytics/services/layout.service';
import { ClipsService } from 'app/main/home/analytics/services/clips.service';
import { isEmpty, isEqual } from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as vehiclesEnglish } from 'app/main/home/analytics/i18n/en';
import { locale as vehiclesFrench } from 'app/main/home/analytics/i18n/fr';
import { locale as vehiclesPortuguese } from 'app/main/home/analytics/i18n/pt';
import { locale as vehiclesSpanish } from 'app/main/home/analytics/i18n/sp';

@Component({
    selector: 'analytics-dashboard',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AnalyticsDashboardComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    dateRangeForm: FormGroup;
    isToggled: boolean = false;
    selectedTime = '';
    selectedGroup = '';
    selectedOption: any = {};
    fromDate: string = '';
    toDate: string = '';
    activatedTabIndex: number = 0;
    disabled_tab: boolean = false;
    dashboard_Clist: any = [];
    temp_dashboard_Clist: any = [];
    dashboardclips_Clist: any = [];
    isEditClips: boolean = false;
    clip_img_url: string = 'assets/icons/dashboard/'
    widgets: Array<any> = [];
    temp_widgets: Array<any> = [];
    currentTab_widgets: Array<any> = [];
    isNewDashboard: boolean = false;
    isNewClip: boolean = false;

    @ViewChild(LayoutComponent) layoutComponent: LayoutComponent;
    @ViewChild('tabs', { static: true }) tabs: MatTabGroup;
    /**
     * Constructor
     *
     * @param {AnalyticsDashboardService} _analyticsDashboardService
     */
    constructor(
        private _analyticsDashboardService: AnalyticsDashboardService,
        public layoutService: LayoutService,
        public clipSservice: ClipsService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(vehiclesEnglish, vehiclesSpanish, vehiclesFrench, vehiclesPortuguese);
        // this.currentTab_widgets = this.widgets.filter(widget => widget.dashboardid == 0);
        //
    }

    ngOnInit(): void {
        this.dateRangeForm = this._formBuilder.group({
            date: [null],
        });
        this._analyticsDashboardService.dashboardClist(0, 10, '', 'dashboard_Clist').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            if (res.responseCode == 100) {
                res.TrackingXLAPI.DATA.sort((a, b) => this.sortByDistance(a.id, b.id));
                this.dashboard_Clist = res.TrackingXLAPI.DATA;
                console.log('dashboard_Clist===>>>', this.dashboard_Clist);
                this.temp_dashboard_Clist = this.dashboard_Clist.map(dashboard => ({ ...dashboard }));
                this._analyticsDashboardService.dashboardClist(0, 10, '', 'dashboardclips_Clist').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                    this.dashboardclips_Clist = res.TrackingXLAPI.DATA;
                    console.log('dashboardclips_Clist===>>>', this.dashboardclips_Clist);

                    this.dashboardclips_Clist.sort((a, b) => this.sortByDistance(a.id, b.id));
                    this._analyticsDashboardService.getDashboardClips().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                        if (res.responseCode == 100) {
                            res.TrackingXLAPI.DATA.sort((a, b) => this.sortByDistance(a.id, b.id));
                            this.widgets = res.TrackingXLAPI.DATA;
                            console.log('widgets===>>>', this.widgets);
                            this.temp_widgets = this.widgets.map(widget => ({ ...widget }));

                            this.loadingSubject.next(true);
                            setTimeout(() => {
                                this.tabChanged();
                            }, 500);
                        };
                    });
                });
            };
        });
    }
    ngOnDestroy(): void {
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onChangeToggle(event: any) {
        if (this.isEditClips) return;
        console.log('toggleEvent===>>>', event);
        // this.isToggled = !isEmpty(event.value);
        // if (this.isToggled) {
        this.selectedOption = { 'timeselection': this.selectedTime, 'groupselection': this.selectedGroup };
        this.clipSservice.selectedOption.next(this.selectedOption);
        this.currentTab_widgets.forEach(item => {
            console.log(item);
            switch (item.clip) {
                case 'StopCompliance':
                    this.clipSservice.clip_mileage('clip_RouteCompliance');
                    break;
                case 'StopComplianceSM':
                    this.clipSservice.clip_mileage('clip_RouteComplianceSM');
                    break;
                case 'Mileage':
                    this.clipSservice.clip_mileage('clip_mileage');
                    break;
                case 'NumberOfUsers':
                    this.clipSservice.clip_mileage('clip_numberofusers');
                    break;
                case 'NumberOfVehicles':
                    this.clipSservice.clip_mileage('clip_numberofvehicles');
                    break;
                case 'MPG':
                    this.clipSservice.clip_mileage('clip_mpg');
                    break;
            }
        });
        // }
    }

    tabChanged(event?: any): void {
        console.log('entirewidget===>>>', this.widgets);
        this.currentTab_widgets = [];
        if (!isEmpty(this.widgets)) {
            this.currentTab_widgets = this.widgets.filter(widget => widget.dashboardid === this.dashboard_Clist[this.activatedTabIndex].id);
            console.log('currentTabwidget===>>>', this.currentTab_widgets);
            this.addExistWidget(this.currentTab_widgets);
        }
    }
    addDashboard() {
        this.isNewDashboard = true;
        this.activatedTabIndex = this.dashboard_Clist.length;
        this.dashboard_Clist.push({
            id: this.activatedTabIndex + 1,
            name: 'New'
        });
        this.isEditClips = true;
        // this.activatedTabIndex = this.dashboard_Clist.length - 1;
    }
    editDashboard() {
        this.isEditClips = true;
        // this.disabled_tab[this.activatedTabIndex] = false;
        // this.activatedTabIndex = 0;
    }
    deleteDashboard(dashboard: any) {
        this._analyticsDashboardService.dashboardDelete(dashboard.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            if (res.responseCode == 100 || res.responseCode == 200) {
                this.dashboard_Clist = this.dashboard_Clist.filter(item => item.id != dashboard.id);
                this.activatedTabIndex = 0;
                this.isEditClips = false;
            }
        });
    }

    checkingEdited(event: any) {
        this.disabled_tab = event;
    }

    addNewWidget(clip: any) {
        this.isNewClip = true;
        let widget_model: WIDGET_MODEL = {};
        widget_model.id = this.widgets[this.widgets.length - 1].id + 1;
        widget_model.dashboardid = this.dashboard_Clist[this.activatedTabIndex].id;
        widget_model.dashboard = this.dashboard_Clist[this.activatedTabIndex].name;
        widget_model.clipid = clip.id;
        widget_model.clip = clip.name;
        widget_model.w = 13;
        widget_model.h = 13;

        switch (clip.name) {
            case 'StopCompliance':
                widget_model.w = 52;
                break;
            case 'StopComplianceSM':
                widget_model.w = 16;
                break;
        }

        this.widgets.push(widget_model);

        this.layoutComponent.widgets.push(widget_model);
        this.layoutService.setDropId(widget_model.id);
        setTimeout(() => {
            this.layoutService.dropItem(widget_model.clip);
        }, 500);
    }

    addExistWidget(widgets: any) {
        if (!isEmpty(widgets)) {
            // this.layoutComponent.widgets = [];
            // this.currentTab_widgets = this.widgets.filter(widget => widget.dashboardid == this.activatedTabIndex + 1);
            for (let widget of widgets) {
                // console.log(widget);
                this.layoutComponent.widgets.push(widget);
                this.layoutService.setDropId(widget.id);
                this.layoutService.dropItem(widget.clip);
            }
        }
    }
    deleteWidget(event: any) {
        console.log(event);
        this.clipSservice.dashboard_clip_delete(event.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            console.log(res);
            if (res.responseCode == 100 || res.responseCode == 200) {
                this.widgets = this.widgets.filter(item => item.id != event.id);
            }
        })
    }

    saveDashboardClips() {
        // let current_Dashbord = this.dashboard_Clist.filter(item => item.id == this.activatedTabIndex + 1);
        let current_Dashboard = this.dashboard_Clist[this.activatedTabIndex];
        if (this.activatedTabIndex >= this.temp_dashboard_Clist.length) {
            if (!this.isNewClip) {
                alert('Please add clip first');
                return;
            }
            current_Dashboard.id = 0;
        }

        current_Dashboard.timeselection = this.selectedTime;
        current_Dashboard.groupselection = this.selectedGroup;
        current_Dashboard.isactive = true;
        this._analyticsDashboardService.dashboardSave(current_Dashboard).pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {
            if (res.responseCode == 100) {
                this.currentTab_widgets.forEach((item: any) => {
                    console.log(item);
                    // delete item.id;
                    item.dashboardid = res.TrackingXLAPI.DATA[0].id;
                });

                this._analyticsDashboardService.dashboard_clip_save(this.currentTab_widgets).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {

                });
            }
        });
        this.isEditClips = false;
        this.disabled_tab = false;
        this.isToggled = false;

    }
    cancelDashboardClips() {
        if (isEqual(this.widgets, this.temp_widgets) && !this.isNewDashboard) {
            this.isEditClips = false;
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'cancel';
            dialogConfig.disableClose = true;
            dialogConfig.data = { vehicle: "", flag: flag };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result == 'cancel') {
                    if (this.isNewDashboard) {
                        this.activatedTabIndex = 0;
                    }
                    this.widgets = this.temp_widgets.map(widget => ({ ...widget }));
                    this.currentTab_widgets = this.widgets.filter(widget => widget.dashboardid === this.activatedTabIndex + 1);
                    this.dashboard_Clist = this.temp_dashboard_Clist;
                    this.dashboard_Clist = this.temp_dashboard_Clist.map(dashboard => ({ ...dashboard }));
                    this.isEditClips = false;
                    this.disabled_tab = false;
                    this.isToggled = false;
                } else if (result == 'save') {

                }
            });
        }
    }

    rangeChange($event) {
        this.fromDate = $event.value.begin.toISOString();
        this.toDate = $event.value.end.toISOString();
        this.getTankHistory('date_range');
    }
    getTankHistory(date: any) {
        let fromdate: string;
        let todate: string;
        let data: [];
        if (date == 'today') {
            let todayDate = new Date();
            // todayDate.setDate(todayDate.getDate() - 10);
            // todate = this.dateFormat(todayDate);
            // // todate = this.dateFormat(todayDate).substr(0, 10) + " " + '00:10:00 AM'
            // fromdate = todate.substr(0, 10) + " " + '00:00:00 AM';
            // this.dateOption = 'today';
            // this.getHistoryData(date, fromdate, todate).pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {
            //     this.generateChartData(res);
            // });
        } else if (date == 'this_week') {
            let curr = new Date; // get current date
            let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
            let last = first + 6; // last day is the first day + 6
            fromdate = this.dateFormat(new Date(curr.setDate(first)));
            todate = this.dateFormat(new Date(curr.setDate(last)));
            // this.dateOption = 'this_week';
            // this.getHistoryData(date, fromdate, todate).pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {
            //     this.generateChartData(res);
            // });
        } else if (date == 'this_month') {
            let curr = new Date; // get current date
            let first = curr.getDate() - curr.getDay() - 7; // First day is the day of the month - the day of the week
            let last = first + 6; // last day is the first day + 6
            fromdate = this.dateFormat(new Date(curr.setDate(first)));
            todate = this.dateFormat(new Date(curr.setDate(last)));
            // this.dateOption = 'last_week';
            // this.getHistoryData(date, fromdate, todate).pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {
            //     this.generateChartData(res);
            // });
        } else if (date == 'date_range') {
            // this.dateOption = 'date_range';
            // this.getHistoryData(date, this.fromDate, this.toDate).pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {
            //     this.generateChartData(res);
            // });
        }
    }
    dateFormat(date: any) {
        let str = '';
        if (date != '') {
            str =
                ("00" + (date.getMonth() + 1)).slice(-2)
                + "/" + ("00" + date.getDate()).slice(-2)
                + "/" + date.getFullYear();
            if (date.getHours() < 12) {
                str = str + " "
                    + ("00" + date.getHours()).slice(-2) + ":"
                    + ("00" + date.getMinutes()).slice(-2)
                    + ":" + ("00" + date.getSeconds()).slice(-2) + " " + 'AM';
            } else {
                str = str + " "
                    + (date.getHours() - 12) + ":"
                    + ("00" + date.getMinutes()).slice(-2)
                    + ":" + ("00" + date.getSeconds()).slice(-2) + " " + 'PM';
            }
        }
        return str;
    }

    sortByDistance(a, b): number {
        if (a > b) return 1;
        else if (a < b) return -1;
        else return 0;
    }
}