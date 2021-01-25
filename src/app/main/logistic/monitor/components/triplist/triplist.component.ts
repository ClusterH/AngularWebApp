import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { MonitorService } from 'app/main/logistic/monitor/services/monitor.service';
import { ReportContactDialogComponent } from '../../dialog/reportHistory/reportHistoryDialog.component';
import { NewTripDialogComponent } from '../../dialog/newTrip/newTripDialog.component';
import { Table } from 'primeng/table';
import { PrimeNGConfig } from 'primeng/api';

import { Subject, Observable, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-triplist',
    templateUrl: './triplist.component.html',
    styleUrls: ['./triplist.component.scss']
})
export class TriplistComponent implements OnInit {
    dataSource: any[];
    monitor$: Observable<any[]>;
    selectedMonitor: any[];
    totalRecords: number;
    loading = false;
    defaultDate: Date;
    selected = '';
    filter_string = '';
    displayedColumns = ['risklevel', 'tripstatus', 'name', 'unit', 'operator', 'origen', 'destination', 'eta', 'inroute', 'ontime', 'commok', 'lastcontact'];

    tripStatus: any[];
    selectedStatus: any[];
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    isShowNewTrip = false;

    dialogRef: any;

    private _unsubscribeAll: Subject<any>;
    @ViewChild('dt') table: Table;

    constructor(
        public monitorService: MonitorService,
        private primengConfig: PrimeNGConfig,
        public _matDialog: MatDialog,
    ) {
        this._unsubscribeAll = new Subject();
        this.selected = '';
        this.filter_string = '';
    }

    ngOnInit(): void {
        this.defaultDate = new Date('2020-11-18');
        this.tripStatus = [
            { id: 1, name: 'Waiting' },
            { id: 2, name: 'On Route' },
            { id: 3, name: 'Off Route' },
            { id: 4, name: 'Stopped' },
            { id: 5, name: 'Completed' },
            { id: 6, name: 'Canceled' },
        ]

        this.selectedStatus = this.tripStatus;

        this.getTrips();
    }

    ngAfterViewInit() {
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getTrips(date?: string) {
        // this.monitorService.loadingsubject.next(false);
        this.monitorService.getMonitor(1, 10, 'name', 'asc', '1,2,3,5', 'tripwatch_TList').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            console.log(res);
            this.dataSource = [...res.TrackingXLAPI.DATA];
            this.closeCommandMenu();

            if (this.dataSource) {
                this.totalRecords = this.dataSource.length;
                setTimeout(() => {
                    this.monitorService.loadingsubject.next(true);
                    this.primengConfig.ripple = true;
                }, 0);
            }
        });
    }

    closeCommandMenu(): void {
        this.dataSource.map(item => {
            item.isShowCommand = false;
            return item;
        });

        this.monitor$ = of(this.dataSource);
    }

    addNewTrip(): void {
        this.closeCommandMenu();
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'newTrip-form-dialog';
        dialogConfig.disableClose = true;
        const dialogRef = this._matDialog.open(NewTripDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(vehicle => {
            if (vehicle) {
                // this.router.navigate(['admin/vehicles/vehicle_detail'], { queryParams: vehicle });
            }
        });
    }

    filterStatus(value): void {
        console.log(value);
    }

    showCommandMenu(id: number): void {
        console.log(id)
        this.dataSource.map(item => {
            if (item.id === id) {
                item.isShowCommand = !item.isShowCommand;
            } else {
                item.isShowCommand = false;
            }

            return item
        });
        console.log(this.dataSource);
        this.monitor$ = of(this.dataSource);
    }

    startTrip(): void {
        console.log('startTrip===');
        this.closeCommandMenu();
    }

    finishTrip(): void {
        console.log('finishTrip===');
        this.closeCommandMenu();
    }

    cancelTrip(): void {
        console.log('cancelTrip===');
        this.closeCommandMenu();
    }

    reportContact(tripId: number): void {
        console.log('Report COntact===');
        this.closeCommandMenu();
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'reportContact-form-dialog';
        dialogConfig.disableClose = true;
        dialogConfig.data = { tripId: tripId };
        const dialogRef = this._matDialog.open(ReportContactDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(vehicle => {
            if (vehicle) {
                // this.router.navigate(['admin/vehicles/vehicle_detail'], { queryParams: vehicle });
            }
        });
    }

    showInMap(): void {
        console.log('MapShow===');
        this.closeCommandMenu();
    }

    showHistory(): void {
        console.log('startHistory===');
        this.closeCommandMenu();
    }

}
