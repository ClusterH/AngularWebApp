import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as usersEnglish } from 'app/main/admin/users/i18n/en';
import { locale as usersFrench } from 'app/main/admin/users/i18n/fr';
import { locale as usersPortuguese } from 'app/main/admin/users/i18n/pt';
import { locale as usersSpanish } from 'app/main/admin/users/i18n/sp';
import { UsersService } from 'app/main/admin/users/services/users.service';

@Component({
    selector: 'user-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   user: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private usersService: UsersService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {user, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(usersEnglish, usersSpanish, usersFrench, usersPortuguese);

        this.user = user;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.user.id = 0;
            this.user.name = '';
            this.user.email = '';
            this.user.password = '';
            this.user.created = '';
            this.user.createdbyname = '';
            this.user.deletedwhen = '';
            this.user.deletedbyname = '';
            this.user.lastmodifieddate = '';
            this.user.lastmodifiedbyname = '';
    
            localStorage.setItem("user_detail", JSON.stringify(this.user));
    
            this.router.navigate(['admin/users/user_detail']);
        } else if( this.flag == "delete") {
            this.usersService.deleteUser(this.user.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    this.dialogRef.close(result);
                }
              });
        }
    }

    close() {
        localStorage.removeItem("user_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("user_detail");

        this.router.navigate(['admin/users/users']);
    }
}
