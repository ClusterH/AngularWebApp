import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Output, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { CompaniesService } from 'app/main/admin/companies/services/companies.service';
import { CompaniesDataSource } from "app/main/admin/companies/services/companies.datasource";
import { CompanyDetailService } from 'app/main/admin/companies/services/company_detail.service';

import {CourseDialogComponent} from "../dialog/dialog.component";
import { takeUntil } from 'rxjs/internal/operators';

import { locale as companiesEnglish } from 'app/main/admin/companies/i18n/en';
import { locale as companiesSpanish } from 'app/main/admin/companies/i18n/sp';
import { locale as companiesFrench } from 'app/main/admin/companies/i18n/fr';
import { locale as companiesPortuguese } from 'app/main/admin/companies/i18n/pt';
import { Route } from '@angular/compiler/src/core';

@Component({
    selector     : 'admin-companies',
    templateUrl  : './companies.component.html',
    styleUrls    : ['./companies.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class CompaniesComponent implements OnInit
{
    dataSource: CompaniesDataSource;

    @Output()
    pageEvent: PageEvent;
   
    pageIndex= 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;

    company: any;

    flag: string = '';
    displayedColumns = [
        'id',
        'name',
        // 'company',
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

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;
    
    constructor(
        private _adminCompaniesService: CompaniesService,
        private companyDetailService: CompanyDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private renderer : Renderer2,
        private elmRef: ElementRef
    )
    {
        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(companiesEnglish, companiesSpanish, companiesFrench, companiesPortuguese);

        this.pageIndex= 0;
        this.pageSize = 25;
        this.selected = '';
        this.filter_string = '';
        // this.index_number = 1;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngAfterViewInit() {
        console.log("ngAfterViewInit:");

        var node = $("div.page_index");
        $("div.page_index").remove();
        $("button.mat-paginator-navigation-previous.mat-icon-button.mat-button-base").after(node);
   
        // when paginator event is invoked, retrieve the related data
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        console.log(this.paginator.pageSize);

        merge(this.sort.sortChange, this.paginator.page)
        .pipe(
           tap(() => this.dataSource.loadCompanies("PolarixUSA", 2, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Company_TList"))
        )
        .subscribe( (res: any) => {
            console.log(res);
        });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }
   
    ngOnInit(): void
    {
        console.log(this.pageSize, this.pageIndex);

        this.dataSource = new CompaniesDataSource(this._adminCompaniesService);
        this.dataSource.loadCompanies("PolarixUSA", 2, this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "Company_TList");
    }

    onRowClicked(company) {
        console.log('Row Clicked:', company);
    }

    selectedFilter() {
        console.log(this.selected, this.filter_string);
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadCompanies("PolarixUSA", 2, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Company_TList");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        console.log(pageIndex);
        this.dataSource.loadCompanies("PolarixUSA", 2, pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Company_TList");
    }

    filterEvent() {
        this.selectedFilter();
    }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadCompanies("PolarixUSA", 2, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Company_TList");
    }

    addNewCompany() {
        this.companyDetailService.company_detail = '';
        sessionStorage.removeItem("company_detail");
        this.router.navigate(['admin/companies/company_detail']);
    }

    editShowCompanyDetail(company: any) {
        this.companyDetailService.company_detail = company;

        sessionStorage.setItem("company_detail", JSON.stringify(company));

        this.router.navigate(['admin/companies/company_detail']);
    }
    
    deleteCompany(company): void
    {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            company, flag: this.flag
        };

        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if ( result )
            { 
                console.log(result);
            } else {
                console.log("FAIL:", result);
            }
        });
    }

    duplicateCompany(company): void
    {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            company, flag: this.flag
        };

        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if ( result )
            { 
                console.log(result);
            } else {
                console.log("FAIL:", result);
            }
        });
    }
}