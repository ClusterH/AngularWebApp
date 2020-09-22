import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { DevicesService } from 'app/main/system/devices/services/devices.service';
import { locale as devicesEnglish } from 'app/main/system/devices/i18n/en';
import { locale as devicesSpanish } from 'app/main/system/devices/i18n/sp';
import { locale as devicesFrench } from 'app/main/system/devices/i18n/fr';
import { locale as devicesPortuguese } from 'app/main/system/devices/i18n/pt';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'device-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    private _unsubscribeAll: Subject<any>;
    device: any;
    flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private devicesService: DevicesService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { device, flag }
    ) {
        this._fuseTranslationLoaderService.loadTranslations(devicesEnglish, devicesSpanish, devicesFrench, devicesPortuguese);
        this._unsubscribeAll = new Subject();
        this.device = device;
        this.flag = flag;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.device.id = 0;
            this.device.name = '';
            this.device.imei = '';
            this.device.serialnumber = '';
            this.device.created = '';
            this.device.createdbyname = '';
            this.device.deletedwhen = '';
            this.device.deletedbyname = '';
            this.device.lastmodifieddate = '';
            this.device.lastmodifiedbyname = '';
            this.dialogRef.close(this.device);
        } else if (this.flag == "delete") {
            this.devicesService.deleteDevice(this.device.id).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        this.dialogRef.close(result);
                    }
                });
        }
    }

    close() { this.dialogRef.close(); }
    goback() { this.dialogRef.close('goback'); }
}