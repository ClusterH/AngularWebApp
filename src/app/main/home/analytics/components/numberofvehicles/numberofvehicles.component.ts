import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { NumberOfVehiclesDialogComponent } from "app/main/home/analytics/dialog/numberofvehiclesdialog/numberofvehiclesdialog.component";
import { ClipsService } from 'app/main/home/analytics/services/clips.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { locale as vehiclesEnglish } from 'app/main/home/analytics/i18n/en';
import { locale as vehiclesFrench } from 'app/main/home/analytics/i18n/fr';
import { locale as vehiclesPortuguese } from 'app/main/home/analytics/i18n/pt';
import { locale as vehiclesSpanish } from 'app/main/home/analytics/i18n/sp';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

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

    constructor(private clipsservice: ClipsService, public _matDialog: MatDialog, private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(vehiclesEnglish, vehiclesSpanish, vehiclesFrench, vehiclesPortuguese);

        this.clipsservice.clip_mileage('clip_numberofvehicles').then(res => {
            this.clipsservice.clip_numberofvehiclesChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                if (res.responseCode == 100) {
                    this.animateValue(0, res.TrackingXLAPI.DATA[0].vehcount, 500)
                    // this.vehcount = res.TrackingXLAPI.DATA[0].vehcount;
                    this.vehon = res.TrackingXLAPI.DATA[0].vehon;
                }
            });
        });
        // this.clipsservice.clip_mileage('clip_numberofvehicles').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
        //     if (res.responseCode == 100) {
        //         this.vehcount = res.TrackingXLAPI.DATA[0].vehcount;
        //         this.vehon = res.TrackingXLAPI.DATA[0].vehon;
        //     }
        // });
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
            this.vehcount = current;
            if (current == end) {
                clearInterval(timer);
            }
        }, stepTime);
    }
    showDetail() {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.data = { detail: this.clip_detail, flag: 'numberofvehicles' };
        const dialogRef = this._matDialog.open(NumberOfVehiclesDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {

        });
    }

}
