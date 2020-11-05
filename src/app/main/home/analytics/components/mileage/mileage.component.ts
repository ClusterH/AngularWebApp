import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { CourseDialogComponent } from "app/main/home/analytics/dialog/mileagedialog/dialog.component";
import { ClipsService } from 'app/main/home/analytics/services/clips.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    private _unsubscribeAll: Subject<any>;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(private clipsservice: ClipsService, public _matDialog: MatDialog,
    ) {
        this._unsubscribeAll = new Subject();
        this.clipsservice.clip_mileage('clip_mileage').then(res => {
            this.clipsservice.clip_mileageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                if (res.responseCode == 100) {
                    this.animateValue(0, res.TrackingXLAPI.DATA[0].distance, 500)
                    this.distanceUnit = res.TrackingXLAPI.DATA[0].distanceunits;
                }
            });
            this.clipsservice.clip_mileageDetail('clip_mileage_detail').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                if (res.responseCode == 100) {
                    this.clip_detail = res.TrackingXLAPI.DATA;
                }
            });
        });
    }

    ngOnInit() {

    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    animateValue(start: number, end: number, duration: number) {
        if (start == end) return;
        const range = end - start;
        let current = Math.floor(end / 2);
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        let timer = setInterval(() => {
            current += increment;
            this.distance = current;
            if (current == end) {
                clearInterval(timer);
            }
        }, stepTime);
    }
    showDetail() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.data = { detail: this.clip_detail, flag: 'mileage' };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {

        });
    }

}
