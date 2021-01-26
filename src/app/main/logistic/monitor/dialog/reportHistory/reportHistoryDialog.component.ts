import { Component, Inject, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from '@angular/material/paginator';

import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as monitorEnglish } from 'app/main/logistic/monitor/i18n/en';
import { locale as monitorFrench } from 'app/main/logistic/monitor/i18n/fr';
import { locale as monitorPortuguese } from 'app/main/logistic/monitor/i18n/pt';
import { locale as monitorSpanish } from 'app/main/logistic/monitor/i18n/sp';
import { Monitor } from 'app/main/logistic/monitor/model/monitor.model';
import { MonitorService, MonitorDataSource } from '../../services';
import { BehaviorSubject, Subject, merge } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'reportContact-form-dialog',
    templateUrl: './reportHistoryDialog.component.html',
    styleUrls: ['./reportHistoryDialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ReportContactDialogComponent implements OnInit, OnDestroy {
    trip: any;
    reportType = 'phone_call';
    reportContactForm: FormGroup;
    dataSourceUnit: MonitorDataSource;
    dataSourceOperator: MonitorDataSource;
    displayedColumns: string[] = ['name'];
    reportDate: Date;
    reportTime: Date;
    filter_string = '';
    method_string = '';
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginatorUnit: MatPaginator;
    @ViewChild('paginatorOperator', { read: MatPaginator, static: true }) paginatorOperator: MatPaginator;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private monitorService: MonitorService,
        public matDialogRef: MatDialogRef<ReportContactDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(monitorEnglish, monitorSpanish, monitorFrench, monitorPortuguese);
        this.trip = _data.trip;

    }

    ngOnInit() {
        this.dataSourceUnit = new MonitorDataSource(this.monitorService);
        this.dataSourceOperator = new MonitorDataSource(this.monitorService);
        this.dataSourceUnit.loadClists(0, 10, this.trip.unit, "unit_clist");
        this.dataSourceOperator.loadClists(0, 10, this.trip.operator, "operator_clist");

        this.reportDate = new Date();

        this.reportContactForm = this._formBuilder.group({
            date: [null],
            time: [null],
            type: [null],
            unit: [null],
            operator: [null],
            contact: [null],
            notes: [null],
            filterstring: [null],
        });

        this.setValue();
    }

    ngAfterViewInit() {
        merge(this.paginatorUnit.page)
            .pipe(tap(() => { this.loadClists("unit") }));

        merge(this.paginatorOperator.page)
            .pipe(tap(() => { this.loadClists("operator") }));
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadClists(method_string: string) {
        if (method_string === 'unit') {
            this.dataSourceUnit.loadClists(this.paginatorUnit.pageIndex, this.paginatorUnit.pageSize, this.filter_string, 'unit_clist')
        } else if (method_string === 'operator') {
            this.dataSourceOperator.loadClists(this.paginatorOperator.pageIndex, this.paginatorOperator.pageSize, this.filter_string, 'operator_clist')
        }
    }

    managePageIndex(method_string: string) {
        switch (method_string) {
            case 'unit':
                this.paginatorUnit.pageIndex = 0;
                break;
            case 'operator':
                this.paginatorOperator.pageIndex = 0;
                break;
        }
    }

    showCompanyList(item: string) {
        let methodString = item;
        this.method_string = item.split('_')[0];
        const selected_element_id = this.reportContactForm.get(`${this.method_string}`).value;
        const clist = this.monitorService.unit_clist_item[methodString];

        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id === selected_element_id) {
                this.reportContactForm.get('filterstring').setValue(clist[i].name);
                this.filter_string = clist[i].name;
            }
        }

        this.managePageIndex(this.method_string);
        this.loadClists(this.method_string);
    }

    clearFilter() {
        this.filter_string = '';
        this.reportContactForm.get('filterstring').setValue(this.filter_string);
        this.managePageIndex(this.method_string);
        this.loadClists(this.method_string);
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.managePageIndex(this.method_string);
            this.loadClists(this.method_string);
        }
    }

    unitPagenation(paginator) {
        this.dataSourceUnit.loadClists(paginator.pageIndex, paginator.pageSize, this.filter_string, "unit_clist");
    }

    operatorPagenation(paginator) {
        this.dataSourceOperator.loadClists(paginator.pageIndex, paginator.pageSize, this.filter_string, "operator_clist");
    }

    setValue() {
        this.reportContactForm.get('date').setValue(new Date());
        this.reportContactForm.get('time').setValue(this.timeFormat(new Date()));
        this.reportContactForm.get('unit').setValue(this.trip.unitid);
        this.reportContactForm.get('operator').setValue(this.trip.operatorid);
        // let date = this.attend.performdate ? new Date(`${this.attend.performdate}`) : '';
        // this.reportContactForm.get('performdate').setValue(this.dateFormat(date));
        // this.reportContactForm.get('hour').setValue(this.timeFormat(date));
    }

    getValue() {

    }

    paramDateFormat(date: any) {
        let str = '';
        if (date != '') {
            str = ("00" + (date.getMonth() + 1)).slice(-2) + "/" + ("00" + date.getDate()).slice(-2) + "/" + date.getFullYear();
        }
        return str;
    }

    paramTimeFormat(time) {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
        if (time.length > 1) { // If time format correct
            time = time.slice(1); // Remove full string match value
            time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
            time[0] = +(time[0] % 12) < 10 ? '0' + time[0] % 12 : time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    }

    dateFormat(date: any) {
        let str = new Date(date).toISOString().substring(0, 10);
        return str;
    }

    timeFormat(time: any) {
        let str = '';
        if (time != '') {
            str =
                ("00" + time.getHours()).slice(-2) + ":"
                + ("00" + time.getMinutes()).slice(-2)
        }
        return str;
    }

    save() {
        // this.getValue();
        // if (this.flag) {
        //     this.monitorService.saveAttend(this.attendDetail).pipe(takeUntil(this._unsubscribeAll))
        //         .subscribe((result: any) => {
        //             if ((result.responseCode == 200) || (result.responseCode == 100)) {
        //                 alert('Successfully saved');
        //                 this.dataSource = new MonitorDataSource(this.monitorService);
        //                 this.dataSource.monitorSubject.next(this.monitorService.maintPendingList);
        //             } else {
        //                 alert("Failed save!")
        //             }
        //         });
        // };

        this.matDialogRef.close();
    }
}