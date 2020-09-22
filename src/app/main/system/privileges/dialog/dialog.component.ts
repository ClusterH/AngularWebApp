import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as privilegesEnglish } from 'app/main/system/privileges/i18n/en';
import { locale as privilegesFrench } from 'app/main/system/privileges/i18n/fr';
import { locale as privilegesPortuguese } from 'app/main/system/privileges/i18n/pt';
import { locale as privilegesSpanish } from 'app/main/system/privileges/i18n/sp';
import { PrivilegesService } from 'app/main/system/privileges/services/privileges.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'privilege-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    private _unsubscribeAll: Subject<any>;
    privilege: any;
    flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private privilegesService: PrivilegesService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { privilege, flag }
    ) {
        this._fuseTranslationLoaderService.loadTranslations(privilegesEnglish, privilegesSpanish, privilegesFrench, privilegesPortuguese);
        this._unsubscribeAll = new Subject();
        this.privilege = privilege;
        this.flag = flag;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.privilege.id = 0;
            this.privilege.name = '';
            this.privilege.phonenumber = '';
            this.privilege.created = '';
            this.privilege.createdbyname = '';
            this.privilege.deletedwhen = '';
            this.privilege.deletedbyname = '';
            this.privilege.lastmodifieddate = '';
            this.privilege.lastmodifiedbyname = '';
            this.dialogRef.close(this.privilege);
        } else if (this.flag == "delete") {
            this.privilegesService.deletePrivilege(this.privilege.id).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        this.dialogRef.close();
                    }
                });
        }
    }

    close() { this.dialogRef.close(); }
    goback() { this.dialogRef.close('goback'); }
}