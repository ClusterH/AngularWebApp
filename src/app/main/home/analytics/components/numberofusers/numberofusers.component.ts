import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { NumberOfUsersDialogComponent } from "app/main/home/analytics/dialog/numberofusersdialog/numberofusersdialog.component";
import { ClipsService } from 'app/main/home/analytics/services/clips.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-numberofusers',
    templateUrl: './numberofusers.component.html',
    styleUrls: ['./numberofusers.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None

})
export class NumberOfUsersComponent implements OnInit, OnDestroy {
    selectedTime = 'today';
    usercount: number;

    clip_detail: any;
    private _unsubscribeAll: Subject<any>;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(private clipsservice: ClipsService, public _matDialog: MatDialog,
    ) {
        this._unsubscribeAll = new Subject();
        this.clipsservice.clip_mileage('clip_numberofusers').then(res => {
            this.clipsservice.clip_numberofusersChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                if (res.responseCode == 100) {
                    this.animateValue(0, res.TrackingXLAPI.DATA[0].usercount, 500)
                    // this.usercount = res.TrackingXLAPI.DATA[0].usercount;
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
            this.usercount = current;
            if (current == end) {
                clearInterval(timer);
            }
        }, stepTime);
    }
    showDetail() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.data = { detail: this.clip_detail, flag: 'numberofusers' };
        const dialogRef = this._matDialog.open(NumberOfUsersDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {

        });
    }
}