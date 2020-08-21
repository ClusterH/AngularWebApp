import { Component, ElementRef, OnInit, Output, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as poisEnglish } from 'app/main/admin/poi/pois/i18n/en';
import { locale as poisFrench } from 'app/main/admin/poi/pois/i18n/fr';
import { locale as poisPortuguese } from 'app/main/admin/poi/pois/i18n/pt';
import { locale as poisSpanish } from 'app/main/admin/poi/pois/i18n/sp';
import { PoisDataSource } from "app/main/admin/poi/pois/services/pois.datasource";
import { PoisService } from 'app/main/admin/poi/pois/services/pois.service';
import { PoiDetailService } from 'app/main/admin/poi/pois/services/poi_detail.service';
import * as $ from 'jquery';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'admin-pois',
    templateUrl: './pois.component.html',
    styleUrls: ['./pois.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class PoisComponent implements OnInit, OnDestroy {
    dataSource: PoisDataSource;

    @Output()
    pageEvent: PageEvent;
    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;

    poi: any;
    userConncode: string;
    userID: number;
    restrictValue: any;
    flag: string = '';
    displayedColumns = [
        'id',
        'name',
        'radius',
        'point',
        'pointtype',
        'company',
        'group',
        'subgroup',
        'address',
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
        private _adminPoisService: PoisService,
        private poiDetailService: PoiDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).pois;
        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(poisEnglish, poisSpanish, poisFrench, poisPortuguese);
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
        // when paginator event is invoked, retrieve the related data
        this.sort.sortChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => this.paginator.pageIndex = 0);
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                tap(() => this.dataSource.loadPois(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Poi_Tlist")),
                takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnInit(): void {
        this.dataSource = new PoisDataSource(this._adminPoisService);
        this.dataSource.loadPois(this.userConncode, this.userID, this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "Poi_Tlist");
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
            this.dataSource.loadPois(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Poi_Tlist");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadPois(this.userConncode, this.userID, pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Poi_Tlist");
    }

    filterEvent() { this.selectedFilter(); }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadPois(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Poi_Tlist");
    }

    addNewPoi() {
        this.router.navigate(['admin/poi/pois/poi_detail']);
    }

    editShowPoiDetail(poi: any) {
        this.router.navigate(['admin/poi/pois/poi_detail'], { queryParams: poi });
    }

    deletePoi(poi): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';
        dialogConfig.disableClose = true;
        dialogConfig.data = { poi, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                let deletePoi = this._adminPoisService.poiList.findIndex((deletedpoi: any) => deletedpoi.id == poi.id);
                if (deletePoi > -1) {
                    this._adminPoisService.poiList.splice(deletePoi, 1);
                    this.dataSource.poisSubject.next(this._adminPoisService.poiList);
                    this.dataSource.totalLength = this.dataSource.totalLength - 1;
                }
            }
        });
    }

    duplicatePoi(poi: any): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';
        dialogConfig.disableClose = true;
        dialogConfig.data = { poi, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(poi => {
            if (poi) {
                this.router.navigate(['admin/vehicles/vehicle_detail'], { queryParams: poi });
            }
        });
    }
}