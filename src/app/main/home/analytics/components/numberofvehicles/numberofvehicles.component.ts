import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { NumberOfVehiclesDialogComponent } from "app/main/home/analytics/dialog/numberofvehiclesdialog/numberofvehiclesdialog.component";
import { ClipsService } from 'app/main/home/analytics/services/clips.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-numberofvehicles',
    templateUrl: './numberofvehicles.component.html',
    styleUrls: ['./numberofvehicles.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None

})
export class NumberOfVehiclesComponent implements OnInit, OnDestroy {
    selectedTime = 'today';
    vehcount: number;
    vehon: number;
    clip_detail: any;
    displayedColumns = ['name', 'distance', 'distanceunits', 'from', 'to'];
    private _unsubscribeAll: Subject<any>;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // @ViewChild(MatSort) sort: MatSort;
    // @ViewChild('paginator') paginator: MatPaginator;

    constructor(private clipsservice: ClipsService, public _matDialog: MatDialog,
    ) {
        this._unsubscribeAll = new Subject();
        this.clipsservice.clip_mileage('clip_numberofvehicles').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            if (res.responseCode == 100) {
                console.log(res);
                this.vehcount = res.TrackingXLAPI.DATA[0].vehcount;
                this.vehon = res.TrackingXLAPI.DATA[0].vehon;
            }
        });
    }

    ngOnInit() {

    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    showDetail() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.data = { detail: this.clip_detail, flag: 'numberofvehicles' };
        const dialogRef = this._matDialog.open(NumberOfVehiclesDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            console.log(result);
        });
    }

}
