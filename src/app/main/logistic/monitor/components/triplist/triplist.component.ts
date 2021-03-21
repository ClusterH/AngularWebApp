import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
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

    currentTripId: number;
    currentTrip: any[];
    isShow: boolean = false;

    dialogRef: any;

    private _unsubscribeAll: Subject<any>;
    @ViewChild('dt') table: Table;
    @Output() tripPathEmitter = new EventEmitter();

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

            this.dataSource = [...res.TrackingXLAPI.DATA];
            this.closeCommandMenu();

            if (this.dataSource) {
                this.totalRecords = this.dataSource.length;
                this.dataSource.map(trip => {
                    trip.isShow = false;
                    trip.isStartTrip = false;
                    trip.isStartStop = false;
                    return trip;
                })
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

        this.monitorService.monitor.next(this.dataSource);
    }

    addNewTrip(): void {
        this.closeCommandMenu();
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'newTrip-dialog';
        dialogConfig.disableClose = true;
        const dialogRef = this._matDialog.open(NewTripDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(trip => {
            if (trip === 'failed') {
                alert('Add New Trip Failed');
            }
        });
    }

    filterStatus(value): void {
    }

    showCommandMenu(id: number): void {
        this.dataSource.map(item => {
            if (item.id === id) {
                item.isShowCommand = !item.isShowCommand;
            } else {
                item.isShowCommand = false;
            }

            return item
        });
        this.monitorService.monitor.next(this.dataSource);
    }

    startTrip(tripid): void {
        this.closeCommandMenu();
        this.monitorService.tripEvent('starttrip', tripid).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            if (res.responseCode === 100) {
                const currentId = this.dataSource.findIndex(trip => trip.id === tripid);
                this.dataSource[currentId].isStartTrip = true;
                this.dataSource[currentId].tripstatus = 'On Route';
                this.dataSource[currentId].tripstatusid = 2;
            } else {
                alert('Failed Start Trip!');
            }
        })
    }

    finishTrip(tripid): void {
        this.closeCommandMenu();
        this.monitorService.tripEvent('finishtrip', tripid).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            if (res.responseCode === 100) {
                const currentId = this.dataSource.findIndex(trip => trip.id === tripid);
                this.dataSource[currentId].isStartTrip = false;
                this.dataSource[currentId].isStartStop = false;
                this.dataSource[currentId].tripstatus = 'Completed';
                this.dataSource[currentId].tripstatusid = 5;
            } else {
                alert('Failed Finish Trip!');
            }
        })
    }

    cancelTrip(tripid): void {
        this.closeCommandMenu();
        this.monitorService.tripEvent('canceltrip', tripid).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            if (res.responseCode === 100) {
                const currentId = this.dataSource.findIndex(trip => trip.id === tripid);
                this.dataSource[currentId].isStartTrip = false;
                this.dataSource[currentId].isStartStop = false;
                this.dataSource[currentId].tripstatus = 'Canceled';
                this.dataSource[currentId].tripstatusid = 6;
            } else {
                alert('Failed Cancel Trip!');
            }
        })
    }

    startStop(tripid): void {
        this.closeCommandMenu();
        this.monitorService.tripEvent('starttripstop', tripid).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            if (res.responseCode === 100) {
                const currentId = this.dataSource.findIndex(trip => trip.id === tripid);
                this.dataSource[currentId].isStartStop = true;
                this.dataSource[currentId].tripstatus = 'Stopped';
                this.dataSource[currentId].tripstatusid = 4;
            } else {
                alert('Failed Start Stop!');
            }
        })
    }

    finishStop(tripid): void {
        this.closeCommandMenu();
        this.monitorService.tripEvent('finishtripstop', tripid).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            if (res.responseCode === 100) {
                const currentId = this.dataSource.findIndex(trip => trip.id === tripid);
                this.dataSource[currentId].isStartStop = false;
                this.dataSource[currentId].tripstatus = 'On Route';
                this.dataSource[currentId].tripstatusid = 2;
            } else {
                alert('Failed Finish Stop!');
            }
        })
    }

    reportContact(trip: any): void {
        this.closeCommandMenu();
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'reportContact-form-dialog';
        dialogConfig.disableClose = true;
        dialogConfig.data = { trip: trip };
        const dialogRef = this._matDialog.open(ReportContactDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            if (res) {
                // this.router.navigate(['admin/vehicles/vehicle_detail'], { queryParams: vehicle });
            }
        });
    }

    showInMap(tripid: number): void {
        this.closeCommandMenu();

        if (tripid === this.currentTripId) {
            const currentId = this.dataSource.findIndex(trip => trip.id === tripid);
            this.dataSource[currentId].isShow = true;
            this.tripPathEmitter.emit(this.currentTrip);
        } else {
            this.monitorService.getTripWatchPath(tripid).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                if (res.responseCode === 100) {
                    this.currentTripId = tripid;
                    this.currentTrip = [...res.TrackingXLAPI.DATA];
                    this.dataSource.map(trip => {
                        if (trip.id === tripid) {
                            trip.isShow = true;
                        } else {
                            trip.isShow = false;
                        }
                        return trip;
                    });

                    this.tripPathEmitter.emit(res.TrackingXLAPI.DATA);
                } else {
                    alert('Failed to get Path');
                }
            })
        }
    }

    hideInMap(tripid: number): void {
        this.closeCommandMenu();
        this.dataSource.map(trip => {
            if (trip.id === tripid) {
                trip.isShow = false;
            }

            return trip;
        });

        this.tripPathEmitter.emit([]);
    }

    showHistory(): void {
        this.closeCommandMenu();
    }

}
