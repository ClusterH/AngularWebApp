import { Component, ElementRef, OnInit, OnDestroy, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as assetsEnglish } from 'app/main/admin/assets/i18n/en';
import { locale as assetsFrench } from 'app/main/admin/assets/i18n/fr';
import { locale as assetsPortuguese } from 'app/main/admin/assets/i18n/pt';
import { locale as assetsSpanish } from 'app/main/admin/assets/i18n/sp';
import { AssetsDataSource } from "app/main/admin/assets/services/assets.datasource";
import { AssetsService } from 'app/main/admin/assets/services/assets.service';
import * as $ from 'jquery';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'admin-assets',
    templateUrl: './assets.component.html',
    styleUrls: ['./assets.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class AssetsComponent implements OnInit, OnDestroy {
    dataSource: AssetsDataSource;

    @Output()
    pageEvent: PageEvent;
    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;
    asset: any;
    // userConncode: string;
    // userID: number;
    restrictValue: any;
    flag: string = '';
    displayedColumns = ['id', 'name', 'company', 'group', 'subgroup', 'account', 'operator', 'unittype', 'serviceplan', 'producttype', 'make', 'model', 'isactive', 'timezone', 'created', 'createdbyname', 'deletedwhen', 'deletedbyname', 'lastmodifieddate', 'lastmodifiedbyname'
    ];

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;

    constructor(
        private _adminAssetsService: AssetsService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).assets;
        this._fuseTranslationLoaderService.loadTranslations(assetsEnglish, assetsSpanish, assetsFrench, assetsPortuguese);
        this.pageIndex = 0;
        this.pageSize = 25;
        this.selected = '';
        this.filter_string = '';
    }

    ngOnInit(): void {
        this.dataSource = new AssetsDataSource(this._adminAssetsService);
        this.dataSource.loadAssets(this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "Unit_TList");
    }

    ngAfterViewInit(): void {
        var node = $("div.page_index");
        var node_length = node.length;
        $("div.page_index").remove();
        $("button.mat-paginator-navigation-previous.mat-icon-button.mat-button-base").after(node[node_length - 1]);
        // when paginator event is invoked, retrieve the related data
        this.sort.sortChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => this.paginator.pageIndex = 0);
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(tap(() => this.dataSource.loadAssets(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Unit_Tlist")), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
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
            this.dataSource.loadAssets(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Unit_TList");
        }
    }
    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadAssets(pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Unit_TList");
    }

    filterEvent() { this.selectedFilter(); }

    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadAssets(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Unit_TList");
    }

    addNewAsset() {
        this.router.navigate(['admin/assets/asset_detail']);
    }

    editShowAssetDetail(asset: any) {
        this.router.navigate(['admin/assets/asset_detail'], { queryParams: asset });
    }

    deleteAsset(asset: any): void {

        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';
        dialogConfig.disableClose = true;
        dialogConfig.data = { asset, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                let deleteAsset = this._adminAssetsService.assetList.findIndex((deletedasset: any) => deletedasset.id == asset.id);
                if (deleteAsset > -1) {
                    this._adminAssetsService.assetList.splice(deleteAsset, 1);
                    this.dataSource.assetsSubject.next(this._adminAssetsService.assetList);
                    this.dataSource.totalLength = this.dataSource.totalLength - 1;
                }
            }
        });
    }

    duplicateAsset(asset: any): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';
        dialogConfig.disableClose = true;
        dialogConfig.data = { asset, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(asset => {
            if (asset) {
                this.router.navigate(['admin/assets/asset_detail'], { queryParams: asset });
            }
        });
    }
}