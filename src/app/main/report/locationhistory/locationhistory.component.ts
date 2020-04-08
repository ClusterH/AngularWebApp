import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

import { merge, Subject } from 'rxjs';
import { tap,} from 'rxjs/operators';

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

    // Horizontal Stepper
    horizontalStepperStep1: FormGroup;
    horizontalStepperStep2: FormGroup;
    horizontalStepperStep3: FormGroup;

    // Vertical Stepper
    verticalStepperStep1: FormGroup;
    verticalStepperStep2: FormGroup;
    verticalStepperStep3: FormGroup;

     // Private
    private _unsubscribeAll: Subject<any>;

    dataSourceReport: LocationHistoryDataSource;
   
    filter_string: string = '';
    method_string: string = '';

    userConncode: string;
    userID: number;

    reportColumns = [
        'id',
        'name',
    ];

    reportSelection = new SelectionModel<Element>(false, []);

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild(MatPaginator, {static: true})
    paginatorReport: MatPaginator;
   
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

        this.dataSourceReport.loadReport(this.userConncode, this.userID, 0, 10, 2, '', "report_clist");

        // Vertical Stepper form stepper
        this.verticalStepperStep1 = this._formBuilder.group({
            report: [null, Validators.required],
            filterstring : [null],
        });

        this.verticalStepperStep2 = this._formBuilder.group({
            address: ['', Validators.required]
        });

        this.verticalStepperStep3 = this._formBuilder.group({
            address: ['', Validators.required]
        });
    }

    ngAfterViewInit() {
        console.log("ngAfterViewInit:");
        
        merge(this.paginatorReport.page)
        .pipe(
          tap(() => {
            this.loadReport("report")
          })
        )
        .subscribe( (res: any) => {
            console.log(res);
        });
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
        } 
    }

    managePageIndex(method_string: string) {
        switch(method_string) {
          case 'report':
            this.paginatorReport.pageIndex = 0;
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
        } else {
            console.log(this.reportSelection.selected[0]);
            // let reportSelectionTemp = this.reportSelection.selected[0].apimethod;
            let reportid = Number(this.reportSelection.selected[0].id);
            let apimethod = this.reportSelection.selected[0].apimethod;

            this.locationhistoryService.getReportParams(this.userConncode, this.userID, reportid, apimethod)
            .subscribe((res: any) => {
                console.log(res);

            })
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
}
