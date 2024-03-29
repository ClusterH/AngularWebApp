import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { SysCommandsService } from 'app/main/system/syscommands/services/syscommands.service';
import { locale as syscommandsEnglish } from 'app/main/system/syscommands/i18n/en';
import { locale as syscommandsSpanish } from 'app/main/system/syscommands/i18n/sp';
import { locale as syscommandsFrench } from 'app/main/system/syscommands/i18n/fr';
import { locale as syscommandsPortuguese } from 'app/main/system/syscommands/i18n/pt';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'syscommand-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    private _unsubscribeAll: Subject<any>;
    syscommand: any;
    flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private syscommandsService: SysCommandsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { syscommand, flag }
    ) {
        this._fuseTranslationLoaderService.loadTranslations(syscommandsEnglish, syscommandsSpanish, syscommandsFrench, syscommandsPortuguese);
        this._unsubscribeAll = new Subject();
        this.syscommand = syscommand;
        this.flag = flag;
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.syscommand.id = 0;
            this.syscommand.name = '';
            this.syscommand.createdwhen = '';
            this.syscommand.createdbyname = '';
            this.syscommand.lastmodifieddate = '';
            this.syscommand.lastmodifiedbyname = '';
            this.dialogRef.close(this.syscommand);
        } else if (this.flag == "delete") {
            this.syscommandsService.deleteSysCommand(this.syscommand.id).pipe(takeUntil(this._unsubscribeAll))
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