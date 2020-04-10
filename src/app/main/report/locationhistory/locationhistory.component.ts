import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectionModel, CollectionViewer } from '@angular/cdk/collections';

import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

import { merge, Subject, BehaviorSubject, of, ReplaySubject, Observable } from 'rxjs';
import { tap, catchError, finalize} from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { LocationHistoryService } from 'app/main/report/locationhistory/services/locationhistory.service';
import { LocationHistoryDataSource } from "app/main/report/locationhistory/services/locationhistory.datasource";

import {CourseDialogComponent} from "./dialog/dialog.component";

import { locale as locationhistoryEnglish } from 'app/main/report/locationhistory/i18n/en';
import { locale as locationhistorySpanish } from 'app/main/report/locationhistory/i18n/sp';
import { locale as locationhistoryFrench } from 'app/main/report/locationhistory/i18n/fr';
import { locale as locationhistoryPortuguese } from 'app/main/report/locationhistory/i18n/pt';

@Component({
    selector     : 'report-locationhistory',
    templateUrl  : './locationhistory.component.html',
    styleUrls    : ['./locationhistory.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class LocationHistoryComponent implements OnInit, OnDestroy
{
    reportForm: FormGroup;

    // Vertical Stepper
    verticalStepperStep1: FormGroup;
    verticalStepperStep2: FormGroup;
    verticalStepperStep3: FormGroup;

     // Private
     private _unsubscribeAll: Subject<any>;
     public loadingSubjectCompany = new BehaviorSubject<boolean>(false);
     public loadingSubjectGroup = new BehaviorSubject<boolean>(false);
     public loadingSubjectUnit = new BehaviorSubject<boolean>(false);
    //  private loadingSubject = new BehaviorSubject<boolean>(false);
    //  private loadingSubject = new BehaviorSubject<boolean>(false);
     private loadingReport = new BehaviorSubject <any>([]);
    

     dataSourceReport: LocationHistoryDataSource;
     dataSourceCompany: LocationHistoryDataSource;

     company_flag: boolean = false;
   
    filter_string: string = '';
    method_string: string = '';

    userConncode: string;
    userID: number;

    reportColumns = [
        'id',
        'name',
    ];

    // step3: boolean = false;

    reportSelection = new SelectionModel<Element>(false, []);
    companySelection = new SelectionModel<Element>(false, []);

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild(MatPaginator, {static: true})
        paginatorReport: MatPaginator;
    @ViewChild('paginatorCompany', {read: MatPaginator})
        paginatorCompany: MatPaginator;
   
    constructor(
        private locationhistoryService: LocationHistoryService,
        public _matDialog: MatDialog,
        private router: Router,
        private _formBuilder: FormBuilder,

        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    )
    {
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(locationhistoryEnglish, locationhistorySpanish, locationhistoryFrench, locationhistoryPortuguese);
       
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.filter_string = '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
   
    ngOnInit(): void
    {
        this.dataSourceReport = new LocationHistoryDataSource(this.locationhistoryService);
        this.dataSourceCompany = new LocationHistoryDataSource(this.locationhistoryService);
        setTimeout(() => {
            this.dataSourceReport.loadReport(this.userConncode, this.userID, 0, 5, 2, '', "report_clist");
            if(this.loadingSubjectCompany) {
                this.dataSourceCompany.loadReport(this.userConncode, this.userID, 0, 5, 0, '', "company_clist");
            }
        });
        // Vertical Stepper form stepper
        this.verticalStepperStep1 = this._formBuilder.group({
            report: [null, Validators.required],
            // company: [null, Validators.required],
            filterstring : [null],
            // address: ['', Validators.required]

        });

        this.verticalStepperStep2 = this._formBuilder.group({
            address: ['', Validators.required],
            company: [null, Validators.required],
            filterstring : [null],
        });

        this.verticalStepperStep3 = this._formBuilder.group({
            address: ['', Validators.required]
        });
    }

    ngAfterViewInit() {
        console.log("ngAfterViewInit:");
        // setTimeout(() => {
            merge(this.paginatorReport.page)
            .pipe(
              tap(() => {
                this.loadReport("report")
              })
            )
            .subscribe( (res: any) => {
                console.log(res);
            });
       
       

            if(this.company_flag) {
                merge(this.paginatorCompany.page)
                .pipe(
                tap(() => {
                    this.loadReport("company")
                })
                )
                .subscribe( (res: any) => {
                    console.log(res);
                });
            }
        // })
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadReport(method_string: string) {
        if (method_string == 'report') {
            this.dataSourceReport.loadReport(this.userConncode, this.userID, this.paginatorReport.pageIndex, this.paginatorReport.pageSize, 2, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'company') {
            this.dataSourceCompany.loadReport(this.userConncode, this.userID, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, 2, this.filter_string, `${method_string}_clist`)
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
        }
    }

    onReportFilter(event: any) {
        // this.method_string = 'included';
        this.filter_string = event.target.value;
    
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
            console.log(this.reportSelection.selected[0]);
            this.initBehaviorSubjects();

            // let reportSelectionTemp = this.reportSelection.selected[0].apimethod;
            // let reportid = Number(this.reportSelection.selected[0].id);
            let apimethod = this.reportSelection.selected[0];

            this.locationhistoryService.getReportParams(this.userConncode, this.userID, 1, apimethod)
            // .pipe(
            //     catchError(() => of([])),
            //     finalize(() => this.loadingSubjectCompany.next(false))
            // )
            .subscribe((res: any) => {
                console.log(res);
                for (let i = 0; i< res.TrackingXLAPI.DATA.length; i++){
                    this.loadingReport.next(res.TrackingXLAPI.DATA[i].Data);
                }
                // this.loadingReport.next(res.TrackingXLAPI.DATA);
                // console.log(this.loadingReport);
            });

            this.loadingReport.subscribe(x => {
                // console.log(x);
                switch(x) {
                    case 'unitids':
                        this.loadingSubjectUnit.next(true);
                        // console.log("unit", x);
                    break;

                    case 'groupids':
                        this.loadingSubjectGroup.next(true);
                        // console.log("group:", x);
                    break;

                    case 'companyid':
                        this.dataSourceCompany.loadReport(this.userConncode, this.userID, 0, 5, 0, '', 'company_clist');
                        this.company_flag = true;
                        this.loadingSubjectCompany.next(true);


                        // console.log("company:", x);
                    break;
                }
            })

            // this.initBehaviorSubjects();
        }
    }


    initBehaviorSubjects() {
        this.loadingSubjectCompany.next(false);
        this.loadingSubjectGroup.next(false);
        this.loadingSubjectUnit.next(false);
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
