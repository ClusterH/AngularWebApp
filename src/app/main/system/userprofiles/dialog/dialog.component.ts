import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { UserProfilesService } from 'app/main/system/userprofiles/services/userprofiles.service';
import { locale as userprofilesEnglish } from 'app/main/system/userprofiles/i18n/en';
import { locale as userprofilesSpanish } from 'app/main/system/userprofiles/i18n/sp';
import { locale as userprofilesFrench } from 'app/main/system/userprofiles/i18n/fr';
import { locale as userprofilesPortuguese } from 'app/main/system/userprofiles/i18n/pt';

@Component({
    selector: 'userprofile-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   userprofile: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private userprofilesService: UserProfilesService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {userprofile, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(userprofilesEnglish, userprofilesSpanish, userprofilesFrench, userprofilesPortuguese);

        this.userprofile = userprofile;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.userprofile.id = 0;
            this.userprofile.name = '';
            this.userprofile.createdwhen = '';
            this.userprofile.createdbyname = '';
            this.userprofile.lastmodifieddate = '';
            this.userprofile.lastmodifiedbyname = '';
    
            localStorage.setItem("userprofile_detail", JSON.stringify(this.userprofile));
    
            
    
            this.router.navigate(['admin/userprofiles/userprofile_detail']);
        } else if( this.flag == "delete") {
            this.userprofilesService.deleteUserProfile(this.userprofile.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    this.dialogRef.close(result);
                }
            });
        }

    }

    close() {
        localStorage.removeItem("userprofile_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("userprofile_detail");

        this.router.navigate(['system/userprofiles/userprofiles']);
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['system/userprofiles/userprofiles']);
    }

}
