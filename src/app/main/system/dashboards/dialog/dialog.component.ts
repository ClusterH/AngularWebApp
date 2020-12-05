import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as dashboardsEnglish } from 'app/main/system/dashboards/i18n/en';
import { locale as dashboardsFrench } from 'app/main/system/dashboards/i18n/fr';
import { locale as dashboardsPortuguese } from 'app/main/system/dashboards/i18n/pt';
import { locale as dashboardsSpanish } from 'app/main/system/dashboards/i18n/sp';
import { DashboardsService } from 'app/main/system/dashboards/services/dashboards.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'dashboard-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    private _unsubscribeAll: Subject<any>;
    dashboard: any;
    flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dashboardsService: DashboardsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { dashboard, flag }
    ) {
        this._fuseTranslationLoaderService.loadTranslations(dashboardsEnglish, dashboardsSpanish, dashboardsFrench, dashboardsPortuguese);
        this._unsubscribeAll = new Subject();
        this.dashboard = dashboard;
        this.flag = flag;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "delete") {
            this.dashboardsService.deleteDashboard(this.dashboard.id).pipe(takeUntil(this._unsubscribeAll))
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