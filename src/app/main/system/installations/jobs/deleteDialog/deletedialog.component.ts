import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as jobsEnglish } from 'app/main/system/installations/jobs/i18n/en';
import { locale as jobsFrench } from 'app/main/system/installations/jobs/i18n/fr';
import { locale as jobsPortuguese } from 'app/main/system/installations/jobs/i18n/pt';
import { locale as jobsSpanish } from 'app/main/system/installations/jobs/i18n/sp';
import { JobDetail } from "app/main/system/installations/jobs/model/job.model";
import { JobsDataSource } from "app/main/system/installations/jobs/services/jobs.datasource";
import { JobsService } from 'app/main/system/installations/jobs/services/jobs.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'delete-dialog',
    templateUrl: './deletedialog.component.html',
    styleUrls: ['./deletedialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DeleteDialogComponent {
    job: JobDetail;
    flag: any;
    dataSource: JobsDataSource;
    private flagForDeleting = new BehaviorSubject<boolean>(false);

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private jobsService: JobsService,
        private dialogRef: MatDialogRef<DeleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
    ) {
        this._fuseTranslationLoaderService.loadTranslations(jobsEnglish, jobsSpanish, jobsFrench, jobsPortuguese);
        this.job = _data.serviceDetail;
        this.flag = _data.flag;
    }

    deleteList(): boolean {
        let deletedJob = this.jobsService.jobList.findIndex((index: any) => index.id == this.job.id);
        if (deletedJob > -1) {
            this.jobsService.jobList.splice(deletedJob, 1);
            return true;
        }
    }

    delete() {
        this.jobsService.deleteJob(this.job.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200) || (result.responseCode == 100)) {
                    this.dialogRef.close(result);
                }
            });
    }

    close() {
        this.dialogRef.close();
    }
}
