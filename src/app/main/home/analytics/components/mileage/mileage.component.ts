import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { ClipsService } from 'app/main/home/analytics/services/clips.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { CourseDialogComponent } from "app/main/home/analytics/dialog/dialog.component";

// export interface PeriodicElement {
//     name: string;
//     distance: number;
//     distanceunits: string;
//     from: string;
//     to: string;
// }

@Component({
    selector: 'app-mileage',
    templateUrl: './mileage.component.html',
    styleUrls: ['./mileage.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None

})
export class MileageComponent implements OnInit, OnDestroy {
    selectedTime = 'today';
    distance: number;
    distanceUnit: string;
    clip_detail: any;
    displayedColumns = ['name', 'distance', 'distanceunits', 'from', 'to'];
    // dataSource = new MatTableDataSource<PeriodicElement>([]);
    private _unsubscribeAll: Subject<any>;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // @ViewChild(MatSort) sort: MatSort;
    // @ViewChild('paginator') paginator: MatPaginator;

    constructor(private clipsservice: ClipsService, public _matDialog: MatDialog,
    ) {
        this._unsubscribeAll = new Subject();
        this.clipsservice.clip_mileage('clip_mileage').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            if (res.responseCode == 100) {
                this.distance = res.TrackingXLAPI.DATA[0].distance;
                this.distanceUnit = res.TrackingXLAPI.DATA[0].distanceunits;
            }
        });
        this.clipsservice.clip_mileage('clip_mileage_detail').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            if (res.responseCode == 100) {
                this.clip_detail = res.TrackingXLAPI.DATA;
                // this.dataSource = new MatTableDataSource<PeriodicElement>(res.TrackingXLAPI.DATA.slice(0, 10));

                // this.distance = res.TrackingXLAPI.DATA[0].distance;
                // this.distanceUnit = res.TrackingXLAPI.DATA[0].distanceunits;
            }
        });
    }

    ngOnInit() {
        // setTimeout(() => this.dataSource.paginator = this.paginator);
        // this.dataSource.sort = this.sort;
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    showDetail() {
        console.log('paginatgion');
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.data = { detail: this.clip_detail, flag: 'mileage' };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            console.log(result);
        });
    }

}
