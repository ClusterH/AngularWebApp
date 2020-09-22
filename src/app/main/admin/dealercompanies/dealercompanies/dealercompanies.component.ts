import { Component, ElementRef, OnInit, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as dealercompaniesEnglish } from 'app/main/admin/dealercompanies/i18n/en';
import { locale as dealercompaniesFrench } from 'app/main/admin/dealercompanies/i18n/fr';
import { locale as dealercompaniesPortuguese } from 'app/main/admin/dealercompanies/i18n/pt';
import { locale as dealercompaniesSpanish } from 'app/main/admin/dealercompanies/i18n/sp';
import { DealercompaniesDataSource } from "app/main/admin/dealercompanies/services/dealercompanies.datasource";
import { DealercompaniesService } from 'app/main/admin/dealercompanies/services/dealercompanies.service';
import { DealercompanyDetailService } from 'app/main/admin/dealercompanies/services/dealercompany_detail.service';
import * as $ from 'jquery';
import { merge, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'admin-dealercompanies',
    templateUrl: './dealercompanies.component.html',
    styleUrls: ['./dealercompanies.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class DealercompaniesComponent implements OnInit {
    dataSource: DealercompaniesDataSource;
    @Output() pageEvent: PageEvent;

    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    dealercompany: any;
    restrictValue: any;
    flag: string = '';
    displayedColumns = [
        'id',
        'name',
        'created',
        'createdbyname',
        'deletedwhen',
        'deletedbyname',
        'lastmodifieddate',
        'lastmodifiedbyname'
    ];

    private _unsubscribeAll: Subject<any>;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;
    @ViewChild(MatSort, { static: true })
    sort: MatSort;
    @ViewChild('filter', { static: true })
    filter: ElementRef;

    constructor(
        private _adminDealercompaniesService: DealercompaniesService,
        private dealercompanyDetailService: DealercompanyDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(dealercompaniesEnglish, dealercompaniesSpanish, dealercompaniesFrench, dealercompaniesPortuguese);
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).dealercompanies;
        this.pageIndex = 0;
        this.pageSize = 25;
        this.selected = '';
        this.filter_string = '';
    }

    ngAfterViewInit() {
        var node = $("div.page_index");
        $("div.page_index").remove();
        $("button.mat-paginator-navigation-previous.mat-icon-button.mat-button-base").after(node);
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(tap(() => this.dataSource.loadDealercompanies(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Company_TList")), takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => { });
        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnInit(): void {
        this.dataSource = new DealercompaniesDataSource(this._adminDealercompaniesService);
        this.dataSource.loadDealercompanies(this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "Company_TList");
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
            this.dataSource.loadDealercompanies(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Company_TList");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadDealercompanies(pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Company_TList");
    }

    filterEvent() { this.selectedFilter(); }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadDealercompanies(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Company_TList");
    }

    addNewDealercompany() {
        this.router.navigate(['admin/dealercompanies/dealercompany_detail']);
    }

    editShowDealercompanyDetail(dealercompany: any) {
        this.router.navigate(['admin/dealercompanies/dealercompany_detail'], { queryParams: dealercompany });
    }

    deleteDealercompany(dealercompany): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';
        dialogConfig.disableClose = true;
        dialogConfig.data = {
            dealercompany, flag: this.flag
        };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                let deleteDealercompany = this._adminDealercompaniesService.dealercompanyList.findIndex((deleteddealercompany: any) => deleteddealercompany.id == dealercompany.id);
                if (deleteDealercompany > -1) {
                    this._adminDealercompaniesService.dealercompanyList.splice(deleteDealercompany, 1);
                    this.dataSource.dealercompaniesSubject.next(this._adminDealercompaniesService.dealercompanyList);
                    this.dataSource.totalLength = this.dataSource.totalLength - 1;
                }
            }
        });
    }

    duplicateDealercompany(dealercompany): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';
        dialogConfig.disableClose = true;
        dialogConfig.data = { dealercompany, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                this.router.navigate(['admin/dealercompanies/dealercompany_detail'], { queryParams: dealercompany });
            }
        });
    }
}