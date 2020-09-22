import { Component, ElementRef, OnInit, OnDestroy, ViewChild, ViewEncapsulation, Output, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

import { merge, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, map, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { JobsService } from 'app/main/system/installations/jobs/services/jobs.service';
import { JobsDataSource } from "app/main/system/installations/jobs/services/jobs.datasource";

import { JobDialogComponent } from "../dialog/dialog.component";
import { DeleteDialogComponent } from "../deletedialog/deletedialog.component";

import { locale as jobsEnglish } from 'app/main/system/installations/jobs/i18n/en';
import { locale as jobsSpanish } from 'app/main/system/installations/jobs/i18n/sp';
import { locale as jobsFrench } from 'app/main/system/installations/jobs/i18n/fr';
import { locale as jobsPortuguese } from 'app/main/system/installations/jobs/i18n/pt';
import { Route } from '@angular/compiler/src/core';

@Component({
    selector: 'system-jobs',
    templateUrl: './jobs.component.html',
    styleUrls: ['./jobs.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class JobsComponent implements OnInit, OnDestroy {
    dataSource: JobsDataSource;

    @Output()
    pageJob: PageEvent;

    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentJob: any;
    job: any;
    restrictValue: any;
    flag: string = '';
    displayedColumns = [
        'id',
        'imei',
        'scheduledate',
        'address',
        'plate',
        'customer',
        'customerphonenumber',
        'status',
        'installer',
        'created',
        'createdby',
    ];

    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;
    @ViewChild(MatSort, { static: true })
    sort: MatSort;
    @ViewChild('filter', { static: true })
    filter: ElementRef;

    constructor(
        private _adminJobsService: JobsService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).jobs;
        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(jobsEnglish, jobsSpanish, jobsFrench, jobsPortuguese);

        this.pageIndex = 0;
        this.pageSize = 25;
        this.selected = '';
        this.filter_string = '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngAfterViewInit() {
        var node = $("div.page_index");
        var node_length = node.length;
        $("div.page_index").remove();
        $("button.mat-paginator-navigation-previous.mat-icon-button.mat-button-base").after(node[node_length - 1]);
        // when paginator job is invoked, retrieve the related data
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(tap(() => this.dataSource.loadJobs(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintjob_TList")), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnInit(): void {
        this.dataSource = new JobsDataSource(this._adminJobsService);
        this.dataSource.loadJobs(this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "installation_TList");
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onRowClicked(job) { }
    selectedFilter() {
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadJobs(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "installation_TList");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadJobs(pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "installation_TList");
    }

    filterJob() { this.selectedFilter(); }
    navigatePageJob() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadJobs(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "installation_TList");
    }

    addNewJob() {
        this.dialogRef = this._matDialog.open(JobDialogComponent, {
            panelClass: 'job-dialog',
            disableClose: true,
            data: {
                serviceDetail: null,
                flag: 'new'
            }
        });

        this.dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.dataSource.jobsSubject.next(res);
        });
    }

    editShowJobDetail(job: any) {
        this.dialogRef = this._matDialog.open(JobDialogComponent, {
            panelClass: 'job-dialog',
            disableClose: true,
            data: {
                serviceDetail: job,
                flag: 'edit'
            }
        });

        this.dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.dataSource.jobsSubject.next(res);
        });
    }

    deleteJob(job): void {
        this.dialogRef = this._matDialog.open(DeleteDialogComponent, {
            panelClass: 'delete-dialog',
            disableClose: true,
            data: {
                serviceDetail: job,
                flag: 'delete'
            }
        });

        this.dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.dataSource.jobsSubject.next(res);
        });
    }

    // duplicateJob(job): void
    // {
    //     const dialogConfig = new MatDialogConfig();
    //     this.flag = 'duplicate';

    //     dialogConfig.disableClose = true;

    //     dialogConfig.data = {
    //         job, flag: this.flag
    //     };

    //     const dialogRef = this._matDialog.open(JobDialogComponent, dialogConfig);

    //     dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
    //         if ( result )
    //         {
    //
    //         } else {
    //
    //         }
    //     });
    // }
}
