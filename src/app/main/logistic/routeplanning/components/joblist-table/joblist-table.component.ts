import { Component, OnInit, ViewChild, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as routeplanningEnglish } from 'app/main/logistic/routeplanning/i18n/en';
import { locale as routeplanningFrench } from 'app/main/logistic/routeplanning/i18n/fr';
import { locale as routeplanningPortuguese } from 'app/main/logistic/routeplanning/i18n/pt';
import { locale as routeplanningSpanish } from 'app/main/logistic/routeplanning/i18n/sp';
import { isEmpty } from 'lodash';
import { PrimeNGConfig } from 'primeng/api';
import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import { JobListDialogComponent } from '../../dialog/joblist-dialog/dialog.component';
import { JobList } from '../../model';
import { RoutePlanningJobService } from '../../services';

@Component({
    selector: 'routeplanning-joblist-table',
    templateUrl: './joblist-table.component.html',
    styleUrls: ['./joblist-table.component.scss']
})
export class JoblistTableComponent implements OnInit {
    dataSource$: Observable<JobList[]>;
    jobList: JobList[];
    selectedJobList: JobList[];
    totalRecords: number;
    loading: boolean = false;
    displayedColumns = ['stopname', 'schedtime', 'poi', 'jobstatus', 'earlytolerancemin', 'latetolerancemin', 'planninguser'];
    faIncludedIcon = faSignOutAlt;
    faExcludedIcon = faSignInAlt;

    private _unsubscribeAll: Subject<any>;

    @Input() selectedDate: Date;
    @Output() totalJobsEmitter = new EventEmitter();
    @ViewChild('dt') table: Table;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        public _matDialog: MatDialog,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        public routePlanningJobService: RoutePlanningJobService,
        private router: Router,
        private primengConfig: PrimeNGConfig,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(routeplanningEnglish, routeplanningSpanish, routeplanningFrench, routeplanningPortuguese);
    }

    ngOnInit(): void {
        this.getJobList(this.selectedDate);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getJobList(seldate: Date): void {
        this.routePlanningJobService.loadingsubject.next(false);
        this.routePlanningJobService.getRoutePlanningJob(1, 100000, 'id', 'asc', this.paramDateFormat(seldate), 'routeplanningjobs_TList').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {

            this.routePlanningJobService.loadingsubject.next(true);
            if (res.responseCode == 100) {
                this.jobList = [...res.TrackingXLAPI.DATA];
                this.selectedJobList = this.jobList.filter(item => item.include === true);
                this.dataSource$ = of(res.TrackingXLAPI.DATA);
                this.totalRecords = res.TrackingXLAPI.DATA.length;
                this.primengConfig.ripple = true;
                this.totalJobsEmitter.emit(this.totalRecords);
            } else {
                this.jobList = [];
                this.selectedJobList = this.jobList.filter(item => item.include === true);
                this.dataSource$ = of([]);
                this.totalRecords = 0;
                this.primengConfig.ripple = true;
                this.totalJobsEmitter.emit(this.totalRecords);
            }
        });
    }

    setJobInclude(job): void {

        let changedJob = { ...job };
        changedJob.include = !changedJob.include;
        this.jobList[this.findIndexById(changedJob.id)] = changedJob;
        this.routePlanningJobService.setJobInclude(job.id, job.include ? 0 : 1, this.paramDateFormat(this.selectedDate)).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.jobList = [...this.jobList];
            this.dataSource$ = of(this.jobList);
        });
        this.jobList = [...this.jobList];
        this.dataSource$ = of(this.jobList);
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.jobList.length; i++) {
            if (this.jobList[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }
    // isCheckRoute(job) {
    //
    //     if (job.include) {
    //         this.selectedJobList.push(job);
    //     } else {
    //         this.selectedJobList.filter(item => item.id !== job.id);
    //     }

    //     this.includeExcludeJobs(job.id, job.include ? 1 : 0);
    // }

    // includeExcludeJobs(id: number, include: number): void {
    //
    //     this.routePlanningJobService.setJobInclude(id, include).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
    //
    //     });
    // }

    editJob(driver): void {

        this.router.navigate(['logistic/routeplanning/jobdetail'], { queryParams: driver });
    }

    deleteJob(job: any): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.data = { job, flag: 'delete' };
        const dialogRef = this._matDialog.open(JobListDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {

                let deleteJob = this.jobList.findIndex((deletedjob: JobList) => deletedjob.id == job.id);
                if (deleteJob > -1) {
                    this.jobList.splice(deleteJob, 1);
                    this.totalRecords = this.jobList.length;
                    this.totalJobsEmitter.emit(this.totalRecords);
                    this.dataSource$ = of(this.jobList);
                }
            }
        });
    }

    duplicateJob(job: any): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.data = { job, flag: 'duplicate' };
        const dialogRef = this._matDialog.open(JobListDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(job => {
            if (job) {
                this.router.navigate(['logistic/routeplanning/jobdetail'], { queryParams: job });
            }
        });
    }

    paramDateFormat(date: any) {
        let str = '';
        if (date != '') {
            str = date.getFullYear()
                + "/" + ("00" + (date.getMonth() + 1)).slice(-2)
                + "/" + ("00" + date.getDate()).slice(-2)
        }


        return str;
    }

}
