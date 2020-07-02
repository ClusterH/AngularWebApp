import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { GroupsService } from 'app/main/admin/groups/services/groups.service';
import { locale as groupsEnglish } from 'app/main/admin/groups/i18n/en';
import { locale as groupsSpanish } from 'app/main/admin/groups/i18n/sp';
import { locale as groupsFrench } from 'app/main/admin/groups/i18n/fr';
import { locale as groupsPortuguese } from 'app/main/admin/groups/i18n/pt';

@Component({
    selector: 'group-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   group: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private groupsService: GroupsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {group, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(groupsEnglish, groupsSpanish, groupsFrench, groupsPortuguese);

        this.group = group;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.group.id = 0;
            this.group.name = '';
            this.group.email = '';
            this.group.address = '';
            this.group.created = '';
            this.group.createdbyname = '';
            this.group.deletedwhen = '';
            this.group.deletedbyname = '';
            this.group.lastmodifieddate = '';
            this.group.lastmodifiedbyname = '';
    
            localStorage.setItem("group_detail", JSON.stringify(this.group));
    
            
    
            this.router.navigate(['admin/groups/group_detail']);
        } else if( this.flag == "delete") {
            this.groupsService.deleteGroup(this.group.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    this.dialogRef.close(result);
                }
            });
        }
    }

    close() {
        localStorage.removeItem("group_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("group_detail");

        this.router.navigate(['admin/groups/groups']);
    }
}
