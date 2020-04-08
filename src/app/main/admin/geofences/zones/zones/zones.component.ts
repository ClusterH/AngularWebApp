import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Output, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

import { merge } from 'rxjs';
import { tap,} from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { ZonesService } from 'app/main/admin/geofences/zones/services/zones.service';
import { ZonesDataSource } from "app/main/admin/geofences/zones/services/zones.datasource";
import { ZoneDetailService } from 'app/main/admin/geofences/zones/services/zone_detail.service';

import {CourseDialogComponent} from "../dialog/dialog.component";

import { locale as zonesEnglish } from 'app/main/admin/geofences/zones/i18n/en';
import { locale as zonesSpanish } from 'app/main/admin/geofences/zones/i18n/sp';
import { locale as zonesFrench } from 'app/main/admin/geofences/zones/i18n/fr';
import { locale as zonesPortuguese } from 'app/main/admin/geofences/zones/i18n/pt';

@Component({
    selector     : 'admin-zones',
    templateUrl  : './zones.component.html',
    styleUrls    : ['./zones.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ZonesComponent implements OnInit
{
    dataSource: ZonesDataSource;

    @Output()
    pageEvent: PageEvent;
   
    pageIndex= 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;

    zone: any;
    userConncode: string;
    userID: number;

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

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;
    
    constructor(
        private _adminZonesService: ZonesService,
        private zoneDetailService: ZoneDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    )
    {
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(zonesEnglish, zonesSpanish, zonesFrench, zonesPortuguese);

        this.pageIndex= 0;
        this.pageSize = 25;
        this.selected = '';
        this.filter_string = '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngAfterViewInit() {
        console.log("ngAfterViewInit:");

        var node = $("div.page_index");
        var node_length = node.length;
        $("div.page_index").remove();
        $("button.mat-paginator-navigation-previous.mat-icon-button.mat-button-base").after(node[node_length - 1]);
   
        // when paginator event is invoked, retrieve the related data
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange, this.paginator.page)
        .pipe(
           tap(() => this.dataSource.loadZones(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Zone_Tlist"))
        )
        .subscribe( (res: any) => {
        });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }
   
    ngOnInit(): void
    {
        console.log(this.pageSize, this.pageIndex);

        this.dataSource = new ZonesDataSource(this._adminZonesService);
        this.dataSource.loadZones(this.userConncode, this.userID, this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "Zone_Tlist");
    }

    onRowClicked(zone) {
        console.log('Row Clicked:', zone);
    }

    selectedFilter() {
        console.log(this.selected, this.filter_string);
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadZones(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Zone_Tlist");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadZones(this.userConncode, this.userID, pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Zone_Tlist");
    }

    filterEvent() {
        this.selectedFilter();
    }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadZones(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Zone_Tlist");
    }

    addNewZone() {
        this.zoneDetailService.zone_detail = '';
        localStorage.removeItem("zone_detail");
        this.router.navigate(['admin/geofences/zones/zone_detail']);
    }

    editShowZoneDetail(zone: any) {

        localStorage.setItem("zone_detail", JSON.stringify(zone));

        this.router.navigate(['admin/geofences/zones/zone_detail']);
    }
    
    deleteZone(zone): void
    {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            zone, flag: this.flag
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

    duplicateZone(zone: any): void
    {
        console.log("first:", zone)
        
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            zone, flag: this.flag
        };

        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if ( result )
            { 
                console.log(result);
            } else {

            }
        });
    }
}
