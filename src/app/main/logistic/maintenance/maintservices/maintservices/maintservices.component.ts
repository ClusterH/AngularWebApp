import { Component, ElementRef, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as maintservicesEnglish } from 'app/main/logistic/maintenance/maintservices/i18n/en';
import { locale as maintservicesFrench } from 'app/main/logistic/maintenance/maintservices/i18n/fr';
import { locale as maintservicesPortuguese } from 'app/main/logistic/maintenance/maintservices/i18n/pt';
import { locale as maintservicesSpanish } from 'app/main/logistic/maintenance/maintservices/i18n/sp';
import { MaintservicesDataSource } from "app/main/logistic/maintenance/maintservices/services/maintservices.datasource";
import { MaintservicesService } from 'app/main/logistic/maintenance/maintservices/services/maintservices.service';
import * as $ from 'jquery';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { DeleteDialogComponent } from "../deletedialog/deletedialog.component";
import { MaintserviceDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'logistic-maintservices',
    templateUrl: './maintservices.component.html',
    styleUrls: ['./maintservices.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class MaintservicesComponent implements OnInit, OnDestroy {
    dataSource: MaintservicesDataSource;
    @Output()
    pageMaintservice: PageEvent;
    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentMaintservice: any;
    maintservice: any;
    restrictValue: any;
    flag: string = '';
    displayedColumns = [
        'id',
        'name',
        'company',
        'group'
    ];
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;

    constructor(
        private _adminMaintservicesService: MaintservicesService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).maintservices;
        this._fuseTranslationLoaderService.loadTranslations(maintservicesEnglish, maintservicesSpanish, maintservicesFrench, maintservicesPortuguese);
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
            .pipe(tap(() => this.dataSource.loadMaintservices(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintservice_TList")), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnInit(): void {
        this.dataSource = new MaintservicesDataSource(this._adminMaintservicesService);
        this.dataSource.loadMaintservices(this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "maintservice_TList");
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
            this.dataSource.loadMaintservices(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintservice_TList");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadMaintservices(pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintservice_TList");
    }

    filterMaintservice() { this.selectedFilter(); }
    navigatePageMaintservice() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadMaintservices(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintservice_TList");
    }

    addNewMaintservice() {
        this.dialogRef = this._matDialog.open(MaintserviceDialogComponent, {
            panelClass: 'maintservice-dialog',
            disableClose: true,
            data: { serviceDetail: null, flag: 'new' }
        });

        this.dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.dataSource.maintservicesSubject.next(res);
        });
    }

    editShowMaintserviceDetail(maintservice: any) {
        this.dialogRef = this._matDialog.open(MaintserviceDialogComponent, {
            panelClass: 'maintservice-dialog',
            disableClose: true,
            data: { serviceDetail: maintservice, flag: 'edit' }
        });

        this.dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.dataSource.maintservicesSubject.next(res);
        });
    }

    deleteMaintservice(maintservice): void {
        this.dialogRef = this._matDialog.open(DeleteDialogComponent, {
            panelClass: 'delete-dialog',
            disableClose: true,
            data: { serviceDetail: maintservice, flag: 'delete' }
        });

        this.dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.dataSource.maintservicesSubject.next(res);
        });
    }
}