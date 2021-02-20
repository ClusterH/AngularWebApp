import { Component, ElementRef, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as zonesEnglish } from 'app/main/admin/geofences/zones/i18n/en';
import { locale as zonesFrench } from 'app/main/admin/geofences/zones/i18n/fr';
import { locale as zonesPortuguese } from 'app/main/admin/geofences/zones/i18n/pt';
import { locale as zonesSpanish } from 'app/main/admin/geofences/zones/i18n/sp';
import { ZonesDataSource } from "app/main/admin/geofences/zones/services/zones.datasource";
import { ZonesService } from 'app/main/admin/geofences/zones/services/zones.service';
import { ZoneDetailService } from 'app/main/admin/geofences/zones/services/zone_detail.service';
import * as $ from 'jquery';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'admin-zones',
    templateUrl: './zones.component.html',
    styleUrls: ['./zones.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ZonesComponent implements OnInit {
    dataSource: ZonesDataSource;

    @Output()
    pageEvent: PageEvent;

    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;

    zone: any;

    restrictValue: any;

    flag: string = '';
    displayedColumns = [
        'id',
        'name',
        'company',
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
        private _adminZonesService: ZonesService,
        private zoneDetailService: ZoneDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).geofences;

        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(zonesEnglish, zonesSpanish, zonesFrench, zonesPortuguese);

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

        // when paginator event is invoked, retrieve the related data
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(tap(() => this.dataSource.loadZones(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Zone_Tlist"))
            )
            .subscribe((res: any) => {
            });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnInit(): void {
        this.dataSource = new ZonesDataSource(this._adminZonesService);
        this.dataSource.loadZones(this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "Zone_Tlist");
    }

    selectedFilter() {

        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadZones(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Zone_Tlist");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadZones(pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Zone_Tlist");
    }

    filterEvent() { this.selectedFilter(); }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadZones(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Zone_Tlist");
    }

    addNewZone() {
        this.router.navigate(['admin/geofences/zones/zone_detail']);
    }

    editShowZoneDetail(zone: any) {
        this.router.navigate(['admin/geofences/zones/zone_detail'], { queryParams: zone });
    }

    deleteZone(zone): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';
        dialogConfig.disableClose = true;
        dialogConfig.data = {
            zone, flag: this.flag
        };

        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                let deleteZone = this._adminZonesService.zoneList.findIndex((deletedzone: any) => deletedzone.id == zone.id);
                if (deleteZone > -1) {
                    this._adminZonesService.zoneList.splice(deleteZone, 1);
                    this.dataSource.zonesSubject.next(this._adminZonesService.zoneList);
                    this.dataSource.totalLength = this.dataSource.totalLength - 1;
                }
            }
        });
    }

    duplicateZone(zone: any): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';
        dialogConfig.disableClose = true;
        dialogConfig.data = {
            zone, flag: this.flag
        };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                this.router.navigate(['admin/geofences/zones/zone_detail'], { queryParams: result });
            }
        });
    }
}
