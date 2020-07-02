import { Component, ElementRef, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as devconfigsEnglish } from 'app/main/system/devconfigs/i18n/en';
import { locale as devconfigsFrench } from 'app/main/system/devconfigs/i18n/fr';
import { locale as devconfigsPortuguese } from 'app/main/system/devconfigs/i18n/pt';
import { locale as devconfigsSpanish } from 'app/main/system/devconfigs/i18n/sp';
import { DevConfigsDataSource } from "app/main/system/devconfigs/services/devconfigs.datasource";
import { DevConfigsService } from 'app/main/system/devconfigs/services/devconfigs.service';
import { DevConfigDetailService } from 'app/main/system/devconfigs/services/devconfig_detail.service';
import * as $ from 'jquery';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector     : 'system-devconfigs',
    templateUrl  : './devconfigs.component.html',
    styleUrls    : ['./devconfigs.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class DevConfigsComponent implements OnInit
{
    dataSource: DevConfigsDataSource;

    @Output()
    pageEvent: PageEvent;
   
    pageIndex= 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;

    devconfig: any;
    userConncode: string;
    userID: number;
    restrictValue: number;

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

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;
    
    constructor(
        private _systemDevConfigsService: DevConfigsService,
        private devconfigDetailService: DevConfigDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    )
    {
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).devconfigs;

        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(devconfigsEnglish, devconfigsSpanish, devconfigsFrench, devconfigsPortuguese);

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
           tap(() => this.dataSource.loadDevConfigs(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "DevConfig_TList"))
        )
        .subscribe( (res: any) => {
            
        });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }
   
    ngOnInit(): void
    {
        this.dataSource = new DevConfigsDataSource(this._systemDevConfigsService);
        this.dataSource.loadDevConfigs(this.userConncode, this.userID, this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "DevConfig_TList");
    }

    selectedFilter() {
        
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadDevConfigs(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "DevConfig_TList");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        
        this.dataSource.loadDevConfigs(this.userConncode, this.userID, pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "DevConfig_TList");
    }

    filterEvent() {
        this.selectedFilter();
    }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadDevConfigs(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "DevConfig_TList");
    }

    addNewDevConfig() {
        this.devconfigDetailService.devconfig_detail = '';
        localStorage.removeItem("devconfig_detail");
        this.router.navigate(['system/devconfigs/devconfig_detail']);
    }

    editShowDevConfigDetail(devconfig: any) {
        this.devconfigDetailService.devconfig_detail = devconfig;

        localStorage.setItem("devconfig_detail", JSON.stringify(devconfig));

        this.router.navigate(['system/devconfigs/devconfig_detail']);
    }
    
    deleteDevConfig(devconfig): void
    {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            devconfig, flag: this.flag
        };

        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if ( result )
            { 
                let deleteDevConfig =  this._systemDevConfigsService.devconfigList.findIndex((deletedevconfig: any) => deletedevconfig.id == devconfig.id);
        
                if (deleteDevConfig > -1) {
                    this._systemDevConfigsService.devconfigList.splice(deleteDevConfig, 1);
                    this.dataSource.devconfigsSubject.next(this._systemDevConfigsService.devconfigList);
                    this.dataSource.totalLength = this.dataSource.totalLength - 1;
                }  
            } else {
                
            }
        });
    }

    duplicateDevConfig(devconfig): void
    {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            devconfig, flag: this.flag
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
