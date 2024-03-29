import { Component, ElementRef, OnInit, OnDestroy, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as privilegesEnglish } from 'app/main/system/privileges/i18n/en';
import { locale as privilegesFrench } from 'app/main/system/privileges/i18n/fr';
import { locale as privilegesPortuguese } from 'app/main/system/privileges/i18n/pt';
import { locale as privilegesSpanish } from 'app/main/system/privileges/i18n/sp';
import { PrivilegesDataSource } from "app/main/system/privileges/services/privileges.datasource";
import { PrivilegesService } from 'app/main/system/privileges/services/privileges.service';
import { PrivilegeDetailService } from 'app/main/system/privileges/services/privilege_detail.service';
import * as $ from 'jquery';
import { merge, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'system-privileges',
    templateUrl: './privileges.component.html',
    styleUrls: ['./privileges.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class PrivilegesComponent implements OnInit, OnDestroy {
    dataSource: PrivilegesDataSource;
    @Output()
    pageEvent: PageEvent;
    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;
    privilege: any;
    restrictValue: any;
    flag: string = '';
    displayedColumns = [
        'id',
        'name',
        'type',
        'object',
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
        private _systemPrivilegesService: PrivilegesService,
        private privilegeDetailService: PrivilegeDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).privileges;
        this._fuseTranslationLoaderService.loadTranslations(privilegesEnglish, privilegesSpanish, privilegesFrench, privilegesPortuguese);
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
            .pipe(tap(() => this.dataSource.loadPrivileges(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Privilege_Tlist")), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnInit(): void {
        this.dataSource = new PrivilegesDataSource(this._systemPrivilegesService);
        this.dataSource.loadPrivileges(this.pageIndex, this.pageSize, "name", "asc", this.selected, this.filter_string, "Privilege_Tlist");
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
            this.dataSource.loadPrivileges(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Privilege_Tlist");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadPrivileges(pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Privilege_Tlist");
    }

    filterEvent() { this.selectedFilter(); }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadPrivileges(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Privilege_Tlist");
    }

    addNewPrivilege() {
        this.router.navigate(['system/privileges/privilege_detail']);
    }

    editShowPrivilegeDetail(privilege: any) {
        this.router.navigate(['system/privileges/privilege_detail'], { queryParams: privilege });
    }

    deletePrivilege(privilege: any): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';
        dialogConfig.disableClose = true;
        dialogConfig.data = { privilege, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                let deletePrivilege = this._systemPrivilegesService.privilegeList.findIndex((deletedprivilege: any) => deletedprivilege.id == privilege.id);
                if (deletePrivilege > -1) {
                    this._systemPrivilegesService.privilegeList.splice(deletePrivilege, 1);
                    this.dataSource.privilegesSubject.next(this._systemPrivilegesService.privilegeList);
                    this.dataSource.totalLength = this.dataSource.totalLength - 1;
                }
            }
        });
    }

    duplicatePrivilege(privilege: any): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';
        dialogConfig.disableClose = true;
        dialogConfig.data = { privilege, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                this.router.navigate(['system/privileges/privilege_detail'], { queryParams: privilege });
            }
        });
    }
}