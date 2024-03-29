import { Component, ElementRef, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as fuelregistriesEnglish } from 'app/main/fuelmanagement/fuelregistries/i18n/en';
import { locale as fuelregistriesFrench } from 'app/main/fuelmanagement/fuelregistries/i18n/fr';
import { locale as fuelregistriesPortuguese } from 'app/main/fuelmanagement/fuelregistries/i18n/pt';
import { locale as fuelregistriesSpanish } from 'app/main/fuelmanagement/fuelregistries/i18n/sp';
import { FuelregistriesDataSource } from "app/main/fuelmanagement/fuelregistries/services/fuelregistries.datasource";
import { FuelregistriesService } from 'app/main/fuelmanagement/fuelregistries/services/fuelregistries.service';
import { FuelregistryDetailService } from 'app/main/fuelmanagement/fuelregistries/services/fuelregistry_detail.service';
import * as $ from 'jquery';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { FuelRegisterDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'fuelmanagement-fuelregistries',
    templateUrl: './fuelregistries.component.html',
    styleUrls: ['./fuelregistries.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class FuelregistriesComponent implements OnInit, OnDestroy {
    dataSource: FuelregistriesDataSource;
    @Output()
    pageEvent: PageEvent;
    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentFuelregistry: any;
    fuelregistry: any;
    restrictValue: any;
    flag: string = '';
    displayedColumns = [
        'id',
        'datentime',
        'amount',
        'cost',
        'fromtank',
        'totank',
        'tounit',
        'operator',
    ];

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;

    constructor(
        private _adminFuelregistriesService: FuelregistriesService,
        private fuelregistryDetailService: FuelregistryDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).fuelregistries;
        this._fuseTranslationLoaderService.loadTranslations(fuelregistriesEnglish, fuelregistriesSpanish, fuelregistriesFrench, fuelregistriesPortuguese);
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
            .pipe(tap(() => this.dataSource.loadFuelregistries(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Fuelregistry_Tlist")), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnInit(): void {
        this.dataSource = new FuelregistriesDataSource(this._adminFuelregistriesService);
        this.dataSource.loadFuelregistries(this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "Fuelregistry_TList");
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
            this.dataSource.loadFuelregistries(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Fuelregistry_Tlist");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadFuelregistries(pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Fuelregistry_Tlist");
    }

    filterEvent() { this.selectedFilter(); }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadFuelregistries(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Fuelregistry_Tlist");
    }

    addNewFuelregistry() {
        this.router.navigate(['fuelmanagement/fuelregistries/fuelregistry_detail']);
    }

    editShowFuelregistryDetail(fuelregistry: any) {
        this.router.navigate(['fuelmanagement/fuelregistries/fuelregistry_detail'], { queryParams: fuelregistry });
    }

    deleteFuelregistry(fuelregistry): void {

        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';
        dialogConfig.disableClose = true;
        dialogConfig.data = { fuelregistry, flag: this.flag };
        const dialogRef = this._matDialog.open(FuelRegisterDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                let deleteRegistry = this._adminFuelregistriesService.fuelregistryList.findIndex((registry: any) => registry.id == fuelregistry.id);
                if (deleteRegistry > -1) {
                    this._adminFuelregistriesService.fuelregistryList.splice(deleteRegistry, 1);
                    this.dataSource.fuelregistriesSubject.next(this._adminFuelregistriesService.fuelregistryList);
                }
            }
        });
    }

    duplicateFuelregistry(fuelregistry): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';
        dialogConfig.disableClose = true;
        dialogConfig.data = { fuelregistry, flag: this.flag };
        const dialogRef = this._matDialog.open(FuelRegisterDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                this.router.navigate(['fuelmanagement/fuelregistries/fuelregistry_detail'], { queryParams: fuelregistry });
            }
        });
    }
}