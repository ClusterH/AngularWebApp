import { Component, EventEmitter, Output, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { JobCardDialogComponent } from 'app/main/system/installations/jobs/jobs/board/dialogs/job/dialog.component';

import { locale as reportEnglish } from 'app/main/system/installations/jobs/i18n/en';
import { locale as reportFrench } from 'app/main/system/installations/jobs/i18n/fr';
import { locale as reportPortuguese } from 'app/main/system/installations/jobs/i18n/pt';
import { locale as reportSpanish } from 'app/main/system/installations/jobs/i18n/sp';
import { InstallationService } from '../../../../services'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'installation-board-add-card',
    templateUrl: './add-card.component.html',
    styleUrls: ['./add-card.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InstallationBoardAddCardComponent {
    formActive: boolean;
    form: FormGroup;
    private _unsubscribeAll: Subject<any>;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    dialogRef: any;

    @Input() installerName: any;
    @Output()
    cardAdded: EventEmitter<any>;
    @ViewChild('nameInput')
    nameInputField;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _installationService: InstallationService,
        private _matDialog: MatDialog,
    ) {
        this._unsubscribeAll = new Subject();
        this.formActive = false;
        this.cardAdded = new EventEmitter();
        this._fuseTranslationLoaderService.loadTranslations(reportEnglish, reportSpanish, reportFrench, reportPortuguese);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the form
     */
    openForm(): void {
        // this.form = this._formBuilder.group({ name: '' });
        // this.formActive = true;
        // this.focusNameField();
        // this._installationService.getInstallationDetail('0').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
        // if (res.responseCode == 100) {
        this.dialogRef = this._matDialog.open(JobCardDialogComponent, {
            panelClass: 'job-dialog',
            disableClose: true,
            data: {
                installerName: this.installerName,
                serviceDetail: null,
                flag: 'new'
            }
        });
        this.dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {

            this.cardAdded.next(res);

        });
        //     }
        // })
    }

    /**
     * Close the form
     */
    closeForm(): void { this.formActive = false; }

    /**
     * Focus to the name field
     */
    focusNameField(): void {
        setTimeout(() => {
            this.nameInputField.nativeElement.focus();
        });
    }

    /**
     * On form submit
     */
    onFormSubmit(): void {
        if (this.form.valid) {
            const cardName = this.form.getRawValue().name;
            this.cardAdded.next(cardName);
            this.formActive = false;
        }
    }
}