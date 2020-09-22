import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Output, Renderer2 } from '@angular/core';
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

import { InstallersService } from 'app/main/system/installations/installers/services/installers.service';
import { InstallersDataSource } from "app/main/system/installations/installers/services/installers.datasource";

import { InstallerDialogComponent } from "../dialog/dialog.component";
import { DeleteDialogComponent } from "../deletedialog/deletedialog.component";

import { locale as installersEnglish } from 'app/main/system/installations/installers/i18n/en';
import { locale as installersSpanish } from 'app/main/system/installations/installers/i18n/sp';
import { locale as installersFrench } from 'app/main/system/installations/installers/i18n/fr';
import { locale as installersPortuguese } from 'app/main/system/installations/installers/i18n/pt';
import { Route } from '@angular/compiler/src/core';

@Component({
    selector: 'system-installers',
    templateUrl: './installers.component.html',
    styleUrls: ['./installers.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class InstallersComponent implements OnInit {
    dataSource: InstallersDataSource;

    @Output()
    pageInstaller: PageEvent;

    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentInstaller: any;

    installer: any;

    restrictValue: any;

    flag: string = '';
    displayedColumns = [
        'id',
        'name',
        'username',
        'installcontractor',
        'cellphone'
    ];

    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;

    constructor(
        private _adminInstallersService: InstallersService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).installers;
        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(installersEnglish, installersSpanish, installersFrench, installersPortuguese);
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
            .pipe(tap(() => this.dataSource.loadInstallers(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "installer_TList")), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnInit(): void {
        this.dataSource = new InstallersDataSource(this._adminInstallersService);
        this.dataSource.loadInstallers(this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "installer_TList");
    }

    onRowClicked(installer) { }

    selectedFilter() {
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadInstallers(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "installer_TList");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadInstallers(pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "installer_TList");
    }

    filterInstaller() {
        this.selectedFilter();
    }
    navigatePageInstaller() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadInstallers(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "installer_TList");
    }

    addNewInstaller() {
        this.dialogRef = this._matDialog.open(InstallerDialogComponent, {
            panelClass: 'installer-dialog',
            disableClose: true,
            data: {
                serviceDetail: null,
                flag: 'new'
            }
        });

        this.dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.dataSource.installersSubject.next(res);
        });
    }

    editShowInstallerDetail(installer: any) {
        console.log('installers===>>>', installer);
        this.dialogRef = this._matDialog.open(InstallerDialogComponent, {
            panelClass: 'installer-dialog',
            disableClose: true,
            data: {
                installerDetail: installer,
                flag: 'edit'
            }
        });

        this.dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.dataSource.installersSubject.next(res);
        });
    }

    deleteInstaller(installer): void {
        this.dialogRef = this._matDialog.open(DeleteDialogComponent, {
            panelClass: 'delete-dialog',
            disableClose: true,
            data: {
                serviceDetail: installer,
                flag: 'delete'
            }
        });

        this.dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.dataSource.installersSubject.next(res);
        });
    }

    // duplicateInstaller(installer): void
    // {
    //     const dialogConfig = new MatDialogConfig();
    //     this.flag = 'duplicate';

    //     dialogConfig.disableClose = true;

    //     dialogConfig.data = {
    //         installer, flag: this.flag
    //     };

    //     const dialogRef = this._matDialog.open(InstallerDialogComponent, dialogConfig);

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
