import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ServiceplansService } from 'app/main/system/serviceplans/services/serviceplans.service';
import { locale as serviceplansEnglish } from 'app/main/system/serviceplans/i18n/en';
import { locale as serviceplansSpanish } from 'app/main/system/serviceplans/i18n/sp';
import { locale as serviceplansFrench } from 'app/main/system/serviceplans/i18n/fr';
import { locale as serviceplansPortuguese } from 'app/main/system/serviceplans/i18n/pt';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'serviceplan-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    private _unsubscribeAll: Subject<any>;
    serviceplan: any;
    flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private serviceplansService: ServiceplansService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { serviceplan, flag }
    ) {
        this._fuseTranslationLoaderService.loadTranslations(serviceplansEnglish, serviceplansSpanish, serviceplansFrench, serviceplansPortuguese);
        this._unsubscribeAll = new Subject();
        this.serviceplan = serviceplan;
        this.flag = flag;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.serviceplan.id = 0;
            this.serviceplan.name = '';
            this.serviceplan.created = '';
            this.serviceplan.createdbyname = '';
            this.serviceplan.deletedwhen = '';
            this.serviceplan.deletedbyname = '';
            this.serviceplan.lastmodifieddate = '';
            this.serviceplan.lastmodifiedbyname = '';
            this.dialogRef.close(this.serviceplan);
        } else if (this.flag == "delete") {
            this.serviceplansService.deleteServiceplan(this.serviceplan.id).pipe(takeUntil(this._unsubscribeAll))
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