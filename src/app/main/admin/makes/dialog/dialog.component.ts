import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
// import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import { MakesService } from 'app/main/admin/makes/services/makes.service';
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as makesEnglish } from 'app/main/admin/makes/i18n/en';
import { locale as makesSpanish } from 'app/main/admin/makes/i18n/sp';
import { locale as makesFrench } from 'app/main/admin/makes/i18n/fr';
import { locale as makesPortuguese } from 'app/main/admin/makes/i18n/pt';



@Component({
    selector: 'make-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   make: any;
   flag: any;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _adminMakesService: MakesService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,

        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {make, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(makesEnglish, makesSpanish, makesFrench, makesPortuguese);

        // this.make = make;
        this.make = make;
        this.flag = flag;
    }

    ngOnInit() {
    }


    save() {
        // if(this.flag == "duplicate") {
        //     this._adminMakesService.duplicateMake(this.make);
        // } else if( this.flag == "delete") {
        //     this._adminMakesService.deleteMake(this.make);
        // }

        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();

        this.router.navigate(['admin/makes/makes']);
    }

}
