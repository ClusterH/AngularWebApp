import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as simcardsEnglish } from 'app/main/system/simcards/i18n/en';
import { locale as simcardsFrench } from 'app/main/system/simcards/i18n/fr';
import { locale as simcardsPortuguese } from 'app/main/system/simcards/i18n/pt';
import { locale as simcardsSpanish } from 'app/main/system/simcards/i18n/sp';
import { SimcardsService } from 'app/main/system/simcards/services/simcards.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'simcard-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    private _unsubscribeAll: Subject<any>;
    simcard: any;
    flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private simcardsService: SimcardsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { simcard, flag }
    ) {
        this._fuseTranslationLoaderService.loadTranslations(simcardsEnglish, simcardsSpanish, simcardsFrench, simcardsPortuguese);
        this._unsubscribeAll = new Subject();
        this.simcard = simcard;
        this.flag = flag;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.simcard.id = 0;
            this.simcard.name = '';
            this.simcard.phonenumber = '';
            this.simcard.created = '';
            this.simcard.createdbyname = '';
            this.simcard.deletedwhen = '';
            this.simcard.deletedbyname = '';
            this.simcard.lastmodifieddate = '';
            this.simcard.lastmodifiedbyname = '';
            this.dialogRef.close(this.simcard);
        } else if (this.flag == "delete") {
            this.simcardsService.deleteSimcard(this.simcard.id).pipe(takeUntil(this._unsubscribeAll))
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