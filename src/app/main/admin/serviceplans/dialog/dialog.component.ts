import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
// import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import { ServiceplansService } from 'app/main/admin/serviceplans/services/serviceplans.service';
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as serviceplansEnglish } from 'app/main/admin/serviceplans/i18n/en';
import { locale as serviceplansSpanish } from 'app/main/admin/serviceplans/i18n/sp';
import { locale as serviceplansFrench } from 'app/main/admin/serviceplans/i18n/fr';
import { locale as serviceplansPortuguese } from 'app/main/admin/serviceplans/i18n/pt';



@Component({
    selector: 'serviceplan-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   serviceplan: any;
   flag: any;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _adminServiceplansService: ServiceplansService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,

        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {serviceplan, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(serviceplansEnglish, serviceplansSpanish, serviceplansFrench, serviceplansPortuguese);

        // this.serviceplan = serviceplan;
        this.serviceplan = serviceplan;
        this.flag = flag;
    }

    ngOnInit() {
    }


    save() {
        // if(this.flag == "duplicate") {
        //     this._adminServiceplansService.duplicateServiceplan(this.serviceplan);
        // } else if( this.flag == "delete") {
        //     this._adminServiceplansService.deleteServiceplan(this.serviceplan);
        // }

        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();

        this.router.navigate(['admin/serviceplans/serviceplans']);
    }

}
