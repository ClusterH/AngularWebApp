import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as poisEnglish } from 'app/main/admin/poi/pois/i18n/en';
import { locale as poisFrench } from 'app/main/admin/poi/pois/i18n/fr';
import { locale as poisPortuguese } from 'app/main/admin/poi/pois/i18n/pt';
import { locale as poisSpanish } from 'app/main/admin/poi/pois/i18n/sp';
import { PoisService } from 'app/main/admin/poi/pois/services/pois.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'poi-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    poi: any;
    flag: any;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private poisService: PoisService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { poi, flag }
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(poisEnglish, poisSpanish, poisFrench, poisPortuguese);
        this.poi = poi;
        this.flag = flag;
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.poi.id = 0;
            this.poi.name = '';
            this.poi.created = '';
            this.poi.createdbyname = '';
            this.poi.deletedwhen = '';
            this.poi.deletedbyname = '';
            this.poi.lastmodifieddate = '';
            this.poi.lastmodifiedbyname = '';
            this.dialogRef.close(this.poi);
        } else if (this.flag == "delete") {
            this.poisService.deletePoi(this.poi.id).pipe(takeUntil(this._unsubscribeAll))
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