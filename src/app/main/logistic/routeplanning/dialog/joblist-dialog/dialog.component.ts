import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as jobsEnglish } from '../../i18n/en';
import { locale as jobsFrench } from '../../i18n/fr';
import { locale as jobsPortuguese } from '../../i18n/pt';
import { locale as jobsSpanish } from '../../i18n/sp';
import { RoutePlanningJobService } from '../../services';
import { JobList } from '../../model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'joblist-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class JobListDialogComponent implements OnDestroy {
    job: JobList;
    flag: string;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private router: Router,
        private routeplanningJobService: RoutePlanningJobService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dialogRef: MatDialogRef<JobListDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { job, flag }
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(jobsEnglish, jobsSpanish, jobsFrench, jobsPortuguese);
        this.job = job;
        this.flag = flag;

    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.job.id = 0;
            this.dialogRef.close(this.job);
        } else if (this.flag == "delete") {
            this.routeplanningJobService.deleteJob(this.job.id).pipe(takeUntil(this._unsubscribeAll))
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