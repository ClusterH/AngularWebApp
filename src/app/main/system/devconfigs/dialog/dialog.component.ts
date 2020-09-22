import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { DevConfigsService } from 'app/main/system/devconfigs/services/devconfigs.service';
import { locale as devconfigsEnglish } from 'app/main/system/devconfigs/i18n/en';
import { locale as devconfigsSpanish } from 'app/main/system/devconfigs/i18n/sp';
import { locale as devconfigsFrench } from 'app/main/system/devconfigs/i18n/fr';
import { locale as devconfigsPortuguese } from 'app/main/system/devconfigs/i18n/pt';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'devconfig-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    private _unsubscribeAll: Subject<any>;
    devconfig: any;
    flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private devconfigsService: DevConfigsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { devconfig, flag }
    ) {
        this._fuseTranslationLoaderService.loadTranslations(devconfigsEnglish, devconfigsSpanish, devconfigsFrench, devconfigsPortuguese);
        this._unsubscribeAll = new Subject();
        this.devconfig = devconfig;
        this.flag = flag;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.devconfig.id = 0;
            this.devconfig.name = '';
            this.devconfig.createdwhen = '';
            this.devconfig.createdbyname = '';
            this.devconfig.lastmodifieddate = '';
            this.devconfig.lastmodifiedbyname = '';
            this.dialogRef.close(this.devconfig);
        } else if (this.flag == "delete") {
            this.devconfigsService.deleteDevConfig(this.devconfig.id, 'devconfig_delete').pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        this.dialogRef.close(result);
                    }
                });
        } else if (this.flag == "delete_cmd") {
            this.devconfigsService.deleteDevConfig(this.devconfig.id, 'devconfigcmd_delete').pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        this.dialogRef.close(result);
                    }
                });
        }
    }

    close() { this.dialogRef.close(); }
    goback() { this.dialogRef.close(); }
}