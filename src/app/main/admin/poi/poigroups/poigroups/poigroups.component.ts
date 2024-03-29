import { Component, ElementRef, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as poigroupsEnglish } from 'app/main/admin/poi/poigroups/i18n/en';
import { locale as poigroupsFrench } from 'app/main/admin/poi/poigroups/i18n/fr';
import { locale as poigroupsPortuguese } from 'app/main/admin/poi/poigroups/i18n/pt';
import { locale as poigroupsSpanish } from 'app/main/admin/poi/poigroups/i18n/sp';
import { PoigroupsDataSource } from "app/main/admin/poi/poigroups/services/poigroups.datasource";
import { PoigroupsService } from 'app/main/admin/poi/poigroups/services/poigroups.service';
import { PoigroupDetailService } from 'app/main/admin/poi/poigroups/services/poigroup_detail.service';
import * as $ from 'jquery';
import { merge, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'admin-poigroups',
    templateUrl: './poigroups.component.html',
    styleUrls: ['./poigroups.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class PoigroupsComponent implements OnInit {
    dataSource: PoigroupsDataSource;
    @Output()
    pageEvent: PageEvent;
    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;
    poigroup: any;
    restrictValue: any;
    flag: string = '';
    displayedColumns = [
        'id',
        'name',
        'company',
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
        private _adminPoigroupsService: PoigroupsService,
        private poigroupDetailService: PoigroupDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).pois;
        this._fuseTranslationLoaderService.loadTranslations(poigroupsEnglish, poigroupsSpanish, poigroupsFrench, poigroupsPortuguese);
        this.pageIndex = 0;
        this.pageSize = 25;
        this.selected = '';
        this.filter_string = '';
    }

    ngAfterViewInit() {
        var node = $("div.page_index");
        var node_length = node.length;
        $("div.page_index").remove();
        $("button.mat-paginator-navigation-previous.mat-icon-button.mat-button-base").after(node[node_length - 1]);
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(tap(() => this.dataSource.loadPoigroups(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Poigroup_Tlist")), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnInit(): void {
        this.dataSource = new PoigroupsDataSource(this._adminPoigroupsService);
        this.dataSource.loadPoigroups(this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "Poigroup_Tlist");
    }

    selectedFilter() {
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadPoigroups(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Poigroup_Tlist");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadPoigroups(pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Poigroup_Tlist");
    }

    filterEvent() { this.selectedFilter(); }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadPoigroups(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Poigroup_Tlist");
    }

    addNewPoigroup() {
        this.router.navigate(['admin/poi/poigroups/poigroup_detail']);
    }

    editShowPoigroupDetail(poigroup: any) {
        this.router.navigate(['admin/poi/poigroups/poigroup_detail'], { queryParams: poigroup });
    }

    deletePoigroup(poigroup): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';
        dialogConfig.disableClose = true;
        dialogConfig.data = { poigroup, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                let deletePoigroup = this._adminPoigroupsService.poigroupList.findIndex((deletedpoigroup: any) => deletedpoigroup.id == poigroup.id);
                if (deletePoigroup > -1) {
                    this._adminPoigroupsService.poigroupList.splice(deletePoigroup, 1);
                    this.dataSource.poigroupsSubject.next(this._adminPoigroupsService.poigroupList);
                    this.dataSource.totalLength = this.dataSource.totalLength - 1;
                }
            }
        });
    }

    duplicatePoigroup(poigroup: any): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';
        dialogConfig.disableClose = true;
        dialogConfig.data = { poigroup, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                this.router.navigate(['admin/poi/poigroups/poigroup_detail'], { queryParams: poigroup });
            }
        });
    }
}