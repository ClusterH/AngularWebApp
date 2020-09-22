import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { OperatorsService } from 'app/main/admin/operators/services/operators.service';
import { locale as operatorsEnglish } from 'app/main/admin/operators/i18n/en';
import { locale as operatorsSpanish } from 'app/main/admin/operators/i18n/sp';
import { locale as operatorsFrench } from 'app/main/admin/operators/i18n/fr';
import { locale as operatorsPortuguese } from 'app/main/admin/operators/i18n/pt';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
    selector: 'operator-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    operator: any;
    flag: any;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private operatorsService: OperatorsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { operator, flag }
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(operatorsEnglish, operatorsSpanish, operatorsFrench, operatorsPortuguese);
        this.operator = operator;
        this.flag = flag;
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.operator.id = 0;
            this.operator.name = '';
            this.operator.email = '';
            this.operator.password = '';
            this.operator.phonenumber = '';
            this.operator.created = '';
            this.operator.createdbyname = '';
            this.operator.deletedwhen = '';
            this.operator.deletedbyname = '';
            this.operator.lastmodifieddate = '';
            this.operator.lastmodifiedbyname = '';
            this.dialogRef.close(this.operator);
        } else if (this.flag == "delete") {
            this.operatorsService.deleteOperator(this.operator.id).pipe(takeUntil(this._unsubscribeAll))
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
