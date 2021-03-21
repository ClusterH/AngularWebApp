import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as jobsEnglish } from 'app/main/system/installations/jobs/i18n/en';
import { locale as jobsFrench } from 'app/main/system/installations/jobs/i18n/fr';
import { locale as jobsPortuguese } from 'app/main/system/installations/jobs/i18n/pt';
import { locale as jobsSpanish } from 'app/main/system/installations/jobs/i18n/sp';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'cardDnDConfirm-dialog',
    templateUrl: './cardDnDConfirmDialog.component.html',
    styleUrls: ['./cardDnDConfirmDialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CardDnDConfirmDialogComponent {
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dialogRef: MatDialogRef<CardDnDConfirmDialogComponent>,
    ) {
        this._fuseTranslationLoaderService.loadTranslations(jobsEnglish, jobsSpanish, jobsFrench, jobsPortuguese);
    }

    move() {
        this.dialogRef.close('move');
    }

    close() {
        this.dialogRef.close();
    }
}
