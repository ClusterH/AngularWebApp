import { Component, ElementRef, OnInit, OnDestroy, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as vehiclesEnglish } from 'app/main/admin/vehicles/i18n/en';
import { locale as vehiclesFrench } from 'app/main/admin/vehicles/i18n/fr';
import { locale as vehiclesPortuguese } from 'app/main/admin/vehicles/i18n/pt';
import { locale as vehiclesSpanish } from 'app/main/admin/vehicles/i18n/sp';
import { VehiclesDataSource } from "app/main/admin/vehicles/services/vehicles.datasource";
import { VehiclesService } from 'app/main/admin/vehicles/services/vehicles.service';
import * as $ from 'jquery';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'admin-vehicles',
    templateUrl: './vehicles.component.html',
    styleUrls: ['./vehicles.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class VehiclesComponent implements OnInit, OnDestroy {
    dataSource: VehiclesDataSource;
    @Output()
    pageEvent: PageEvent;
    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;
    vehicle: any;
    restrictValue: any;
    flag: string = '';
    displayedColumns = ['id', 'name', 'company', 'group', 'subgroup', 'account', 'operator', 'unittype', 'serviceplan', 'producttype', 'make', 'model', 'isactive', 'timezone', 'created', 'createdbyname', 'deletedwhen', 'deletedbyname', 'lastmodifieddate', 'lastmodifiedbyname'
    ];

    routerLinkType: string;
    routerLinkValue: string;

    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;

    constructor(
        private _adminVehiclesService: VehiclesService,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).vehicles;
        this._fuseTranslationLoaderService.loadTranslations(vehiclesEnglish, vehiclesSpanish, vehiclesFrench, vehiclesPortuguese);

        this.activatedroute.paramMap.subscribe(params => {
            this.routerLinkType = params.get('type');
            switch (this.routerLinkType) {
                case '1':
                    this.routerLinkValue = 'Vehicle';
                    break;
                case '2':
                    this.routerLinkValue = 'Person';
                    break;
                case '3':
                    this.routerLinkValue = 'Cargo';
                    break;
                case '4':
                    this.routerLinkValue = 'Asset';
                    break;
            }

        });

        this.pageIndex = 0;
        this.pageSize = 25;
        this.selected = '';
        this.filter_string = '';
    }

    ngOnInit(): void {
        this.dataSource = new VehiclesDataSource(this._adminVehiclesService);
        this.dataSource.loadVehicles(this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "Unit_TList");
    }

    ngAfterViewInit(): void {
        var node = $("div.page_index");
        var node_length = node.length;
        $("div.page_index").remove();
        $("button.mat-paginator-navigation-previous.mat-icon-button.mat-button-base").after(node[node_length - 1]);
        this.sort.sortChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => this.paginator.pageIndex = 0);
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(tap(() => this.dataSource.loadVehicles(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Unit_Tlist")), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

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
            this.dataSource.loadVehicles(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Unit_TList");
        }
    }
    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadVehicles(pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Unit_TList");
    }

    filterEvent() { this.selectedFilter(); }

    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadVehicles(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Unit_TList");
    }

    addNewVehicle() {
        this.router.navigate([`admin/vehicles/vehicle_detail/${this.routerLinkType}`]);
    }

    editShowVehicleDetail(vehicle: any) {
        this.router.navigate([`admin/vehicles/vehicle_detail/${this.routerLinkType}`], { queryParams: vehicle });
    }

    deleteVehicle(vehicle: any): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';
        dialogConfig.disableClose = true;
        dialogConfig.data = { vehicle, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                let deleteVehicle = this._adminVehiclesService.vehicleList.findIndex((deletedvehicle: any) => deletedvehicle.id == vehicle.id);
                if (deleteVehicle > -1) {
                    this._adminVehiclesService.vehicleList.splice(deleteVehicle, 1);
                    this.dataSource.vehiclesSubject.next(this._adminVehiclesService.vehicleList);
                    this.dataSource.totalLength = this.dataSource.totalLength - 1;
                }
            }
        });
    }

    duplicateVehicle(vehicle: any): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';
        dialogConfig.disableClose = true;
        dialogConfig.data = { vehicle, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(vehicle => {
            if (vehicle) {
                this.router.navigate([`admin/vehicles/vehicle_detail/${this.routerLinkType}`], { queryParams: vehicle });
            }
        });
    }
}