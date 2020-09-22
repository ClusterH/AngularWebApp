import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { UnittypesService } from 'app/main/system/unittypes/services/unittypes.service';
import { locale as unittypesEnglish } from 'app/main/system/unittypes/i18n/en';
import { locale as unittypesSpanish } from 'app/main/system/unittypes/i18n/sp';
import { locale as unittypesFrench } from 'app/main/system/unittypes/i18n/fr';
import { locale as unittypesPortuguese } from 'app/main/system/unittypes/i18n/pt';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'unittype-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    private _unsubscribeAll: Subject<any>;
    unittype: any;
    flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private unittypesService: UnittypesService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { unittype, flag }
    ) {
        this._fuseTranslationLoaderService.loadTranslations(unittypesEnglish, unittypesSpanish, unittypesFrench, unittypesPortuguese);
        this._unsubscribeAll = new Subject();
        this.unittype = unittype;
        this.flag = flag;
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.unittype.id = 0;
            this.unittype.name = '';
            this.unittype.created = '';
            this.unittype.createdbyname = '';
            this.unittype.deletedwhen = '';
            this.unittype.deletedbyname = '';
            this.unittype.lastmodifieddate = '';
            this.unittype.lastmodifiedbyname = '';
            this.dialogRef.close(this.unittype);
        } else if (this.flag == "delete") {
            this.unittypesService.deleteUnittype(this.unittype.id).pipe(takeUntil(this._unsubscribeAll))
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