import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
// import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import { ModelsService } from 'app/main/admin/models/services/models.service';
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as modelsEnglish } from 'app/main/admin/models/i18n/en';
import { locale as modelsSpanish } from 'app/main/admin/models/i18n/sp';
import { locale as modelsFrench } from 'app/main/admin/models/i18n/fr';
import { locale as modelsPortuguese } from 'app/main/admin/models/i18n/pt';



@Component({
    selector: 'model-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   model: any;
   flag: any;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _adminModelsService: ModelsService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,

        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {model, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(modelsEnglish, modelsSpanish, modelsFrench, modelsPortuguese);

        // this.model = model;
        this.model = model;
        this.flag = flag;
    }

    ngOnInit() {
    }


    save() {
        // if(this.flag == "duplicate") {
        //     this._adminModelsService.duplicateModel(this.model);
        // } else if( this.flag == "delete") {
        //     this._adminModelsService.deleteModel(this.model);
        // }

        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();

        this.router.navigate(['admin/models/models']);
    }

}