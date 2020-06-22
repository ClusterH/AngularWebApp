import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { PrivilegesService } from 'app/main/system/privileges/services/privileges.service';

import { locale as privilegesEnglish } from 'app/main/system/privileges/i18n/en';
import { locale as privilegesSpanish } from 'app/main/system/privileges/i18n/sp';
import { locale as privilegesFrench } from 'app/main/system/privileges/i18n/fr';
import { locale as privilegesPortuguese } from 'app/main/system/privileges/i18n/pt';

@Component({
    selector: 'privilege-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   privilege: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private privilegesService: PrivilegesService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {privilege, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(privilegesEnglish, privilegesSpanish, privilegesFrench, privilegesPortuguese);

        this.privilege = privilege;
        this.flag = flag;
        
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.privilege.id = 0;
            this.privilege.name = '';
            this.privilege.phonenumber = '';
            this.privilege.created = '';
            this.privilege.createdbyname = '';
            this.privilege.deletedwhen = '';
            this.privilege.deletedbyname = '';
            this.privilege.lastmodifieddate = '';
            this.privilege.lastmodifiedbyname = '';
    
            localStorage.setItem("privilege_detail", JSON.stringify(this.privilege));
    
            
    
            this.router.navigate(['system/privileges/privilege_detail']);
        } else if( this.flag == "delete") {
            this.privilegesService.deletePrivilege(this.privilege.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    this.reloadComponent();
                }
            });
        }

        this.dialogRef.close();
    }

    close() {
        localStorage.removeItem("privilege_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("privilege_detail");

        this.router.navigate(['system/privileges/privileges']);
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['system/privileges/privileges']);
    }

}
