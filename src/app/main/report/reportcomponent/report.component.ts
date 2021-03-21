import { CollectionViewer, SelectionModel } from '@angular/cdk/collections';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as reportEnglish } from 'app/main/report/reportcomponent/i18n/en';
import { locale as reportFrench } from 'app/main/report/reportcomponent/i18n/fr';
import { locale as reportPortuguese } from 'app/main/report/reportcomponent/i18n/pt';
import { locale as reportSpanish } from 'app/main/report/reportcomponent/i18n/sp';
import { ReportResultService, ReportService, ReportDataSource, PDFService, ExcelService } from './services';

import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { ReportDetail } from './model/report.model';
declare let pdfMake: any;

@Component({
    selector: 'report-reportcomponent',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ReportComponent implements OnInit, OnDestroy {
    currentCategory: any;
    currentCategoryID: number;
    currentCategoryName: string;
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

    public loadingSubjectCompany = new BehaviorSubject<boolean>(false);
    public loadingSubjectGroup = new BehaviorSubject<boolean>(false);
    public loadingSubjectUnit = new BehaviorSubject<boolean>(false);
    public loadingSubjectDriver = new BehaviorSubject<boolean>(false);
    public loadingSubjectDate = new BehaviorSubject<boolean>(false);
    public loadingSubjectDateRange = new BehaviorSubject<boolean>(false);
    public loadingSubjectEvent = new BehaviorSubject<boolean>(false);
    public loadingSubjectMaxSpeed = new BehaviorSubject<boolean>(false);
    public loadingSubjectMinSpeed = new BehaviorSubject<boolean>(false);
    public loadingSubjectMaxDistance = new BehaviorSubject<boolean>(false);
    public loadingSubjectMinDistance = new BehaviorSubject<boolean>(false);
    public loadingSubjectMaxTemp = new BehaviorSubject<boolean>(false);
    public loadingSubjectMinTemp = new BehaviorSubject<boolean>(false);
    public loadingSubjectMaxTime = new BehaviorSubject<boolean>(false);
    public loadingSubjectMinTime = new BehaviorSubject<boolean>(false);
    public loadingSubjectOutPut = new BehaviorSubject<boolean>(false);
    private loadingReport = new BehaviorSubject<any>([]);
    dataSource: ReportDataSource;
    dataSourceReport: ReportDataSource;
    dataSourceCompany: ReportDataSource;
    dataSourceGroup: ReportDataSource;
    dataSourceUnit: ReportDataSource;
    dataSourceDriver: ReportDataSource;
    dataSourceEvent: ReportDataSource;
    filter_string: string = '';
    method_string: string = 'report';
    reportColumns = ['id', 'name'];
    public mask = {
        mask: [/[0-9]/, /[0-9]/, ':', /[0-5]/, /[0-9]/]
    };

    selectedReport: { id: number, apimethod: string };
    selectedIndex: number = 0;
    selectedRange: string = '';
    showRangePicker: boolean = false;
    entered_report_param: ReportDetail = {};
    reportSelection = new SelectionModel<Element>(false, []);
    companywholeSelection = new SelectionModel<Element>(false, []);
    companySelection = new SelectionModel<Element>(false, []);
    groupSelection = new SelectionModel<Element>(false, []);
    unitSelection = new SelectionModel<Element>(false, []);
    driverSelection = new SelectionModel<Element>(false, []);
    eventSelection = new SelectionModel<Element>(false, []);
    isWholeCompany: boolean = false;
    isWholeGroup: boolean = false;
    editable: boolean = true;
    displayedColumns: Array<any> = [];
    reportResult: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild(MatPaginator, { static: true }) paginatorReport: MatPaginator;
    @ViewChild('paginatorCompany', { read: MatPaginator }) paginatorCompany: MatPaginator;
    @ViewChild('paginatorGroup', { read: MatPaginator }) paginatorGroup: MatPaginator;
    @ViewChild('paginatorUnit', { read: MatPaginator }) paginatorUnit: MatPaginator;
    @ViewChild('paginatorDriver', { read: MatPaginator }) paginatorDriver: MatPaginator;
    @ViewChild('paginatorEvent', { read: MatPaginator }) paginatorEvent: MatPaginator;
    @ViewChild('stepper') private myStepper: MatStepper;

    constructor(
        private reportService: ReportService,
        private reportResultService: ReportResultService,
        public _matDialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private router: Router,
        private excelService: ExcelService,
        private pdfService: PDFService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._fuseTranslationLoaderService.loadTranslations(reportEnglish, reportSpanish, reportFrench, reportPortuguese);
        this._unsubscribeAll = new Subject();
        this.filter_string = '';
        this.isWholeCompany = false;
        this.editable = true;
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(routeParams => {
            this.currentCategory = routeParams.id;
            this.currentCategoryID = this.currentCategory.split('_')[0];
            this.currentCategoryName = this.currentCategory.split('_')[1];
            this.initBehaviorSubjects();
            this.dataSourceReport = new ReportDataSource(this.reportService);
            this.dataSourceCompany = new ReportDataSource(this.reportService);
            this.dataSourceGroup = new ReportDataSource(this.reportService);
            this.dataSourceUnit = new ReportDataSource(this.reportService);
            this.dataSourceDriver = new ReportDataSource(this.reportService);
            this.dataSourceEvent = new ReportDataSource(this.reportService);
            setTimeout(() => {
                this.dataSourceReport.loadReport(0, 5, this.currentCategoryID, '', "report_clist");
            });
            // Vertical Stepper form stepper
            this.reportStep = this._formBuilder.group({
                report: [null, Validators.required],
                filterstring: [null],
            });

            this.companyStep = this._formBuilder.group({
                filterstring: [null],
                wholeCompany: null
            });

            this.groupStep = this._formBuilder.group({
                filterstring: [null],
                wholeGroup: null
            });

            this.unitStep = this._formBuilder.group({
                filterstring: [null],
            });

            this.driverStep = this._formBuilder.group({
                filterstring: [null],
            });

            this.dateStep = this._formBuilder.group({
                selectDate: [null],
                starttime: [null],
                start: [null],
                end: [null],
                endtime: [null]
            });

            this.eventStep = this._formBuilder.group({
                filterstring: [null],
            });

            this.speedStep = this._formBuilder.group({
                minspeed: [null],
                maxspeed: [null],
            });

            this.distanceStep = this._formBuilder.group({
                mindistance: [null],
                maxdistance: [null],
            });

            this.tempStep = this._formBuilder.group({
                mintemp: [null],
                maxtemp: [null],
            });

            this.timeStep = this._formBuilder.group({
                mintime: [null],
                maxtime: [null],
            });

            this.outputStep = this._formBuilder.group({
                screen: [null],
            });

            this.dateStep.get('selectDate').setValue('today');
            this.dateStep.get('starttime').setValue('00:00');
            this.dateStep.get('endtime').setValue('23:59');

            this.companySelection.isSelected = this.isCheckedRow.bind(this);
            this.groupSelection.isSelected = this.isCheckedRow.bind(this);
            this.unitSelection.isSelected = this.isCheckedRow.bind(this);
            this.driverSelection.isSelected = this.isCheckedRow.bind(this);
            this.eventSelection.isSelected = this.isCheckedRow.bind(this);
        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            merge(this.paginatorReport.page)
                .pipe(tap(() => { this.loadReport(this.method_string) }), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });
        })
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    selectWholeCompany() {
        this.isWholeCompany = this.companyStep.get('wholeCompany').value;
        if (this.isWholeCompany) {
            this.loadingSubjectGroup.next(false);
            this.loadingSubjectUnit.next(false);
        } else {
            this.loadingSubjectGroup.next(true);
            this.loadingSubjectUnit.next(true);
        }
    }

    selectWholeGroup() {
        this.isWholeGroup = this.groupStep.get('wholeGroup').value;
        if (this.isWholeGroup) {
            this.loadingSubjectUnit.next(false);
        } else {
            this.loadingSubjectUnit.next(true);
        }
    }

    checkOneCompany() {
        if (this.companySelection.selected.length == 0) {
            alert("Please choose one company");
        } else {
            if (!this.isWholeCompany) {
                this.dataSourceGroup = new ReportDataSource(this.reportService);
                this.dataSourceGroup.loadGroup(0, 5, this.companySelection.selected[0].id, '', 'group_clist')
                this.myStepper.selected.completed = true;
            }

            this.myStepper.next();
        }
    }

    checkOneGroup() {
        if (this.groupSelection.selected.length == 0) {
            alert("Please choose one group");
        } else {
            if (!this.isWholeGroup) {
                this.dataSourceUnit = new ReportDataSource(this.reportService);
                this.dataSourceUnit.loadGroup(0, 5, this.groupSelection.selected[0].id, '', 'unit_clist')
                this.myStepper.selected.completed = true;
            }
            this.myStepper.next();
        }
    }

    checkDateTime() {
        let fromDate = this.dateStep.get('start');
        let endDate = this.dateStep.get('end');
        if (this.loadingSubjectDateRange.getValue() && (fromDate.value == null || endDate.value == null)) {
            alert("Please choose Date correctly");
        } else {
            this.myStepper.next();
        }
    }

    isCheckedRow(row: any): boolean {
        if (this.method_string == 'company') {
            const found = this.companySelection.selected.find(el => el.id === row.id);
            if (found) { return true; }
            return false;
        } else if (this.method_string == 'group') {
            const found = this.groupSelection.selected.find(el => el.id === row.id);
            if (found) { return true; }
            return false;
        }
        else if (this.method_string == 'unit') {
            const found = this.unitSelection.selected.find(el => el.id === row.id);
            if (found) { return true; }
            return false;
        } else if (this.method_string == 'driver') {
            const found = this.driverSelection.selected.find(el => el.id === row.id);
            if (found) { return true; }
            return false;
        } else if (this.method_string == 'event') {
            const found = this.eventSelection.selected.find(el => el.id === row.id);
            if (found) { return true; }
            return false;
        }
    }

    loadReport(method_string: string) {
        if (method_string == 'report') {
            this.dataSourceReport.loadReport(this.paginatorReport.pageIndex, this.paginatorReport.pageSize, this.currentCategoryID, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'company') {
            this.dataSourceCompany.loadReport(this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, 0, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'group') {
            this.dataSourceGroup.loadGroup(this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, 0, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'unit') {
            this.dataSourceUnit.loadGroup(this.paginatorUnit.pageIndex, this.paginatorUnit.pageSize, 0, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'driver') {
            this.dataSourceDriver.loadReport(this.paginatorDriver.pageIndex, this.paginatorDriver.pageSize, 0, this.filter_string, `${method_string}_clist`)
        } else if (method_string == 'event') {
            this.dataSourceEvent.loadReport(this.paginatorEvent.pageIndex, this.paginatorEvent.pageSize, 0, this.filter_string, `${method_string}_clist`)
        }
    }

    managePageIndex(method_string: string) {
        switch (method_string) {
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
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadReport(this.method_string);
        }
    }

    clearFilter(method: string) {
        this.filter_string = '';
        switch (method) {
            case 'report':
                this.reportStep.get('filterstring').setValue(this.filter_string);
                break;
            case 'company':
                this.companyStep.get('filterstring').setValue(this.filter_string);
                break;
            case 'group':
                this.groupStep.get('filterstring').setValue(this.filter_string);
                break;
            case 'unit':
                this.unitStep.get('filterstring').setValue(this.filter_string);
                break;
            case 'driver':
                this.driverStep.get('filterstring').setValue(this.filter_string);
                break;
            case 'event':
                this.eventStep.get('filterstring').setValue(this.filter_string);
                break;
        }

        this.managePageIndex(method);
        this.loadReport(method);
    }

    getReportParams() {
        if (this.reportSelection.selected.length == 0) {
            alert("Please select one Report!");
            this.initBehaviorSubjects();
        } else {
            let selectedReportid = Number(this.reportSelection.selected[0]);
            this.selectedReport = this.reportService.report_cList.find(i => i.id == selectedReportid);
            this.reportService.getReportParams(selectedReportid, this.selectedReport.apimethod).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((res: any) => {
                    for (let i = 0; i < res.TrackingXLAPI.DATA.length; i++) {
                        this.loadingReport.next(res.TrackingXLAPI.DATA[i].Data);
                    }
                });

            this.loadingReport.subscribe(params => {
                if (params == 'companyid') {
                    this.loadingSubjectCompany.next(true);
                    this.dataSourceCompany = new ReportDataSource(this.reportService);
                    this.dataSourceCompany.loadReport(0, 5, 0, this.filter_string, 'company_clist');
                } else if (params == 'groupids') {
                    this.loadingSubjectGroup.next(true);
                } else if (params == 'unitids') {
                    this.loadingSubjectUnit.next(true);
                } else if (params == 'driverids') {
                    this.loadingSubjectDriver.next(true);
                } else if (params == 'datefrom' || params == 'dateto') {
                    this.loadingSubjectDate.next(true);
                } else if (params == 'eventids') {
                    this.loadingSubjectEvent.next(true);
                } else if (params == 'maxspeed') {
                    this.loadingSubjectMaxSpeed.next(true);
                } else if (params == 'minspeed') {
                    this.loadingSubjectMinSpeed.next(true);
                } else if (params == 'maxdistance') {
                    this.loadingSubjectMaxDistance.next(true);
                } else if (params == 'mindistance') {
                    this.loadingSubjectMinDistance.next(true);
                } else if (params == 'maxtemp') {
                    this.loadingSubjectMaxTemp.next(true);
                } else if (params == 'mintemp') {
                    this.loadingSubjectMinTemp.next(true);
                } else if (params == 'maxtime') {
                    this.loadingSubjectMaxTime.next(true);
                } else if (params == 'mintime') {
                    this.loadingSubjectMinTime.next(true);
                }
            })
        }
    }

    selectionChange($event: StepperSelectionEvent): void {
        if ($event.selectedIndex == 1) {
            this.method_string = 'company';
        } else if ($event.selectedIndex == 2) {
            this.method_string = 'group';
        } else if ($event.selectedIndex == 3) {
            this.method_string = 'unit'
        } else if ($event.selectedIndex == 4) {
            this.method_string = 'driver'
        } else if ($event.selectedIndex == 6) {
            this.method_string = 'event'
        }
    }

    initBehaviorSubjects() {
        this.loadingSubjectCompany.next(false);
        this.loadingSubjectGroup.next(false);
        this.loadingSubjectUnit.next(false);
        this.loadingSubjectDriver.next(false);
        this.loadingSubjectEvent.next(false);
        this.loadingSubjectMaxSpeed.next(false);
        this.loadingSubjectMinSpeed.next(false);
        this.loadingSubjectMaxDistance.next(false);
        this.loadingSubjectMinDistance.next(false);
        this.loadingSubjectMaxTemp.next(false);
        this.loadingSubjectMinTemp.next(false);
        this.loadingSubjectMaxTime.next(false);
        this.loadingSubjectMinTime.next(false);
        this.loadingSubjectOutPut.next(false);
    }

    paginatorClick(paginator) {
        if (this.method_string == 'company') {
            this.dataSourceCompany.loadReport(paginator.pageIndex, paginator.pageSize, 0, this.filter_string, `${this.method_string}_clist`)
        } else if (this.method_string == 'group') {
            this.dataSourceGroup.loadGroup(paginator.pageIndex, paginator.pageSize, 0, this.filter_string, `${this.method_string}_clist`)
        } else if (this.method_string == 'unit') {
            this.dataSourceUnit.loadGroup(paginator.pageIndex, paginator.pageSize, 0, this.filter_string, `${this.method_string}_clist`)
        } else if (this.method_string == 'driver') {
            this.dataSourceDriver.loadReport(paginator.pageIndex, paginator.pageSize, 0, this.filter_string, `${this.method_string}_clist`)
        } else if (this.method_string == 'event') {
            this.dataSourceEvent.loadReport(paginator.pageIndex, paginator.pageSize, 0, this.filter_string, `${this.method_string}_clist`)
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

    paramDateFormat(date: any) {
        let str = '';
        if (date != '') {
            str = ("00" + (date.getMonth() + 1)).slice(-2) + "/" + ("00" + date.getDate()).slice(-2) + "/" + date.getFullYear();
        }
        return str;
    }

    paramTimeFormat(time) {
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
        if (time.length > 1) { // If time format correct
            time = time.slice(1); // Remove full string match value
            time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
            time[0] = +(time[0] % 12) < 10 ? '0' + time[0] % 12 : time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    }

    currentTimeFormat(date: any) {
        let str = '';
        if (date != '') {
            str = ("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2);
        }
        return this.paramTimeFormat(str);
    }


    onDateRangeChange($event) {
        if (this.selectedRange == 'daterange') {
            this.showRangePicker = true;
            this.loadingSubjectDateRange.next(true);
        } else {
            this.showRangePicker = false;
            this.loadingSubjectDateRange.next(false);
        }
    }

    finishVerticalStepper(): void {
        this.entered_report_param.reportname = this.selectedReport.apimethod || null;
        this.entered_report_param.runondate = this.paramDateFormat(new Date()) + " " + this.currentTimeFormat(new Date());
        this.entered_report_param.companyid = this.companySelection.selected[0] ? this.companySelection.selected[0].id : null
        this.entered_report_param.companyname = this.companySelection.selected[0] ? JSON.parse(JSON.stringify(this.companySelection.selected[0])).name : null
        this.entered_report_param.groupid = this.groupSelection.selected[0] ? this.groupSelection.selected[0].id : null;
        if (!this.isWholeCompany) {
            this.entered_report_param.groupname = this.groupSelection.selected[0] ? JSON.parse(JSON.stringify(this.groupSelection.selected[0])).name : null;
        }
        if (!this.isWholeGroup && !this.isWholeCompany) {
            this.entered_report_param.unitname = this.unitSelection.selected[0] ? JSON.parse(JSON.stringify(this.unitSelection.selected[0])).name : null;
        }
        this.entered_report_param.unitid = this.unitSelection.selected[0] ? this.unitSelection.selected[0].id : null;
        this.entered_report_param.driverid = this.driverSelection.selected[0] ? this.driverSelection.selected[0].id : null;
        this.entered_report_param.datefrom = this.paramDateFormat(new Date(this.dateStep.get('start').value)) + " " + this.paramTimeFormat(this.dateStep.get('starttime').value) || null;
        this.entered_report_param.dateto = this.paramDateFormat(new Date(this.dateStep.get('end').value)) + " " + this.paramTimeFormat(this.dateStep.get('endtime').value) || null;
        this.entered_report_param.eventid = this.eventSelection.selected[0] ? this.eventSelection.selected[0].id : null;
        this.entered_report_param.maxspeed = this.speedStep.get('maxspeed').value || null;
        this.entered_report_param.minspeed = this.speedStep.get('minspeed').value || null;
        this.entered_report_param.maxdistance = this.distanceStep.get('maxdistance').value || null;
        this.entered_report_param.mindistance = this.distanceStep.get('mindistance').value || null;
        this.entered_report_param.maxtemp = this.tempStep.get('maxtemp').value || null;
        this.entered_report_param.mintemp = this.tempStep.get('mintemp').value || null;
        this.entered_report_param.maxtime = this.timeStep.get('maxtime').value ? Number(this.timeStep.get('maxtime').value.split(':')[0]) * 60 + Number(this.timeStep.get('maxtime').value.split(':')[1]) : null;
        this.entered_report_param.mintime = this.timeStep.get('mintime').value ? Number(this.timeStep.get('mintime').value.split(':')[0]) * 60 + Number(this.timeStep.get('mintime').value.split(':')[1]) : null;

        if (!this.outputStep.get('screen').value) {
            alert('Please select one output method');
            return;
        }
        this.entered_report_param.selectedscreen = this.outputStep.get('screen').value;


        for (let param in this.entered_report_param) {
            if (this.entered_report_param[param] === null) {
                delete this.entered_report_param[param];
            }
        }
        localStorage.setItem('report_result', JSON.stringify(this.entered_report_param));

        this.reportResultService.loadReportResult(0, 10000).pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result.responseCode == 100) {
                this.reportResult = result.TrackingXLAPI.DATA;
                this.displayedColumns = [];
                for (let column in result.TrackingXLAPI.DATA[0]) {
                    if (column != 'id' && column != 'company' && column != 'group') {
                        this.displayedColumns.push(column);
                    }
                }
                const totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
                localStorage.setItem('total_length', totalLength.toString());
            } else if ((result.responseCode == 200)) {
                const totalLength = 0;
            }

            if (this.entered_report_param.selectedscreen == 'excel') {
                this.exportAsExcel(this.docFormat());
            } else if (this.entered_report_param.selectedscreen == 'pdf') {
                this.exportAsPDF(this.docFormat());
            } else if (this.entered_report_param.selectedscreen == 'screen') {
                this.router.navigate(['report/reportresult']);
            }
        })
    }

    exportAsExcel(table) {
        this.excelService.generateExcel(table);
    }

    exportAsPDF(table) {
        const documentDefinition = this.pdfService.getDocumentDefinition(table);
        pdfMake.createPdf(documentDefinition).download();

    }

    docFormat() {
        let data = [];
        let headers = [];
        this.reportResult.forEach(item => {
            let row = [];
            this.displayedColumns.map(header => {
                if (header !== 'companyid' && header !== 'groupid' && header !== 'unitid') {
                    row.push(item[header]);
                }
            })
            data.push(row);
        })

        this.displayedColumns.map(header => {
            if (header !== 'companyid' && header !== 'groupid' && header !== 'unitid') {
                headers.push(header);
            }
        })

        return { data: data, headers: headers };
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.loadingReport.asObservable();
    }

    /**
     * Disconnect
     */
    disconnect(): void {
        this.loadingReport.complete();
        this.loadingSubjectCompany.complete();
        this.loadingSubjectGroup.complete();
        this.loadingSubjectUnit.complete();
    }
}