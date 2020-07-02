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

import { ZonegroupsService } from 'app/main/admin/geofences/zonegroups/services/zonegroups.service';
import { ZonegroupsDataSource } from "app/main/admin/geofences/zonegroups/services/zonegroups.datasource";
import { ZonegroupDetailService } from 'app/main/admin/geofences/zonegroups/services/zonegroup_detail.service';

import {CourseDialogComponent} from "../dialog/dialog.component";

import { locale as zonegroupsEnglish } from 'app/main/admin/geofences/zonegroups/i18n/en';
import { locale as zonegroupsSpanish } from 'app/main/admin/geofences/zonegroups/i18n/sp';
import { locale as zonegroupsFrench } from 'app/main/admin/geofences/zonegroups/i18n/fr';
import { locale as zonegroupsPortuguese } from 'app/main/admin/geofences/zonegroups/i18n/pt';

@Component({
    selector     : 'admin-zonegroups',
    templateUrl  : './zonegroups.component.html',
    styleUrls    : ['./zonegroups.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ZonegroupsComponent implements OnInit
{
    dataSource: ZonegroupsDataSource;

    @Output()
    pageEvent: PageEvent;
   
    pageIndex= 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;

    zonegroup: any;
    userConncode: string;
    userID: number;
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

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;
    
    constructor(
        private _adminZonegroupsService: ZonegroupsService,
        private zonegroupDetailService: ZonegroupDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    )
    {
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).geofences;

        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(zonegroupsEnglish, zonegroupsSpanish, zonegroupsFrench, zonegroupsPortuguese);

        this.pageIndex= 0;
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
        .pipe(
           tap(() => this.dataSource.loadZonegroups(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Zonegroup_Tlist"))
        )
        .subscribe( (res: any) => {
        });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }
   
    ngOnInit(): void
    {
        this.dataSource = new ZonegroupsDataSource(this._adminZonegroupsService);
        this.dataSource.loadZonegroups(this.userConncode, this.userID, this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "Zonegroup_Tlist");
    }

    selectedFilter() {
        
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadZonegroups(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Zonegroup_Tlist");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadZonegroups(this.userConncode, this.userID, pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Zonegroup_Tlist");
    }

    filterEvent() {
        this.selectedFilter();
    }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadZonegroups(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Zonegroup_Tlist");
    }

    addNewZonegroup() {
        this.zonegroupDetailService.zonegroup_detail = '';
        localStorage.removeItem("zonegroup_detail");
        this.router.navigate(['admin/geofences/zonegroups/zonegroup_detail']);
    }

    editShowZonegroupDetail(zonegroup: any) {

        localStorage.setItem("zonegroup_detail", JSON.stringify(zonegroup));

        this.router.navigate(['admin/geofences/zonegroups/zonegroup_detail']);
    }
    
    deleteZonegroup(zonegroup): void
    {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            zonegroup, flag: this.flag
        };

        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if ( result )
            { 
                let deleteZonegroup =  this._adminZonegroupsService.zonegroupList.findIndex((deletedzonegroup: any) => deletedzonegroup.id == zonegroup.id);
        
                if (deleteZonegroup > -1) {
                    this._adminZonegroupsService.zonegroupList.splice(deleteZonegroup, 1);
                    this.dataSource.zonegroupsSubject.next(this._adminZonegroupsService.zonegroupList);
                    this.dataSource.totalLength = this.dataSource.totalLength - 1;
                }  
            } else {
                
            }
        });
    }

    duplicateZonegroup(zonegroup: any): void
    {
        
        
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            zonegroup, flag: this.flag
        };

        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if ( result )
            { 
                
            } else {

            }
        });
    }
}
