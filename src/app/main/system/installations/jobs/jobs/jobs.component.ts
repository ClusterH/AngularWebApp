import { Component, ElementRef, OnInit, OnDestroy, ViewChild, ViewEncapsulation, Output, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

import { merge, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, map, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FuseUtils } from '@fuse/utils';

import { JobsService, JobsDataSource, InstallationService } from '../services'

import { JobDialogComponent } from "../dialog/dialog.component";
import { DeleteDialogComponent } from "../deletedialog/deletedialog.component";

import { locale as jobsEnglish } from 'app/main/system/installations/jobs/i18n/en';
import { locale as jobsSpanish } from 'app/main/system/installations/jobs/i18n/sp';
import { locale as jobsFrench } from 'app/main/system/installations/jobs/i18n/fr';
import { locale as jobsPortuguese } from 'app/main/system/installations/jobs/i18n/pt';
import { Route } from '@angular/compiler/src/core';
import { Board } from '../model/board.model';

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
    isListView: boolean = true;
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

    installers = [];
    installersBoard: any;

    toggleInArray = FuseUtils.toggleInArray;

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
        private boardService: InstallationService,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this.activatedroute.queryParams.subscribe(params => {
            if (params.fromBoard == "true") {
                this.isListView = false;
            }
        });

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
        this._adminJobsService.getDetailClist(0, 10000, '', 'installer_clist').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {

            this.installers = res.TrackingXLAPI.DATA;
        });

        this.boardService.onBoardsChanged
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(boards => {

                this.installersBoard = boards;
            });
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
            if (res) {
                let deleteJob = this._adminJobsService.jobList.findIndex((deletedJob: any) => deletedJob.id == job.id);
                if (deleteJob > -1) {
                    this._adminJobsService.jobList.splice(deleteJob, 1);
                    this.dataSource.jobsSubject.next(this._adminJobsService.jobList);
                    this.dataSource.totalLength = this.dataSource.totalLength - 1;
                }
            }
        });
    }

    handleSelection(event, job) {
        if (event.option.selected) {
            event.source.deselectAll();
            event.option._setSelected(true);

            this._adminJobsService.assignInstallerToJob(job.id, event.option.value).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {

                if (res.TrackingXLAPI.DATA[0].cnt == 1) {
                    const changedJobIndex = this._adminJobsService.jobList.findIndex((changedJob: any) => changedJob.id == job.id);
                    const assignedInstallerInx = this.installers.findIndex(installer => installer.id == event.option.value);
                    if (changedJobIndex > -1 && assignedInstallerInx > -1) {
                        this._adminJobsService.jobList[changedJobIndex].installer = this.installers[assignedInstallerInx].name;
                        this._adminJobsService.jobList[changedJobIndex].installerid = this.installers[assignedInstallerInx].id;
                        this.dataSource.jobsSubject.next(this._adminJobsService.jobList);
                        this.dataSource.totalLength = this.dataSource.totalLength - 1;
                    }
                }
            });
        } else {
            this._adminJobsService.assignInstallerToJob(job.id, 0).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                if (res.TrackingXLAPI.DATA[0].cnt == 1) {
                    const changedJobIndex = this._adminJobsService.jobList.findIndex((changedJob: any) => changedJob.id == job.id);
                    const assignedInstallerInx = this.installers.findIndex(installer => installer.id == job.installerid);
                    if (changedJobIndex > -1 && assignedInstallerInx > -1) {
                        this._adminJobsService.jobList[changedJobIndex].installer = '';
                        this._adminJobsService.jobList[changedJobIndex].installerid = 0;
                        this.dataSource.jobsSubject.next(this._adminJobsService.jobList);
                        this.dataSource.totalLength = this.dataSource.totalLength - 1;
                    }
                }
            });
        }
    }

    currentBoard(board, type) {

        if (type == 'list') {
            this.router.navigate(['system/jobs/jobs/' + Number(board.installerid) + '/' + board.installer], { queryParams: { from: 'list' } });
        } else if (type == 'board') {
            this.router.navigate(['system/jobs/jobs/' + Number(board.id) + '/' + board.name], { queryParams: { from: 'board' } });
        }
    }
}