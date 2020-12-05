import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as reportEnglish } from 'app/main/system/installations/jobs/i18n/en';
import { locale as reportFrench } from 'app/main/system/installations/jobs/i18n/fr';
import { locale as reportPortuguese } from 'app/main/system/installations/jobs/i18n/pt';
import { locale as reportSpanish } from 'app/main/system/installations/jobs/i18n/sp';

@Component({
    selector: 'installation-board-add-card',
    templateUrl: './add-card.component.html',
    styleUrls: ['./add-card.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InstallationBoardAddCardComponent {
    formActive: boolean;
    form: FormGroup;
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
    ) {
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
        this.form = this._formBuilder.group({ name: '' });
        this.formActive = true;
        this.focusNameField();
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