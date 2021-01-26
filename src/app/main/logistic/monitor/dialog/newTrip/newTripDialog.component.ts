import { Component, Inject, OnInit, OnDestroy, ViewEncapsulation, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from '@angular/material/paginator';
import { MapsAPILoader, AgmMap, GoogleMapsAPIWrapper } from '@agm/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as monitorEnglish } from 'app/main/logistic/monitor/i18n/en';
import { locale as monitorFrench } from 'app/main/logistic/monitor/i18n/fr';
import { locale as monitorPortuguese } from 'app/main/logistic/monitor/i18n/pt';
import { locale as monitorSpanish } from 'app/main/logistic/monitor/i18n/sp';
import { Trip } from '../../model';
import { MonitorService, MonitorDataSource } from '../../services';
import { BehaviorSubject, Subject, merge } from 'rxjs';
import { takeUntil, tap, take } from 'rxjs/operators';
import { result } from 'lodash';

@Component({
    selector: 'newTrip-form-dialog',
    templateUrl: './newTripDialog.component.html',
    styleUrls: ['./newTripDialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class NewTripDialogComponent implements OnInit, OnDestroy {
    isImportPath = true;
    isSelectRoute = true;
    isPOP = true;
    newTripForm: FormGroup;
    dataSourceUnit: MonitorDataSource;
    dataSourceOperator: MonitorDataSource;
    dataSourceRoute: MonitorDataSource;
    displayedColumns: string[] = ['name'];
    tripDetail: Trip = {};
    // fromLatitude: number;
    // fromLongitude: number;
    // toLatitude: number;
    // toLongitude: number;
    reportDate: Date;
    reportTime: Date;
    filter_string = '';
    method_string = '';
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginatorUnit: MatPaginator;
    @ViewChild('paginatorOperator', { read: MatPaginator, static: true }) paginatorOperator: MatPaginator;
    @ViewChild('paginatorRoute', { read: MatPaginator, static: true }) paginatorRoute: MatPaginator;
    @ViewChild('from') from: any;
    @ViewChild('to') to: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private monitorService: MonitorService,
        public matDialogRef: MatDialogRef<NewTripDialogComponent>,
        private _formBuilder: FormBuilder,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(monitorEnglish, monitorSpanish, monitorFrench, monitorPortuguese);
    }

    ngOnInit() {
        this.dataSourceUnit = new MonitorDataSource(this.monitorService);
        this.dataSourceOperator = new MonitorDataSource(this.monitorService);
        this.dataSourceRoute = new MonitorDataSource(this.monitorService);
        this.dataSourceUnit.loadClists(0, 10, "", "unit_clist");
        this.dataSourceOperator.loadClists(0, 10, "", "operator_clist");
        this.dataSourceRoute.loadClists(0, 10, "", "route_clist");

        this.reportDate = new Date();

        this.newTripForm = this._formBuilder.group({
            route: [null],
            unit: [null],
            operator: [null],
            filterstring: [null],
            google_autocomplete_from: [null],
            google_autocomplete_to: [null],
            startDate: [null],
            tripIdentifier: [null],
        });

        this.mapsAPILoader.load().then(() => {
            let autocomplete_from = new google.maps.places.Autocomplete(this.from.nativeElement);
            let autocomplete_to = new google.maps.places.Autocomplete(this.to.nativeElement);

            autocomplete_from.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult = autocomplete_from.getPlace();

                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                    this.tripDetail.fromlatitude = place.geometry.location.lat();
                    this.tripDetail.fromlongitude = place.geometry.location.lng();
                    this.tripDetail.origen = place.formatted_address;
                    // this.latitude = place.geometry.location.lat();
                    // this.longitude = place.geometry.location.lng();
                    // this.jobForm.get('latitude').setValue(Number(this.latitude));
                    // this.jobForm.get('longitude').setValue(Number(this.longitude));
                    // this.destPlace = place.formatted_address;
                });
            });

            autocomplete_to.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult = autocomplete_to.getPlace();

                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    this.tripDetail.tolatitude = place.geometry.location.lat();
                    this.tripDetail.tolongitude = place.geometry.location.lng();
                    this.tripDetail.destination = place.formatted_address;
                });
            });
        });

        this.setValue();
    }

    ngAfterViewInit() {
        merge(this.paginatorUnit.page)
            .pipe(tap(() => { this.loadClists("unit") }));

        merge(this.paginatorOperator.page)
            .pipe(tap(() => { this.loadClists("operator") }));
        merge(this.paginatorRoute.page)
            .pipe(tap(() => { this.loadClists("route") }));
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
        } else if (method_string === 'route') {
            this.dataSourceRoute.loadClists(this.paginatorRoute.pageIndex, this.paginatorRoute.pageSize, this.filter_string, 'route_clist')
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
            case 'route':
                this.paginatorRoute.pageIndex = 0;
                break;
        }
    }

    showCompanyList(item: string) {
        let methodString = item;
        this.method_string = item.split('_')[0];
        const selected_element_id = this.newTripForm.get(`${this.method_string}`).value;
        const clist = this.monitorService.unit_clist_item[methodString];

        for (let i = 0; i < clist.length; i++) {
            if (clist[i].id === selected_element_id) {
                this.newTripForm.get('filterstring').setValue(clist[i].name);
                this.filter_string = clist[i].name;
            }
        }

        this.managePageIndex(this.method_string);
        this.loadClists(this.method_string);
    }

    clearFilter() {
        this.filter_string = '';
        this.newTripForm.get('filterstring').setValue(this.filter_string);
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

    routePagenation(paginator) {
        this.dataSourceRoute.loadClists(paginator.pageIndex, paginator.pageSize, this.filter_string, "route_clist");
    }

    setValue() {
        this.newTripForm.get('startDate').setValue(new Date());
        // this.newTripForm.get('cost').setValue(this.attend.cost);
        // let date = this.attend.performdate ? new Date(`${this.attend.performdate}`) : '';
        // this.newTripForm.get('performdate').setValue(this.dateFormat(date));
        // this.newTripForm.get('hour').setValue(this.timeFormat(date));
    }

    getValue() {
        this.tripDetail.id = 0;
        this.tripDetail.name = this.newTripForm.get('tripIdentifier').value;
        this.tripDetail.unitid = this.newTripForm.get('unit').value;
        this.tripDetail.operatorid = this.newTripForm.get('operator').value;
        this.tripDetail.inroute = this.isSelectRoute;
        this.tripDetail.schedstarttime = this.dateFormat(new Date(this.newTripForm.get('startDate').value)) || '';
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
        this.getValue();
        setTimeout(() => {
            this.monitorService.saveNewTrip(this.tripDetail).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                if (res.responseCode === 100 || res.responseCode === 200) {
                    this.tripDetail.id = res.TrackingXLAPI.DATA[0].id;
                    this.monitorService.monitor$.pipe(take(1), takeUntil(this._unsubscribeAll)).subscribe(res => {
                        const dataSource = [...res, this.tripDetail];
                        this.monitorService.monitor.next(dataSource);
                    });
                    this.matDialogRef.close(this.tripDetail);
                } else {
                    this.matDialogRef.close('failed');
                }
            });
        }, 500)
    }
}