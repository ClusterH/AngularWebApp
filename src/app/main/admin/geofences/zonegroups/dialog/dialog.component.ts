import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ZonegroupsService } from 'app/main/admin/geofences/zonegroups/services/zonegroups.service';
import { locale as zonegroupsEnglish } from 'app/main/admin/geofences/zonegroups/i18n/en';
import { locale as zonegroupsSpanish } from 'app/main/admin/geofences/zonegroups/i18n/sp';
import { locale as zonegroupsFrench } from 'app/main/admin/geofences/zonegroups/i18n/fr';
import { locale as zonegroupsPortuguese } from 'app/main/admin/geofences/zonegroups/i18n/pt';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'zonegroup-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    private _unsubscribeAll: Subject<any>;
    zonegroup: any;
    flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private zonegroupsService: ZonegroupsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { zonegroup, flag }
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(zonegroupsEnglish, zonegroupsSpanish, zonegroupsFrench, zonegroupsPortuguese);
        this.zonegroup = zonegroup;
        this.flag = flag;
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.zonegroup.id = 0;
            this.zonegroup.name = '';
            this.zonegroup.created = '';
            this.zonegroup.createdbyname = '';
            this.zonegroup.deletedwhen = '';
            this.zonegroup.deletedbyname = '';
            this.zonegroup.lastmodifieddate = '';
            this.zonegroup.lastmodifiedbyname = '';
            this.dialogRef.close(this.zonegroup);
        } else if (this.flag == "delete") {
            this.zonegroupsService.deleteZonegroup(this.zonegroup.id).pipe(takeUntil(this._unsubscribeAll))
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