import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
// import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import { UsersService } from 'app/main/admin/users/services/users.service';
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as usersEnglish } from 'app/main/admin/users/i18n/en';
import { locale as usersSpanish } from 'app/main/admin/users/i18n/sp';
import { locale as usersFrench } from 'app/main/admin/users/i18n/fr';
import { locale as usersPortuguese } from 'app/main/admin/users/i18n/pt';



@Component({
    selector: 'user-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   user: any;
   flag: any;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _adminUsersService: UsersService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,

        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {user, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(usersEnglish, usersSpanish, usersFrench, usersPortuguese);

        // this.user = user;
        this.user = user;
        this.flag = flag;
    }

    ngOnInit() {
    }


    save() {
        // if(this.flag == "duplicate") {
        //     this._adminUsersService.duplicateUser(this.user);
        // } else if( this.flag == "delete") {
        //     this._adminUsersService.deleteUser(this.user);
        // }

        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();

        this.router.navigate(['admin/users/users']);
    }

}
