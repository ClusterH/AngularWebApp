import { Component, ElementRef, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as serviceitemsEnglish } from 'app/main/logistic/maintenance/serviceitems/i18n/en';
import { locale as serviceitemsFrench } from 'app/main/logistic/maintenance/serviceitems/i18n/fr';
import { locale as serviceitemsPortuguese } from 'app/main/logistic/maintenance/serviceitems/i18n/pt';
import { locale as serviceitemsSpanish } from 'app/main/logistic/maintenance/serviceitems/i18n/sp';
import { ServiceitemsDataSource } from "app/main/logistic/maintenance/serviceitems/services/serviceitems.datasource";
import { ServiceitemsService } from 'app/main/logistic/maintenance/serviceitems/services/serviceitems.service';
import * as $ from 'jquery';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { DeleteDialogComponent } from "../deletedialog/deletedialog.component";
import { ServiceItemDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'logistic-serviceitems',
    templateUrl: './serviceitems.component.html',
    styleUrls: ['./serviceitems.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ServiceitemsComponent implements OnInit {
    dataSource: ServiceitemsDataSource;
    @Output() pageServiceitem: PageEvent;
    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentServiceitem: any;
    serviceitem: any;
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
        private _adminServiceitemsService: ServiceitemsService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).serviceitems;
        this._fuseTranslationLoaderService.loadTranslations(serviceitemsEnglish, serviceitemsSpanish, serviceitemsFrench, serviceitemsPortuguese);
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
            .pipe(tap(() => this.dataSource.loadServiceitems(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintserviceitem_TList")), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnInit(): void {
        this.dataSource = new ServiceitemsDataSource(this._adminServiceitemsService);
        this.dataSource.loadServiceitems(this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "maintserviceitem_TList");
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
            this.dataSource.loadServiceitems(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintserviceitem_TList");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadServiceitems(pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintserviceitem_TList");
    }

    filterServiceitem() { this.selectedFilter(); }
    navigatePageServiceitem() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadServiceitems(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintserviceitem_TList");
    }

    addNewServiceitem() {
        this.dialogRef = this._matDialog.open(ServiceItemDialogComponent, {
            panelClass: 'serviceitem-dialog',
            disableClose: true,
            data: { serviceDetail: null, flag: 'new' }
        });

        this.dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.dataSource.serviceitemsSubject.next(res);
        });
    }

    editShowServiceitemDetail(serviceitem: any) {
        this.dialogRef = this._matDialog.open(ServiceItemDialogComponent, {
            panelClass: 'serviceitem-dialog',
            disableClose: true,
            data: { serviceDetail: serviceitem, flag: 'edit' }
        });

        this.dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.dataSource.serviceitemsSubject.next(res);
        });
    }

    deleteServiceitem(serviceitem): void {
        this.dialogRef = this._matDialog.open(DeleteDialogComponent, {
            panelClass: 'delete-dialog',
            disableClose: true,
            data: { serviceDetail: serviceitem, flag: 'delete' }
        });

        this.dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.dataSource.serviceitemsSubject.next(res);
        });
    }
}