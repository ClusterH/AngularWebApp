import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTabGroup, MatTabHeader, MatTab } from '@angular/material/tabs';
import { fuseAnimations } from '@fuse/animations';
import { AnalyticsDashboardService } from 'app/main/home/analytics/analytics.service';
import { LayoutComponent } from 'app/main/home/analytics/components/layout/layout.component';
import { LayoutService } from 'app/main/home/analytics/services/layout.service';
import { CourseDialogComponent } from "app/main/home/analytics/dialog/dialog.component";
import { NumberOfVehiclesDialogComponent } from "app/main/home/analytics/dialog/numberofvehiclesdialog/numberofvehiclesdialog.component";
import { WIDGET_MODEL } from 'app/main/home/analytics/model/clip.model';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isEmpty, isEqual } from 'lodash';

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
    selectedTime = '';
    selectedGroup = '';
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
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,

    ) {
        this._unsubscribeAll = new Subject();
        // this.currentTab_widgets = this.widgets.filter(widget => widget.dashboardid == 0);
        // console.log(this.currentTab_widgets);
    }

    ngOnInit(): void {
        this.dateRangeForm = this._formBuilder.group({
            date: [null],
        });
        this._analyticsDashboardService.dashboardClist(0, 10, '', 'dashboard_Clist').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            console.log('dashboard_Clist ====>>>', res);
            if (res.responseCode == 100) {
                res.TrackingXLAPI.DATA.sort((a, b) => this.sortByDistance(a.id, b.id));
                // this.dashboard_Clist = new Array();
                // this.temp_dashboard_Clist = new Array();
                // for (const item of res.TrackingXLAPI.DATA) {
                //     this.dashboard_Clist.push({ ...item });
                //     this.temp_dashboard_Clist.push({ ...item });
                // }
                this.dashboard_Clist = res.TrackingXLAPI.DATA;
                this.temp_dashboard_Clist = this.dashboard_Clist.map(dashboard => ({ ...dashboard }));
                this._analyticsDashboardService.dashboardClist(0, 10, '', 'dashboardclips_Clist').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                    console.log('dashboardclips_Clist===>>>', res);
                    this.dashboardclips_Clist = res.TrackingXLAPI.DATA;
                    this.dashboardclips_Clist.sort((a, b) => this.sortByDistance(a.id, b.id));
                    this._analyticsDashboardService.getDashboardClips().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                        console.log('getDashboardClips ====>>>', res);
                        if (res.responseCode == 100) {
                            res.TrackingXLAPI.DATA.sort((a, b) => this.sortByDistance(a.id, b.id));
                            this.widgets = res.TrackingXLAPI.DATA;
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

    tabChanged(event?: any): void {
        // if (this.isNewDashboard && this.isNewClip) {
        //     alert('Please save new generated Dashboard first');
        //     this.activatedTabIndex = this.dashboard_Clist.length - 1;
        //     return;
        // }
        // this.activatedTabIndex = event.index;
        this.currentTab_widgets = [];
        console.log('widget===>>>', this.activatedTabIndex);
        if (!isEmpty(this.widgets)) {
            console.log('is not empty widgets===>>>', this.widgets);
            this.currentTab_widgets = this.widgets.filter(widget => widget.dashboardid === this.activatedTabIndex + 1);
            console.log('currentTab_widget===>>>', this.currentTab_widgets);
            this.addExistWidget(this.currentTab_widgets);
        }
    }
    addDashboard() {
        this.isNewDashboard = true;
        console.log(this.dashboard_Clist.length);
        this.activatedTabIndex = this.dashboard_Clist.length;
        this.dashboard_Clist.push({
            id: this.activatedTabIndex + 1,
            name: 'New'
        });
        this.isEditClips = true;
        // this.activatedTabIndex = this.dashboard_Clist.length - 1;
        console.log(this.activatedTabIndex, this.dashboard_Clist);
    }
    editDashboard() {
        this.isEditClips = true;
        // this.disabled_tab[this.activatedTabIndex] = false;
        // this.activatedTabIndex = 0;
    }
    deleteDashboard(dashboard: any) {
        console.log(dashboard);
        this._analyticsDashboardService.dashboardDelete(dashboard.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            console.log(res);
            if (res.responseCode == 100 || res.responseCode == 200) {
                this.dashboard_Clist = this.dashboard_Clist.filter(item => item.id != dashboard.id);
                console.log(this.dashboard_Clist);
            }
        })
    }

    checkingEdited(event: any) {
        console.log(event);
        this.disabled_tab = event;
    }

    addNewWidget(clip: any) {
        this.isNewClip = true;
        console.log('=======', this.activatedTabIndex, this.widgets.length);
        console.log('clip=========>>>>', clip);
        console.log('widgets=========>>>>', this.widgets);
        let widget_model: WIDGET_MODEL = {};
        widget_model.id = this.widgets[this.widgets.length - 1].id + 1;
        widget_model.clipid = clip.id;
        widget_model.dashboardid = this.activatedTabIndex + 1;
        widget_model.clip = clip.name;
        widget_model.w = 50;
        widget_model.h = 12;

        switch (clip.name) {
            case 'StopCompliance':
                break;
            case 'StopComplianceSM':
                widget_model.w = 16;
                break;
            case 'Mileage':
                widget_model.w = 12;
                break;
            case 'NumberOfVehicles':
                widget_model.w = 12;
                break;

        }
        console.log('widget_model===>>>', widget_model);
        this.widgets.push(widget_model);

        this.layoutComponent.widgets.push(widget_model);
        this.layoutService.setDropId(widget_model.id);
        setTimeout(() => {
            this.layoutService.dropItem(widget_model.clip);
        }, 500);
    }

    addExistWidget(widgets: any) {
        if (!isEmpty(widgets)) {
            console.log('addExistWidget=========>>>>', widgets);
            this.layoutComponent.widgets = [];
            // this.currentTab_widgets = this.widgets.filter(widget => widget.dashboardid == this.activatedTabIndex + 1);
            for (let widget of widgets) {
                this.layoutComponent.widgets.push(widget);
                this.layoutService.setDropId(widget.id);
                this.layoutService.dropItem(widget.clip);
            }
        }
    }

    saveDashboardClips() {
        let current_Dashbord = this.dashboard_Clist.filter(item => item.id == this.activatedTabIndex + 1);
        console.log(current_Dashbord);
        if (this.activatedTabIndex >= this.temp_dashboard_Clist.length) {
            if (!this.isNewClip) {
                alert('Please add clip first');
                return;
            }
            current_Dashbord[0].id = 0;
        }

        current_Dashbord[0].timeselection = this.selectedTime;
        current_Dashbord[0].groupselection = this.selectedGroup;
        current_Dashbord[0].isactive = true;
        console.log(current_Dashbord);

        this._analyticsDashboardService.dashboardSave(current_Dashbord[0]).pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {
            console.log(res);
            if (res.responseCode == 100) {
                this.currentTab_widgets.forEach((item: any) => {
                    delete item.title;
                    delete item.id
                });
                console.log(this.currentTab_widgets);
                this._analyticsDashboardService.dashboard_clip_save(this.currentTab_widgets).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                    console.log(res);
                });
            }
        });
        this.isEditClips = false;
        this.disabled_tab = false;
    }
    cancelDashboardClips() {
        console.log('widgets===>>>', this.widgets);
        console.log('temp_widgets===>>>', this.temp_widgets);
        console.log('currentTab_widgets===>>>', this.currentTab_widgets);
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
                    // this.dashboard_Clist = new Array();
                    this.dashboard_Clist = this.temp_dashboard_Clist;
                    this.dashboard_Clist = this.temp_dashboard_Clist.map(dashboard => ({ ...dashboard }));
                    this.isEditClips = false;
                    this.disabled_tab = false;
                    console.log(this.widgets);
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