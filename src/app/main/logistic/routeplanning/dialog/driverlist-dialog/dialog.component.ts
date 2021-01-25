import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as jobsEnglish } from '../../i18n/en';
import { locale as jobsFrench } from '../../i18n/fr';
import { locale as jobsPortuguese } from '../../i18n/pt';
import { locale as jobsSpanish } from '../../i18n/sp';
import { RoutePlanningDriverService } from '../../services';
import { JobList } from '../../model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'driverlist-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class DriverListDialogComponent implements OnDestroy {
    driver: any;
    flag: string;
    seldate: string;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private router: Router,
        private routeplanningDriverService: RoutePlanningDriverService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dialogRef: MatDialogRef<DriverListDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { driver, flag, seldate }
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(jobsEnglish, jobsSpanish, jobsFrench, jobsPortuguese);
        this.driver = driver;
        this.flag = flag;
        this.seldate = seldate;

    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.driver.id = 0;
            this.dialogRef.close(this.driver);
        } else if (this.flag == "delete") {
            this.routeplanningDriverService.deleteDriver(this.driver.id, this.seldate).pipe(takeUntil(this._unsubscribeAll))
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