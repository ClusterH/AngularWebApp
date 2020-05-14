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

import { MaintservicesService } from 'app/main/logistic/maintenance/maintservices/services/maintservices.service';
import { MaintservicesDataSource } from "app/main/logistic/maintenance/maintservices/services/maintservices.datasource";

import {MaintserviceDialogComponent} from "../dialog/dialog.component";
import {DeleteDialogComponent} from "../deletedialog/deletedialog.component";

import { locale as maintservicesEnglish } from 'app/main/logistic/maintenance/maintservices/i18n/en';
import { locale as maintservicesSpanish } from 'app/main/logistic/maintenance/maintservices/i18n/sp';
import { locale as maintservicesFrench } from 'app/main/logistic/maintenance/maintservices/i18n/fr';
import { locale as maintservicesPortuguese } from 'app/main/logistic/maintenance/maintservices/i18n/pt';
import { Route } from '@angular/compiler/src/core';

@Component({
    selector     : 'logistic-maintservices',
    templateUrl  : './maintservices.component.html',
    styleUrls    : ['./maintservices.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class MaintservicesComponent implements OnInit
{
    dataSource: MaintservicesDataSource;

    @Output()
    pageMaintservice: PageEvent;
   
    pageIndex= 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentMaintservice: any;

    maintservice: any;
    userConncode: string;
    userID: number;
    restrictValue: number;

    flag: string = '';
    displayedColumns = [
        'id',
        'name',
        'company',
        'group'
    ];

    dialogRef: any;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;
    
    constructor(
        private _adminMaintservicesService: MaintservicesService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    )
    {
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).maintservices;

        console.log(this.userConncode, this.userID);


        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(maintservicesEnglish, maintservicesSpanish, maintservicesFrench, maintservicesPortuguese);

        this.pageIndex= 0;
        this.pageSize = 25;
        this.selected = '';
        this.filter_string = '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngAfterViewInit() {
        console.log("ngAfterViewInit:maintservice");

        var node = $("div.page_index");
        var node_length = node.length;
        $("div.page_index").remove();
        $("button.mat-paginator-navigation-previous.mat-icon-button.mat-button-base").after(node[node_length - 1]);
   
        // when paginator maintservice is invoked, retrieve the related data
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        console.log(this.paginator.pageSize);

        merge(this.sort.sortChange, this.paginator.page)
        .pipe(
           tap(() => this.dataSource.loadMaintservices(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintservice_TList"))
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

        this.dataSource = new MaintservicesDataSource(this._adminMaintservicesService);
        this.dataSource.loadMaintservices(this.userConncode, this.userID, this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "maintservice_TList");
    }

    onRowClicked(maintservice) {
        console.log('Row Clicked:', maintservice);
    }

    selectedFilter() {
        console.log(this.selected, this.filter_string);
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadMaintservices(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintservice_TList");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        console.log(pageIndex);
        this.dataSource.loadMaintservices(this.userConncode, this.userID, pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintservice_TList");
    }

    filterMaintservice() {
        this.selectedFilter();
    }
    navigatePageMaintservice() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadMaintservices(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintservice_TList");
    }

    addNewMaintservice() {

        this.dialogRef = this._matDialog.open(MaintserviceDialogComponent, {
            panelClass: 'maintservice-dialog',
            disableClose: true,
            data      : {
                serviceDetail: null,
                flag: 'new'
            }
        });

        this.dialogRef.afterClosed()
        .subscribe(res => {
            console.log(res);
            this.dataSource.maintservicesSubject.next(res);

        });
    }

    editShowMaintserviceDetail(maintservice: any) {
        console.log(maintservice);


        this.dialogRef = this._matDialog.open(MaintserviceDialogComponent, {
            panelClass: 'maintservice-dialog',
            disableClose: true,
            data      : {
                serviceDetail: maintservice,
                flag: 'edit'
            }
        });

        this.dialogRef.afterClosed()
        .subscribe(res => {
            console.log(res);
            this.dataSource.maintservicesSubject.next(res);
        });
    }
    
    deleteMaintservice(maintservice): void
    {
        console.log(maintservice);

        this.dialogRef = this._matDialog.open(DeleteDialogComponent, {
            panelClass: 'delete-dialog',
            disableClose: true,
            data      : {
                serviceDetail: maintservice,
                flag: 'delete'
            }
        });

        this.dialogRef.afterClosed()
        .subscribe(res => {
            console.log(res);
            this.dataSource.maintservicesSubject.next(res);

        });
    }

    // duplicateMaintservice(maintservice): void
    // {
    //     const dialogConfig = new MatDialogConfig();
    //     this.flag = 'duplicate';

    //     dialogConfig.disableClose = true;
        
    //     dialogConfig.data = {
    //         maintservice, flag: this.flag
    //     };

    //     const dialogRef = this._matDialog.open(MaintserviceDialogComponent, dialogConfig);

    //     dialogRef.afterClosed().subscribe(result => {
    //         if ( result )
    //         { 
    //             console.log(result);
    //         } else {
    //             console.log("FAIL:", result);
    //         }
    //     });
    // }
}
