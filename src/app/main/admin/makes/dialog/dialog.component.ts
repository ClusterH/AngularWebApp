import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as makesEnglish } from 'app/main/admin/makes/i18n/en';
import { locale as makesFrench } from 'app/main/admin/makes/i18n/fr';
import { locale as makesPortuguese } from 'app/main/admin/makes/i18n/pt';
import { locale as makesSpanish } from 'app/main/admin/makes/i18n/sp';
import { MakesService } from 'app/main/admin/makes/services/makes.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'make-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    make: any;
    flag: any;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private makesService: MakesService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { make, flag }
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(makesEnglish, makesSpanish, makesFrench, makesPortuguese);
        this.make = make;
        this.flag = flag;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.make.id = 0;
            this.make.name = '';
            this.make.createdwhen = '';
            this.make.createdbyname = '';
            this.make.lastmodifieddate = '';
            this.make.lastmodifiedbyname = '';
            this.dialogRef.close(this.make);
        } else if (this.flag == "delete") {
            this.makesService.deleteMake(this.make.id).pipe(takeUntil(this._unsubscribeAll))
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