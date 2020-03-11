import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Output, Input, Directive, Renderer2 } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import * as $ from 'jquery';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';

// import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { VehiclesService } from 'app/main/admin/vehicles/services/vehicles.service';
import { VehiclesDataSource } from "app/main/admin/vehicles/services/vehicles.datasource";

import {CourseDialogComponent} from "../dialog/dialog.component";

import { takeUntil } from 'rxjs/internal/operators';

import { locale as vehiclesEnglish } from 'app/main/admin/vehicles/i18n/en';
import { locale as vehiclesSpanish } from 'app/main/admin/vehicles/i18n/sp';
import { locale as vehiclesFrench } from 'app/main/admin/vehicles/i18n/fr';
import { locale as vehiclesPortuguese } from 'app/main/admin/vehicles/i18n/pt';
import { Route } from '@angular/compiler/src/core';

@Component({
    selector     : 'admin-vehicles',
    templateUrl  : './vehicles.component.html',
    styleUrls    : ['./vehicles.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class VehiclesComponent implements OnInit
{
    dataSource: VehiclesDataSource;

    @Output()
    pageEvent: PageEvent;
   
    pageIndex= 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;

    vehicle: any;

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
        private _adminVehiclesService: VehiclesService,
        public _matDialog: MatDialog, private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private renderer : Renderer2,
        private elmRef: ElementRef
    )
    {
        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(vehiclesEnglish, vehiclesSpanish, vehiclesFrench, vehiclesPortuguese);

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

        // this.paginator.page
        merge(this.sort.sortChange, this.paginator.page)
        .pipe(
           tap(() => this.dataSource.loadVehicles("PolarixUSA", 1, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Unit_TList"))
        )
        .subscribe( (res: any) => {
            console.log(res);
            // this.index_number = res.pageIndex + 1;
        });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }
   
    ngOnInit(): void
    {
        console.log(this.pageSize, this.pageIndex);

        this.dataSource = new VehiclesDataSource(this._adminVehiclesService);
        this.dataSource.loadVehicles("PolarixUSA", 1, this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "Unit_TList");
    }

    onRowClicked(vehicle) {
        console.log('Row Clicked:', vehicle);
    }

    selectedFilter() {
        console.log(this.selected, this.filter_string);
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadVehicles("PolarixUSA", 1, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Unit_TList");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        console.log(pageIndex);
        this.dataSource.loadVehicles("PolarixUSA", 1, pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Unit_TList");
    }

    filterEvent() {
        this.selectedFilter();
    }
    navigatePageEvent() {
        // console.log(this.index_number);
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadVehicles("PolarixUSA", 1, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Unit_TList");
    }

    editShowVehicleDetail(vehicle: any) {
        // let navigationExtras: NavigationExtras = vehicle;
        this._adminVehiclesService.vehicle_detail = vehicle;
        console.log(this._adminVehiclesService.vehicle_detail);
        // console.log(navigationExtras);

        this.router.navigate(['admin/vehicles/vehicle_detail']);
    }
    
    deleteVehicle(vehicle): void
    {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            vehicle, flag: this.flag
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

    duplicateVehicle(vehicle): void
    {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            vehicle, flag: this.flag
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
