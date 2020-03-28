import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
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
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,

        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {model, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(modelsEnglish, modelsSpanish, modelsFrench, modelsPortuguese);

        this.model = model;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.model.id = 0;
            this.model.name = '';
            this.model.createdwhen = '';
            this.model.createdbyname = '';
            this.model.lastmodifieddate = '';
            this.model.lastmodifiedbyname = '';
    
            localStorage.setItem("model_detail", JSON.stringify(this.model));
    
            console.log("localstorage:", JSON.parse(localStorage.getItem("model_detail")));
    
            this.router.navigate(['admin/models/model_detail']);
        } else if( this.flag == "delete") {
            // this._adminModelsService.deleteModel(this.model);
        }

        this.dialogRef.close();
    }

    close() {
        localStorage.removeItem("model_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("model_detail");

        this.router.navigate(['admin/models/models']);
    }

}
