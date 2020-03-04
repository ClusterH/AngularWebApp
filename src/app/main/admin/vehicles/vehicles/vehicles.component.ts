import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Output } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

// import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

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
    // pageStyle = {
    //     pageIndex: number,
    //     pageSize: 25,
    //     length: 100
    // }
    pageIndex= 0;
    pageSize = 25;
    length = 3072;
    pageSizeOptions: number[] = [5, 10, 25, 100];

    vehicle: any;

    flag: string = '';
    displayedColumns = ['id', 'name', 'company', 'group', 'subgroup', 'account', 'unittype', 'producttype', 'make', 'model', 'isactive', 'timezone', 'created', 'deletedwhen', 
                         'lastmodifieddate'];

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;

    // Private
    private _unsubscribeAll: Subject<any>;
/**
     * Constructor
     *
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _adminVehiclesService: VehiclesService,
        public _matDialog: MatDialog,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(vehiclesEnglish, vehiclesSpanish, vehiclesFrench, vehiclesPortuguese);

        this.pageIndex= 0;
        this.pageSize = 25;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngAfterViewInit() {
        console.log("ngAfterViewInit:");
        // this.dataSource.counter$
        // .pipe(
        //    tap((count) => {
             
        //    })
        // )
        // .subscribe();
   
        // when paginator event is invoked, retrieve the related data
        this.paginator.page
        .pipe(
           tap(() => this.dataSource.loadVehicles("PolarixUSA", 1, this.paginator.pageIndex, this.paginator.pageSize, "id", "ASC", "Unit_TList"))
        )
        .subscribe( res => {
            console.log(res);
            this.length = res.length;
        });
     }  
    /**
     * On init
     */
    ngOnInit(): void
    {
        console.log(this.pageSize, this.pageIndex);

        this.dataSource = new VehiclesDataSource(this._adminVehiclesService);
        this.dataSource.loadVehicles("PolarixUSA", 1, this.pageIndex, this.pageSize, "id", "ASC", "Unit_TList");

    }

    onRowClicked(vehicle) {
        console.log('Row Clicked:', vehicle);
    }

    actionPageIndexbutton(pageIndex: number) {
        console.log(pageIndex);
        this.dataSource.loadVehicles("PolarixUSA", 1, pageIndex, this.paginator.pageSize, "id", "ASC", "Unit_TList");
    }
    
   
     /**
     * Delete Contact
     */
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

// export class FilesDataSource extends DataSource<any>
// {
//     private _filterChange = new BehaviorSubject('');
//     private _filteredDataChange = new BehaviorSubject('');

//     constructor(
//         private _adminVehiclesService: VehiclesService,
//         private _matPaginator: MatPaginator,
//         private _matSort: MatSort
//     )
//     {
//         super();

//         this.filteredData = this._adminVehiclesService.vehicles;
//         console.log(this.filteredData);
//     }

//     /**
//      * Connect function called by the table to retrieve one stream containing the data to render.
//      *
//      * @returns {Observable<any[]>}
//      */
//     connect(): Observable<any[]>
//     {
//         const displayDataChanges = [
//             this._adminVehiclesService.onVehiclesChanged,
//             this._filterChange,
//         ];

//         return merge(...displayDataChanges)
//             .pipe(
//                 map(() => {
//                     console.log("merge_map:");
//                         let data = this._adminVehiclesService.vehicles.slice();
//                         console.log("data1:", data);
//                         data = this.filterData(data);
//                         console.log("data2:", data);
//                         this.filteredData = [...data];

//                         data = this.sortData(data);

//                         // Grab the page's slice of data.
//                         const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
//                         return data.splice(startIndex, this._matPaginator.pageSize);
//                     }
//                 ));
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Accessors
//     // -----------------------------------------------------------------------------------------------------

//     // Filtered data
//     get filteredData(): any
//     {
//         return this._filteredDataChange.value;
//     }

//     set filteredData(value: any)
//     {
//         this._filteredDataChange.next(value);
//     }

//     // Filter
//     get filter(): string
//     {
//         return this._filterChange.value;
//     }

//     set filter(filter: string)
//     {
//         this._filterChange.next(filter);
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Filter data
//      *
//      * @param data
//      * @returns {any}
//      */
//     filterData(data): any
//     {
//         if ( !this.filter )
//         {
//             return data;
//         }
//         return FuseUtils.filterArrayByString(data, this.filter);
//     }

//     /**
//      * Sort data
//      *
//      * @param data
//      * @returns {any[]}
//      */
//     sortData(data): any[]
//     {
//         if ( !this._matSort.active || this._matSort.direction === '' )
//         {
//             return data;
//         }

//         return data.sort((a, b) => {
//             let propertyA: number | string = '';
//             let propertyB: number | string = '';

//             switch ( this._matSort.active )
//             {
//                 case 'name':
//                     [propertyA, propertyB] = [a.name, b.name];
//                     break;
//                 case 'company':
//                     [propertyA, propertyB] = [a.company, b.company];
//                     break;
//                 case 'group':
//                     [propertyA, propertyB] = [a.group, b.group];
//                     break;
//                 case 'subgroup':
//                     [propertyA, propertyB] = [a.subgroup, b.subgroup];
//                     break;
//                 case 'operator':
//                     [propertyA, propertyB] = [a.operator, b.operator];
//                     break;
//                 case 'unittype':
//                     [propertyA, propertyB] = [a.unittype, b.unittype];
//                     break;
//                 case 'serviceplan':
//                     [propertyA, propertyB] = [a.serviceplan, b.serviceplan];
//                     break;
//                 case 'producttype':
//                     [propertyA, propertyB] = [a.producttype, b.producttype];
//                     break;
//                 case 'make':
//                     [propertyA, propertyB] = [a.make, b.make];
//                     break;
//                 case 'model':
//                     [propertyA, propertyB] = [a.model, b.model];
//                     break;
//                 case 'isactive':
//                     [propertyA, propertyB] = [a.isactive, b.isactive];
//                     break;
//                 case 'lastmodifiedby':
//                     [propertyA, propertyB] = [a.timezone, b.timezone];
//                     break;
//             }

//             const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
//             const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

//             return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
//         });
//     }

//     /**
//      * Disconnect
//      */
//     disconnect(): void
//     {
//     }
// }
