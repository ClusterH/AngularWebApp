import { Component, ElementRef, OnInit, Output, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { merge, Subject } from 'rxjs';

import { tap, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as routesEnglish } from 'app/main/admin/routes/i18n/en';
import { locale as routesFrench } from 'app/main/admin/routes/i18n/fr';
import { locale as routesPortuguese } from 'app/main/admin/routes/i18n/pt';
import { locale as routesSpanish } from 'app/main/admin/routes/i18n/sp';
import { RoutesDataSource } from "app/main/admin/routes/services/routes.datasource";
import { RoutesService } from 'app/main/admin/routes/services/routes.service';
import { RouteDetailService } from 'app/main/admin/routes/services/route_detail.service';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'admin-routes',
    templateUrl: './routes.component.html',
    styleUrls: ['./routes.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class RoutesComponent implements OnInit, OnDestroy {
    dataSource: RoutesDataSource;
    @Output()
    pageEvent: PageEvent;
    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;
    route: any;

    restrictValue: any;
    flag: string = '';
    displayedColumns = [
        'id',
        'name',
        'createdwhen',
        'createdbyname',
        'lastmodifieddate',
        'lastmodifiedbyname'
    ];

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;

    constructor(
        private _adminRoutesService: RoutesService,
        private routeDetailService: RouteDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();

        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).routes;
        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(routesEnglish, routesSpanish, routesFrench, routesPortuguese);

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
            .pipe(tap(() => this.dataSource.loadRoutes(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Route_TList")),
                takeUntil(this._unsubscribeAll)
            ).subscribe((res: any) => { });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnInit(): void {
        this.dataSource = new RoutesDataSource(this._adminRoutesService);
        this.dataSource.loadRoutes(this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "Route_TList");
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    selectedFilter() {
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadRoutes(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Route_TList");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadRoutes(pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Route_TList");
    }

    filterEvent() { this.selectedFilter(); }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadRoutes(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Route_TList");
    }

    addNewRoute() {
        this.router.navigate(['admin/routes/route_detail']);
    }

    editShowRouteDetail(route: any) {
        this.router.navigate(['admin/routes/route_detail'], { queryParams: route });
    }

    deleteRoute(route): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';
        dialogConfig.disableClose = true;
        dialogConfig.data = { route, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                let deleteRoute = this._adminRoutesService.routeList.findIndex((deletedroute: any) => deletedroute.id == route.id);
                if (deleteRoute > -1) {
                    this._adminRoutesService.routeList.splice(deleteRoute, 1);
                    this.dataSource.routesSubject.next(this._adminRoutesService.routeList);
                    this.dataSource.totalLength = this.dataSource.totalLength - 1;
                }
            }
        });
    }

    duplicateRoute(route): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';
        dialogConfig.disableClose = true;
        dialogConfig.data = { route, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(route => {
            if (route) {
                this.router.navigate(['admin/routes/route_detail'], { queryParams: route });
            }
        });
    }
}