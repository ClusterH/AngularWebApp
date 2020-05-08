import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Output, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

import { merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { ServiceitemsService } from 'app/main/logistic/maintenance/serviceitems/services/serviceitems.service';
import { ServiceitemsDataSource } from "app/main/logistic/maintenance/serviceitems/services/serviceitems.datasource";
import { ServiceitemDetailService } from 'app/main/logistic/maintenance/serviceitems/services/serviceitem_detail.service';

import {CourseDialogComponent} from "../dialog/dialog.component";

import { locale as serviceitemsEnglish } from 'app/main/logistic/maintenance/serviceitems/i18n/en';
import { locale as serviceitemsSpanish } from 'app/main/logistic/maintenance/serviceitems/i18n/sp';
import { locale as serviceitemsFrench } from 'app/main/logistic/maintenance/serviceitems/i18n/fr';
import { locale as serviceitemsPortuguese } from 'app/main/logistic/maintenance/serviceitems/i18n/pt';
import { Route } from '@angular/compiler/src/core';

@Component({
    selector     : 'logistic-serviceitems',
    templateUrl  : './serviceitems.component.html',
    styleUrls    : ['./serviceitems.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ServiceitemsComponent implements OnInit
{
    dataSource: ServiceitemsDataSource;

    @Output()
    pageServiceitem: PageEvent;
   
    pageIndex= 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentServiceitem: any;

    serviceitem: any;
    userConncode: string;
    userID: number;
    restrictValue: number;

    flag: string = '';
    displayedColumns = [
        'id',
        'name',
        'description',
        'company',
        'group',
    ];

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;
    
    constructor(
        private _adminServiceitemsService: ServiceitemsService,
        private serviceitemDetailService: ServiceitemDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    )
    {
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).serviceitems;

        console.log(this.userConncode, this.userID);


        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(serviceitemsEnglish, serviceitemsSpanish, serviceitemsFrench, serviceitemsPortuguese);

        this.pageIndex= 0;
        this.pageSize = 25;
        this.selected = '';
        this.filter_string = '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngAfterViewInit() {
        console.log("ngAfterViewInit:serviceitem");

        var node = $("div.page_index");
        var node_length = node.length;
        $("div.page_index").remove();
        $("button.mat-paginator-navigation-previous.mat-icon-button.mat-button-base").after(node[node_length - 1]);
   
        // when paginator serviceitem is invoked, retrieve the related data
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        console.log(this.paginator.pageSize);

        merge(this.sort.sortChange, this.paginator.page)
        .pipe(
           tap(() => this.dataSource.loadServiceitems(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintserviceitem_TList"))
        )
        .subscribe( (res: any) => {
            console.log(res);
        });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }
   
    ngOnInit(): void
    {
        console.log(this.pageSize, this.pageIndex);

        this.dataSource = new ServiceitemsDataSource(this._adminServiceitemsService);
        this.dataSource.loadServiceitems(this.userConncode, this.userID, this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "maintserviceitem_TList");
    }

    onRowClicked(serviceitem) {
        console.log('Row Clicked:', serviceitem);
    }

    selectedFilter() {
        console.log(this.selected, this.filter_string);
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadServiceitems(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintserviceitem_TList");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        console.log(pageIndex);
        this.dataSource.loadServiceitems(this.userConncode, this.userID, pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintserviceitem_TList");
    }

    filterServiceitem() {
        this.selectedFilter();
    }
    navigatePageServiceitem() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadServiceitems(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintserviceitem_TList");
    }

    addNewServiceitem() {
        this.serviceitemDetailService.serviceitem_detail = '';
        localStorage.removeItem("serviceitem_detail");
        this.router.navigate(['logistic/serviceitems/serviceitem_detail']);
    }

    editShowServiceitemDetail(serviceitem: any) {
        this.serviceitemDetailService.serviceitem_detail = serviceitem;

        localStorage.setItem("serviceitem_detail", JSON.stringify(serviceitem));

        this.router.navigate(['logistic/serviceitems/serviceitem_detail']);
    }
    
    deleteServiceitem(serviceitem): void
    {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            serviceitem, flag: this.flag
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

    duplicateServiceitem(serviceitem): void
    {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            serviceitem, flag: this.flag
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
