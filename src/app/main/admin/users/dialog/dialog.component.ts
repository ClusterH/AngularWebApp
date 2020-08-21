import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as usersEnglish } from 'app/main/admin/users/i18n/en';
import { locale as usersFrench } from 'app/main/admin/users/i18n/fr';
import { locale as usersPortuguese } from 'app/main/admin/users/i18n/pt';
import { locale as usersSpanish } from 'app/main/admin/users/i18n/sp';
import { UsersService } from 'app/main/admin/users/services/users.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'user-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    private _unsubscribeAll: Subject<any>;
    user: any;
    flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private usersService: UsersService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { user, flag }
    ) {
        this._fuseTranslationLoaderService.loadTranslations(usersEnglish, usersSpanish, usersFrench, usersPortuguese);
        this._unsubscribeAll = new Subject();
        this.user = user;
        this.flag = flag;
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
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
            this.dialogRef.close(this.user);
        } else if (this.flag == "delete") {
            this.usersService.deleteUser(this.user.id).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        this.dialogRef.close(result);
                    }
                });
        }
    }

    close() { this.dialogRef.close(); }
    goback() { this.dialogRef.close('goback'); }
}