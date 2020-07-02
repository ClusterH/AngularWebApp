import { Component, ElementRef, OnInit, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as companiesEnglish } from 'app/main/admin/dealercompanies/i18n/en';
import { locale as companiesFrench } from 'app/main/admin/dealercompanies/i18n/fr';
import { locale as companiesPortuguese } from 'app/main/admin/dealercompanies/i18n/pt';
import { locale as companiesSpanish } from 'app/main/admin/dealercompanies/i18n/sp';
import { DealerCompaniesDataSource } from "app/main/admin/dealercompanies/services/dealercompanies.datasource";
import { DealerCompaniesService } from 'app/main/admin/dealercompanies/services/dealercompanies.service';
import { DealerCompanyDetailService } from 'app/main/admin/dealercompanies/services/dealercompany_detail.service';
import * as $ from 'jquery';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'admin-dealercompanies',
    templateUrl: './dealercompanies.component.html',
    styleUrls: ['./dealercompanies.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class DealerCompaniesComponent implements OnInit {
    dataSource: DealerCompaniesDataSource;

    @Output()
    pageEvent: PageEvent;

    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;

    dealercompany: any;
    userConncode: string;
    userID: number;
    restrictValue: any;

    flag: string = '';
    displayedColumns = [
        'id',
        'name',
        // 'dealercompany',
        // 'group',
        // 'subgroup',
        // 'account',
        // 'operator',
        // 'unittype',
        // 'serviceplan',
        // 'producttype',
        // 'make',
        // 'model',
        // 'isactive',
        // 'timezone',
        'created',
        'createdbyname',
        'deletedwhen',
        'deletedbyname',
        'lastmodifieddate',
        'lastmodifiedbyname'
    ];

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;

    constructor(
        private _adminDealerCompaniesService: DealerCompaniesService,
        private dealercompanyDetailService: DealerCompanyDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private renderer: Renderer2,
        private elmRef: ElementRef
    ) {
        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(companiesEnglish, companiesSpanish, companiesFrench, companiesPortuguese);

        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).dealercompanies;

        this.pageIndex = 0;
        this.pageSize = 25;
        this.selected = '';
        this.filter_string = '';
        // this.index_number = 1;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngAfterViewInit() {
        var node = $("div.page_index");
        $("div.page_index").remove();
        $("button.mat-paginator-navigation-previous.mat-icon-button.mat-button-base").after(node);

        // when paginator event is invoked, retrieve the related data
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                tap(() => this.dataSource.loadDealerCompanies(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Company_TList"))
            )
            .subscribe((res: any) => {

            });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnInit(): void {


        this.dataSource = new DealerCompaniesDataSource(this._adminDealerCompaniesService);
        this.dataSource.loadDealerCompanies(this.userConncode, this.userID, this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "Company_TList");
    }

    selectedFilter() {

        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadDealerCompanies(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Company_TList");
        }
    }

    actionPageIndexbutton(pageIndex: number) {

        this.dataSource.loadDealerCompanies(this.userConncode, this.userID, pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Company_TList");
    }

    filterEvent() {
        this.selectedFilter();
    }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadDealerCompanies(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Company_TList");
    }

    addNewDealerCompany() {
        this.dealercompanyDetailService.dealercompany_detail = '';
        localStorage.removeItem("dealercompany_detail");
        this.router.navigate(['admin/dealercompanies/dealercompany_detail']);
    }

    editShowDealerCompanyDetail(dealercompany: any) {
        this.dealercompanyDetailService.dealercompany_detail = dealercompany;

        localStorage.setItem("dealercompany_detail", JSON.stringify(dealercompany));

        this.router.navigate(['admin/dealercompanies/dealercompany_detail']);
    }

    deleteDealerCompany(dealercompany): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';

        dialogConfig.disableClose = true;

        dialogConfig.data = {
            dealercompany, flag: this.flag
        };

        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {

            } else {

            }
        });
    }

    duplicateDealerCompany(dealercompany): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';

        dialogConfig.disableClose = true;

        dialogConfig.data = {
            dealercompany, flag: this.flag
        };

        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {

            } else {

            }
        });
    }
}
