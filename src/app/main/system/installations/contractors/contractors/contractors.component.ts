import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Output, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

import { merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { ContractorsService } from 'app/main/system/installations/contractors/services/contractors.service';
import { ContractorsDataSource } from "app/main/system/installations/contractors/services/contractors.datasource";

import { ContractorDialogComponent } from "../dialog/dialog.component";
import { DeleteDialogComponent } from "../deletedialog/deletedialog.component";

import { locale as contractorsEnglish } from 'app/main/system/installations/contractors/i18n/en';
import { locale as contractorsSpanish } from 'app/main/system/installations/contractors/i18n/sp';
import { locale as contractorsFrench } from 'app/main/system/installations/contractors/i18n/fr';
import { locale as contractorsPortuguese } from 'app/main/system/installations/contractors/i18n/pt';
import { Route } from '@angular/compiler/src/core';

@Component({
    selector: 'system-contractors',
    templateUrl: './contractors.component.html',
    styleUrls: ['./contractors.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ContractorsComponent implements OnInit {
    dataSource: ContractorsDataSource;

    @Output()
    pageContractor: PageEvent;

    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentContractor: any;

    contractor: any;
    userConncode: string;
    userID: number;
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

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;

    constructor(
        private _adminContractorsService: ContractorsService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).contractors;
        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(contractorsEnglish, contractorsSpanish, contractorsFrench, contractorsPortuguese);

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

        // when paginator contractor is invoked, retrieve the related data
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);



        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                tap(() => this.dataSource.loadContractors(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintcontractor_TList"))
            )
            .subscribe((res: any) => {

            });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnInit(): void {


        this.dataSource = new ContractorsDataSource(this._adminContractorsService);
        this.dataSource.loadContractors(this.userConncode, this.userID, this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "maintcontractor_TList");
    }

    onRowClicked(contractor) {

    }

    selectedFilter() {

        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadContractors(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintcontractor_TList");
        }
    }

    actionPageIndexbutton(pageIndex: number) {

        this.dataSource.loadContractors(this.userConncode, this.userID, pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintcontractor_TList");
    }

    filterContractor() {
        this.selectedFilter();
    }
    navigatePageContractor() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadContractors(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintcontractor_TList");
    }

    addNewContractor() {

        this.dialogRef = this._matDialog.open(ContractorDialogComponent, {
            panelClass: 'contractor-dialog',
            disableClose: true,
            data: {
                serviceDetail: null,
                flag: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(res => {

                this.dataSource.contractorsSubject.next(res);

            });
    }

    editShowContractorDetail(contractor: any) {


        this.dialogRef = this._matDialog.open(ContractorDialogComponent, {
            panelClass: 'contractor-dialog',
            disableClose: true,
            data: {
                serviceDetail: contractor,
                flag: 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(res => {

                this.dataSource.contractorsSubject.next(res);
            });
    }

    deleteContractor(contractor): void {


        this.dialogRef = this._matDialog.open(DeleteDialogComponent, {
            panelClass: 'delete-dialog',
            disableClose: true,
            data: {
                serviceDetail: contractor,
                flag: 'delete'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(res => {

                this.dataSource.contractorsSubject.next(res);

            });
    }

    // duplicateContractor(contractor): void
    // {
    //     const dialogConfig = new MatDialogConfig();
    //     this.flag = 'duplicate';

    //     dialogConfig.disableClose = true;

    //     dialogConfig.data = {
    //         contractor, flag: this.flag
    //     };

    //     const dialogRef = this._matDialog.open(ContractorDialogComponent, dialogConfig);

    //     dialogRef.afterClosed().subscribe(result => {
    //         if ( result )
    //         {
    //
    //         } else {
    //
    //         }
    //     });
    // }
}
