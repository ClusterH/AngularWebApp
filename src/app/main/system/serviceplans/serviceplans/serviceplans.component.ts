import { Component, ElementRef, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as serviceplansEnglish } from 'app/main/system/serviceplans/i18n/en';
import { locale as serviceplansFrench } from 'app/main/system/serviceplans/i18n/fr';
import { locale as serviceplansPortuguese } from 'app/main/system/serviceplans/i18n/pt';
import { locale as serviceplansSpanish } from 'app/main/system/serviceplans/i18n/sp';
import { ServiceplansDataSource } from "app/main/system/serviceplans/services/serviceplans.datasource";
import { ServiceplansService } from 'app/main/system/serviceplans/services/serviceplans.service';
import { ServiceplanDetailService } from 'app/main/system/serviceplans/services/serviceplan_detail.service';
import * as $ from 'jquery';
import { merge, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'system-serviceplans',
    templateUrl: './serviceplans.component.html',
    styleUrls: ['./serviceplans.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ServiceplansComponent implements OnInit, OnDestroy {
    dataSource: ServiceplansDataSource;
    @Output()
    pageEvent: PageEvent;
    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;
    serviceplan: any;
    restrictValue: any;
    flag: string = '';
    displayedColumns = [
        'id',
        'name',
        'carrierplan',
        'eventtypes',
        'daysinhistory',
        'includeignition',
        'locatecommand',
        'distance',
        'created',
        'createdbyname',
        'deletedwhen',
        'deletedbyname',
        'lastmodifieddate',
        'lastmodifiedbyname'
    ];

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;

    constructor(
        private _systemServiceplansService: ServiceplansService,
        private serviceplanDetailService: ServiceplanDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).serviceplans;
        this._fuseTranslationLoaderService.loadTranslations(serviceplansEnglish, serviceplansSpanish, serviceplansFrench, serviceplansPortuguese);
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
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(tap(() => this.dataSource.loadServiceplans(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Serviceplan_Tlist")), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnInit(): void {
        this.dataSource = new ServiceplansDataSource(this._systemServiceplansService);
        this.dataSource.loadServiceplans(this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "Serviceplan_Tlist");
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    selectedFilter() {
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadServiceplans(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Serviceplan_Tlist");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadServiceplans(pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Serviceplan_Tlist");
    }

    filterEvent() { this.selectedFilter(); }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadServiceplans(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Serviceplan_Tlist");
    }

    addNewServiceplan() {
        this.router.navigate(['system/serviceplans/serviceplan_detail']);
    }

    editShowServiceplanDetail(serviceplan: any) {
        this.router.navigate(['system/serviceplans/serviceplan_detail'], { queryParams: serviceplan });
    }

    deleteServiceplan(serviceplan): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';
        dialogConfig.disableClose = true;
        dialogConfig.data = { serviceplan, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                let deleteServiceplan = this._systemServiceplansService.serviceplanList.findIndex((deletedserviceplan: any) => deletedserviceplan.id == serviceplan.id);
                if (deleteServiceplan > -1) {
                    this._systemServiceplansService.serviceplanList.splice(deleteServiceplan, 1);
                    this.dataSource.serviceplansSubject.next(this._systemServiceplansService.serviceplanList);
                    this.dataSource.totalLength = this.dataSource.totalLength - 1;
                }
            }
        });
    }

    duplicateServiceplan(serviceplan): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';
        dialogConfig.disableClose = true;
        dialogConfig.data = { serviceplan, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                this.router.navigate(['system/serviceplans/serviceplan_detail'], { queryParams: serviceplan });
            }
        });
    }
}