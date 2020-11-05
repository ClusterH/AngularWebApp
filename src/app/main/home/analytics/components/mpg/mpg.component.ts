import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MPGDialogComponent } from "app/main/home/analytics/dialog/mpgdialog/dialog.component";
import { ClipsService } from 'app/main/home/analytics/services/clips.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-mpg',
    templateUrl: './mpg.component.html',
    styleUrls: ['./mpg.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None

})
export class MpgComponent implements OnInit, OnDestroy {
    selectedTime = 'today';
    mpg: number;
    mpgUnits: string;
    mpg_detail: any;
    private _unsubscribeAll: Subject<any>;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(private clipsservice: ClipsService, public _matDialog: MatDialog,
    ) {
        this._unsubscribeAll = new Subject();
        this.clipsservice.clip_mileage('clip_mpg').then(res => {
            this.clipsservice.clip_mpgChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                if (res.responseCode == 100) {
                    console.log('mpgComponent===>>>', res);
                    this.animateValue(0, res.TrackingXLAPI.DATA[0].mpg, 500)
                    // this.mpg = res.TrackingXLAPI.DATA[0].mpg;
                    this.mpgUnits = res.TrackingXLAPI.DATA[0].mpgunits;
                }
            });
            this.clipsservice.clip_mileageDetail('clip_mpg_detail').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                if (res.responseCode == 100) {
                    this.mpg_detail = res.TrackingXLAPI.DATA;
                    console.log(res);
                }
            });
        });
    }

    ngOnInit() { }

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
            this.mpg = current;
            if (current == end) {
                clearInterval(timer);
            }
        }, stepTime);
    }
    showDetail() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.data = { detail: this.mpg_detail, flag: 'mpg' };
        const dialogRef = this._matDialog.open(MPGDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {

        });
    }

}
