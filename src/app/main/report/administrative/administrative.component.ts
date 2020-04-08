import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Output } from '@angular/core';
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

import { AdministrativeService } from 'app/main/report/administrative/services/administrative.service';
// import { AdministrativeDataSource } from "app/main/report/administrative/services/administrative.datasource";

import {CourseDialogComponent} from "./dialog/dialog.component";

import { locale as administrativeEnglish } from 'app/main/report/administrative/i18n/en';
import { locale as administrativeSpanish } from 'app/main/report/administrative/i18n/sp';
import { locale as administrativeFrench } from 'app/main/report/administrative/i18n/fr';
import { locale as administrativePortuguese } from 'app/main/report/administrative/i18n/pt';

@Component({
    selector     : 'report-administrative',
    templateUrl  : './administrative.component.html',
    styleUrls    : ['./administrative.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class AdministrativeComponent implements OnInit
{
    // dataSource: AdministrativeDataSource;

    @Output()
    pageEvent: PageEvent;
   
    pageIndex= 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;

    vehicle: any;
    userConncode: string;
    userID: number;

    flag: string = '';
    displayedColumns = [
        'id',
        'name',
        'company',
        'group',
        'subgroup',
        'account',
        'operator',
        'unittype',
        'serviceplan',
        'producttype',
        'make',
        'model',
        'isactive',
        'timezone',
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
        private administrativeService: AdministrativeService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    )
    {
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(administrativeEnglish, administrativeSpanish, administrativeFrench, administrativePortuguese);

        this.pageIndex= 0;
        this.pageSize = 25;
        this.selected = '';
        this.filter_string = '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    // ngAfterViewInit() {
    //     console.log("ngAfterViewInit:");

    //     var node = $("div.page_index");
    //     var node_length = node.length;
    //     $("div.page_index").remove();
    //     $("button.mat-paginator-navigation-previous.mat-icon-button.mat-button-base").after(node[node_length - 1]);
   
    //     // when paginator event is invoked, retrieve the related data
    //     this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    //     merge(this.sort.sortChange, this.paginator.page)
    //     .pipe(
    //        tap(() => this.dataSource.loadAdministrative(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Unit_TList"))
    //     )
    //     .subscribe( (res: any) => {
    //     });

    //     const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
    //     list_page[0].innerHTML = 'Page Size :';
    // }
   
    ngOnInit(): void
    {
        // console.log(this.pageSize, this.pageIndex);

        // this.dataSource = new AdministrativeDataSource(this._adminAdministrativeService);
        // this.dataSource.loadAdministrative(this.userConncode, this.userID, this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "Unit_TList");
    }

    // onRowClicked(vehicle) {
    //     console.log('Row Clicked:', vehicle);
    // }

    // selectedFilter() {
    //     console.log(this.selected, this.filter_string);
    //     if (this.selected == '') {
    //         alert("Please choose Field for filter!");
    //     } else {
    //         this.paginator.pageIndex = 0;
    //         this.dataSource.loadAdministrative(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Unit_TList");
    //     }
    // }

    // actionPageIndexbutton(pageIndex: number) {
    //     this.dataSource.loadAdministrative(this.userConncode, this.userID, pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Unit_TList");
    // }

    // filterEvent() {
    //     this.selectedFilter();
    // }
    // navigatePageEvent() {
    //     this.paginator.pageIndex = this.dataSource.page_index - 1;
    //     this.dataSource.loadAdministrative(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Unit_TList");
    // }

    // addNewVehicle() {
    //     this.vehicleDetailService.vehicle_detail = '';
    //     localStorage.removeItem("vehicle_detail");
    //     this.router.navigate(['admin/administrative/vehicle_detail']);
    // }

    // editShowVehicleDetail(vehicle: any) {

    //     localStorage.setItem("vehicle_detail", JSON.stringify(vehicle));

    //     this.router.navigate(['admin/administrative/vehicle_detail']);
    // }
    
    // deleteVehicle(vehicle): void
    // {
    //     const dialogConfig = new MatDialogConfig();
    //     this.flag = 'delete';

    //     dialogConfig.disableClose = true;
        
    //     dialogConfig.data = {
    //         vehicle, flag: this.flag
    //     };

    //     const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

    //     dialogRef.afterClosed().subscribe(result => {
    //         if ( result )
    //         { 
    //             console.log(result);
    //         } else {
    //             console.log("FAIL:", result);
    //         }
    //     });
    // }

    // duplicateVehicle(vehicle: any): void
    // {
    //     console.log("first:", vehicle)
        
    //     const dialogConfig = new MatDialogConfig();
    //     this.flag = 'duplicate';

    //     dialogConfig.disableClose = true;
        
    //     dialogConfig.data = {
    //         vehicle, flag: this.flag
    //     };

    //     const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

    //     dialogRef.afterClosed().subscribe(result => {
    //         if ( result )
    //         { 
    //             console.log(result);
    //         } else {

    //         }
    //     });
    // }
}
