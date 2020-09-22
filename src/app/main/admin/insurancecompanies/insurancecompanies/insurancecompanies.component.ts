import { Component, ElementRef, OnInit, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as insurancecompaniesEnglish } from 'app/main/admin/insurancecompanies/i18n/en';
import { locale as insurancecompaniesFrench } from 'app/main/admin/insurancecompanies/i18n/fr';
import { locale as insurancecompaniesPortuguese } from 'app/main/admin/insurancecompanies/i18n/pt';
import { locale as insurancecompaniesSpanish } from 'app/main/admin/insurancecompanies/i18n/sp';
import { InsurancecompaniesDataSource } from "app/main/admin/insurancecompanies/services/insurancecompanies.datasource";
import { InsurancecompaniesService } from 'app/main/admin/insurancecompanies/services/insurancecompanies.service';
import { InsurancecompanyDetailService } from 'app/main/admin/insurancecompanies/services/insurancecompany_detail.service';
import * as $ from 'jquery';
import { merge, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'admin-insurancecompanies',
    templateUrl: './insurancecompanies.component.html',
    styleUrls: ['./insurancecompanies.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class InsurancecompaniesComponent implements OnInit {
    dataSource: InsurancecompaniesDataSource;
    @Output() pageEvent: PageEvent;

    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    insurancecompany: any;
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

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;

    constructor(
        private _adminInsurancecompaniesService: InsurancecompaniesService,
        private insurancecompanyDetailService: InsurancecompanyDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(insurancecompaniesEnglish, insurancecompaniesSpanish, insurancecompaniesFrench, insurancecompaniesPortuguese);
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).insurancecompanies;
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
            .pipe(tap(() => this.dataSource.loadInsurancecompanies(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Company_TList")), takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => { });
        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnInit(): void {
        this.dataSource = new InsurancecompaniesDataSource(this._adminInsurancecompaniesService);
        this.dataSource.loadInsurancecompanies(this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "Company_TList");
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
            this.dataSource.loadInsurancecompanies(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Company_TList");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadInsurancecompanies(pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Company_TList");
    }

    filterEvent() { this.selectedFilter(); }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadInsurancecompanies(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Company_TList");
    }

    addNewInsurancecompany() {
        this.router.navigate(['admin/insurancecompanies/insurancecompany_detail']);
    }

    editShowInsurancecompanyDetail(insurancecompany: any) {
        this.router.navigate(['admin/insurancecompanies/insurancecompany_detail'], { queryParams: insurancecompany });
    }

    deleteInsurancecompany(insurancecompany): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';
        dialogConfig.disableClose = true;
        dialogConfig.data = {
            insurancecompany, flag: this.flag
        };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                let deleteInsurancecompany = this._adminInsurancecompaniesService.insurancecompanyList.findIndex((deletedinsurancecompany: any) => deletedinsurancecompany.id == insurancecompany.id);
                if (deleteInsurancecompany > -1) {
                    this._adminInsurancecompaniesService.insurancecompanyList.splice(deleteInsurancecompany, 1);
                    this.dataSource.insurancecompaniesSubject.next(this._adminInsurancecompaniesService.insurancecompanyList);
                    this.dataSource.totalLength = this.dataSource.totalLength - 1;
                }
            }
        });
    }

    duplicateInsurancecompany(insurancecompany): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';
        dialogConfig.disableClose = true;
        dialogConfig.data = { insurancecompany, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                this.router.navigate(['admin/insurancecompanies/insurancecompany_detail'], { queryParams: insurancecompany });
            }
        });
    }
}