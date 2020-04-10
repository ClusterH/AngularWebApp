import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectionModel, CollectionViewer } from '@angular/cdk/collections';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatPaginator } from '@angular/material/paginator';
// import { MatStepper } from '@angular/material/stepper';

import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

import { merge,  Subject, BehaviorSubject, of, ReplaySubject, Observable } from 'rxjs';
import { tap, switchMap, catchError, finalize} from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { ReportService } from 'app/main/report/reportcomponent/services/report.service';
import { ReportDataSource } from "app/main/report/reportcomponent/services/report.datasource";

import {CourseDialogComponent} from "./dialog/dialog.component";

import { locale as reportEnglish } from 'app/main/report/reportcomponent/i18n/en';
import { locale as reportSpanish } from 'app/main/report/reportcomponent/i18n/sp';
import { locale as reportFrench } from 'app/main/report/reportcomponent/i18n/fr';
import { locale as reportPortuguese } from 'app/main/report/reportcomponent/i18n/pt';

@Component({
    selector     : 'report-reportcomponent',
    templateUrl  : './report.component.html',
    styleUrls    : ['./report.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ReportComponent implements OnInit, OnDestroy
{
    currentCategory: any;
    currentCategoryID: number;
    currentCategoryName: string;
    reportForm: FormGroup;

    // Vertical Stepper
    reportStep: FormGroup;
    companyStep: FormGroup;
    groupStep: FormGroup;
    unitStep: FormGroup;
    driverStep: FormGroup;
    dateStep: FormGroup;
    eventStep: FormGroup;
    speedStep: FormGroup;
    distanceStep: FormGroup;
    tempStep: FormGroup;
    timeStep: FormGroup;
    outputStep: FormGroup;

     // Private
     private _unsubscribeAll: Subject<any>;

     public loadingSubjectCompany  = new BehaviorSubject<boolean>(false);
     public loadingSubjectGroup    = new BehaviorSubject<boolean>(false);
     public loadingSubjectUnit     = new BehaviorSubject<boolean>(false);
     public loadingSubjectDriver   = new BehaviorSubject<boolean>(false);
     public loadingSubjectDate     = new BehaviorSubject<boolean>(false);
     public loadingSubjectEvent    = new BehaviorSubject<boolean>(false);
     public loadingSubjectSpeed    = new BehaviorSubject<boolean>(false);
     public loadingSubjectDistance = new BehaviorSubject<boolean>(false);
     public loadingSubjectTemp     = new BehaviorSubject<boolean>(false);
     public loadingSubjectTime     = new BehaviorSubject<boolean>(false);
    
     private loadingReport = new BehaviorSubject <any>([]);
    

     dataSourceReport: ReportDataSource;
     dataSourceCompany: ReportDataSource;
     dataSourceGroup: ReportDataSource;
     dataSourceUnit: ReportDataSource;
     dataSourceDriver: ReportDataSource;
     dataSourceEvent: ReportDataSource;

    // private paginatorCompany: MatPaginator;

    // @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    //     this.paginatorCompany = mp;
    // }
   
    filter_string: string = '';
    method_string: string = 'report';

    userConncode: string;
    userID: number;

    reportColumns = [
        'id',
        'name',
    ];

    selectedIndex: number = 0;

    reportSelection = new SelectionModel<Element>(false, []);
    companySelection = new SelectionModel<Element>(false, []);
    groupSelection = new SelectionModel<Element>(false, []);
    unitSelection = new SelectionModel<Element>(false, []);
    driverSelection = new SelectionModel<Element>(false, []);
    eventSelection = new SelectionModel<Element>(false, []);

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild(MatPaginator, {static: true})
        paginatorReport: MatPaginator;
    @ViewChild('paginatorCompany', {read: MatPaginator})
        paginatorCompany: MatPaginator;
    @ViewChild('paginatorGroup', {read: MatPaginator})
        paginatorGroup: MatPaginator;
    @ViewChild('paginatorUnit', {read: MatPaginator})
        paginatorUnit: MatPaginator;
    @ViewChild('paginatorDriver', {read: MatPaginator})
        paginatorDriver: MatPaginator;
    @ViewChild('paginatorEvent', {read: MatPaginator})
        paginatorEvent: MatPaginator;
    
    // @ViewChild('stepper') private myStepper: MatStepper;
    constructor(
        private reportService: ReportService,
        public _matDialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private _formBuilder: FormBuilder,

        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    )
    {
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(reportEnglish, reportSpanish, reportFrench, reportPortuguese);
       
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.filter_string = '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
   
    ngOnInit(): void
    {
        this.activatedRoute.params.subscribe(routeParams => {
            console.log(routeParams);
            this.currentCategory = routeParams.id;
            this.currentCategoryID = this.currentCategory.split('_')[0];
            this.currentCategoryName = this.currentCategory.split('_')[1];
            this.initBehaviorSubjects();
            console.log(this.currentCategoryID, this.currentCategoryName);

            this.dataSourceReport  = new ReportDataSource(this.reportService);
            this.dataSourceCompany = new ReportDataSource(this.reportService);
            this.dataSourceGroup   = new ReportDataSource(this.reportService);
            this.dataSourceUnit    = new ReportDataSource(this.reportService);
            this.dataSourceDriver  = new ReportDataSource(this.reportService);
            this.dataSourceEvent   = new ReportDataSource(this.reportService);
            // setTimeout(() => {
            this.dataSourceReport .loadReport(this.userConncode, this.userID, 0, 5, this.currentCategoryID, '', "report_clist");
            this.dataSourceCompany.loadReport(this.userConncode, this.userID, 0, 5, 0, '', "company_clist");
            this.dataSourceGroup  .loadReport(this.userConncode, this.userID, 0, 5, 0, '', "group_clist");
            this.dataSourceUnit   .loadReport(this.userConncode, this.userID, 0, 5, 0, '', "unit_clist");
            this.dataSourceDriver .loadReport(this.userConncode, this.userID, 0, 5, 0, '', "driver_clist");
            this.dataSourceEvent  .loadReport(this.userConncode, this.userID, 0, 5, 0, '', "event_clist");

            // Vertical Stepper form stepper
            this.reportStep = this._formBuilder.group({
                report: [null, Validators.required],
                filterstring : [null],
            });

            this.companyStep = this._formBuilder.group({
                filterstring : [null],
            });

            this.groupStep = this._formBuilder.group({
                filterstring : [null],
            });

            this.unitStep = this._formBuilder.group({
                filterstring : [null],
            });

            this.driverStep = this._formBuilder.group({
                filterstring : [null],
            });

            this.eventStep = this._formBuilder.group({
                filterstring : [null],
            });

            this.outputStep = this._formBuilder.group({
                address : [null, Validators.required],
            });

            this.companySelection.isSelected = this.isCheckedRow.bind(this);
            this.groupSelection.isSelected = this.isCheckedRow.bind(this);
            this.unitSelection.isSelected = this.isCheckedRow.bind(this);
            this.driverSelection.isSelected = this.isCheckedRow.bind(this);
            this.eventSelection.isSelected = this.isCheckedRow.bind(this);
        });
    }

    isCheckedRow(row: any): boolean {
        // console.log(row);
        if(this.method_string == 'company') {
            const found = this.companySelection.selected.find(el => el.id === row.id);
            if (found) { return true; }
            return false;
        } else if(this.method_string == 'group') {
            const found = this.groupSelection.selected.find(el => el.id === row.id);
            if (found) { return true; }
            return false;
        } 
        else if(this.method_string == 'unit') {
            const found = this.unitSelection.selected.find(el => el.id === row.id);
            if (found) { return true; }
            return false;
        } else if(this.method_string == 'driver') {
            const found = this.driverSelection.selected.find(el => el.id === row.id);
            if (found) { return true; }
            return false;
        } else if(this.method_string == 'event') {
            const found = this.eventSelection.selected.find(el => el.id === row.id);
            if (found) { return true; }
            return false;
        }
     }

    ngAfterViewInit() {
        console.log("ngAfterViewInit:");
        setTimeout(() => {
            merge(this.paginatorReport.page)
            .pipe(
              tap(() => {
                this.loadReport(this.method_string)
              })
            )
            .subscribe( (res: any) => {
                console.log(res);
            });
        })
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadReport(method_string: string) {
        if (method_string == 'report') {
            this.dataSourceReport.loadReport(this.userConncode, this.userID, this.paginatorReport.pageIndex, this.paginatorReport.pageSize, this.currentCategoryID, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'company') {
            this.dataSourceCompany.loadReport(this.userConncode, this.userID, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, 0, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'group') {
            this.dataSourceGroup.loadReport(this.userConncode, this.userID, this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, 0, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'unit') {
            this.dataSourceUnit.loadReport(this.userConncode, this.userID, this.paginatorUnit.pageIndex, this.paginatorUnit.pageSize, 0, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'driver') {
            this.dataSourceDriver.loadReport(this.userConncode, this.userID, this.paginatorDriver.pageIndex, this.paginatorDriver.pageSize, 0, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'event') {
            this.dataSourceEvent.loadReport(this.userConncode, this.userID, this.paginatorEvent.pageIndex, this.paginatorEvent.pageSize, 0, this.filter_string, `${method_string}_clist`)
        } 
    }

    managePageIndex(method_string: string) {
        switch(method_string) {
            case 'report':
                this.paginatorReport.pageIndex = 0;
            break;

            case 'company':
                this.paginatorCompany.pageIndex = 0;
            break;

            case 'group':
                this.paginatorGroup.pageIndex = 0;
            break;

            case 'unit':
                this.paginatorUnit.pageIndex = 0;
            break;

            case 'driver':
                this.paginatorDriver.pageIndex = 0;
            break;

            case 'event':
                this.paginatorEvent.pageIndex = 0;
            break;
        }
    }

    onKeyFilter(event: any, method: string) {
        this.filter_string = event.target.value;
        this.method_string = method;
    
        console.log(this.filter_string, this.method_string)
    
        if(this.filter_string.length >= 3 || this.filter_string == '') {
         
          this.managePageIndex(this.method_string);
          this.loadReport(this.method_string);
        }
    
        console.log(this.filter_string);
    }

    clearFilter() {
        console.log(this.filter_string);
        this.filter_string = '';
        this.reportForm.get('filterstring').setValue(this.filter_string);
       
        this.managePageIndex(this.method_string);
        this.loadReport(this.method_string);
    }

    getReportParams() {
        if (this.reportSelection.selected.length == 0) {
            alert("Please select one Report!");
            this.initBehaviorSubjects();
        } else {
            console.log(this.reportSelection.selected[0], this.reportService.report_cList);
            // this.initBehaviorSubjects();

            let selectedReportid = Number(this.reportSelection.selected[0]);
            let selectedReport = this.reportService.report_cList.find(i => i.id == selectedReportid);
            console.log(selectedReport);
            // let apimethod = this.reportSelection.selected[0];

            this.reportService.getReportParams(this.userConncode, this.userID, selectedReportid, selectedReport.apimethod)
            .subscribe((res: any) => {
                console.log(res);
                for (let i = 0; i< res.TrackingXLAPI.DATA.length; i++){
                    this.loadingReport.next(res.TrackingXLAPI.DATA[i].Data);
                }
            });

            this.loadingReport.subscribe(params => {
                if (params == 'companyid') {
                    this.loadingSubjectCompany.next(true);
                    console.log('loadingsubjectCompany: ', this.loadingSubjectCompany.value);
                } else if (params == 'groupids') {
                    this.loadingSubjectGroup.next(true);

                } else if (params == 'unitids') {
                    this.loadingSubjectUnit.next(true);

                } else if (params == 'driverids') {
                    this.loadingSubjectDriver.next(true);

                } else if (params == 'eventids') {
                    this.loadingSubjectEvent.next(true);
                    
                } else if (params == 'maxspeed' || params == 'minspeed') {
                    this.loadingSubjectSpeed.next(true);

                } else if (params == 'maxdistance' || params == 'mindistance') {
                    this.loadingSubjectDistance.next(true);

                } else if (params == 'maxtemp' || params == 'mintemp') {
                    this.loadingSubjectTemp.next(true);

                } else if (params == 'maxtime' || params == 'mintime') {
                    this.loadingSubjectTime.next(true);
                }
            })

            // this.initBehaviorSubjects();
        }
    }

    selectionChange($event: StepperSelectionEvent): void {
        console.log($event, "selected index", $event.selectedIndex);
        if ($event.selectedIndex == 1) {
            this.method_string = 'company';
            // this.paginatorCompany.pageIndex = 0;
        } else if ($event.selectedIndex == 2) {
            this.method_string = 'group';
        } else if ($event.selectedIndex == 3) {
            this.method_string = 'unit'
        } else if ($event.selectedIndex == 4) {
            this.method_string = 'driver'
        } else if ($event.selectedIndex == 6) {
            this.method_string = 'event'
        }
        // console.log($event.selectedStep.stepControl.value);
    }

    initBehaviorSubjects() {
        this.loadingSubjectCompany.next(false);
        this.loadingSubjectGroup.next(false);
        this.loadingSubjectUnit.next(false);
        this.loadingSubjectDriver.next(false);
        this.loadingSubjectEvent.next(false);
        this.loadingSubjectSpeed.next(false);
        this.loadingSubjectDistance.next(false);
        this.loadingSubjectTemp.next(false);
        this.loadingSubjectTime.next(false);

        // this.company_flag = false;
        // this.loadingReport.complete();

        // if (this.myStepper.selectedIndex != 0) {
        //     this.myStepper.selectedIndex = 0;
        // };

        // this.selectedIndex = 0;
    }

    paginatorClick(paginator) {
        console.log("paginatorclick: ", paginator, this.companySelection.selected);
       
        if (this.method_string == 'company') {
            this.dataSourceCompany.loadReport(this.userConncode, this.userID, paginator.pageIndex, paginator.pageSize, 0, this.filter_string, `${this.method_string}_clist`)
        } else if (this.method_string == 'group') {
            this.dataSourceGroup.loadReport(this.userConncode, this.userID, paginator.pageIndex, paginator.pageSize, 0, this.filter_string, `${this.method_string}_clist`)
        } else if (this.method_string == 'unit') {
            this.dataSourceUnit.loadReport(this.userConncode, this.userID, paginator.pageIndex, paginator.pageSize, 0, this.filter_string, `${this.method_string}_clist`)
        } else if (this.method_string == 'driver') {
            this.dataSourceDriver.loadReport(this.userConncode, this.userID, paginator.pageIndex, paginator.pageSize, 0, this.filter_string, `${this.method_string}_clist`)
        } else if (this.method_string == 'event') {
            this.dataSourceEvent.loadReport(this.userConncode, this.userID, paginator.pageIndex, paginator.pageSize, 0, this.filter_string, `${this.method_string}_clist`)
        }
    }

    /**
     * Finish the horizontal stepper
     */
    finishHorizontalStepper(): void
    {
        alert('You have finished the horizontal stepper!');
    }

    /**
     * Finish the vertical stepper
     */
    finishVerticalStepper(): void
    {
        alert('You have finished the vertical stepper!');
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]>
    {
        console.log("connection");
        return this.loadingReport.asObservable();
    }
 
    /**
     * Disconnect
     */
    disconnect(): void
    {
        console.log("disconnect");
        this.loadingReport.complete();
        this.loadingSubjectCompany.complete();
        this.loadingSubjectGroup.complete();
        this.loadingSubjectUnit.complete();
    }
}
