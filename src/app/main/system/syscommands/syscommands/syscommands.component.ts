import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Output, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { SysCommandsService } from 'app/main/system/syscommands/services/syscommands.service';
import { SysCommandsDataSource } from "app/main/system/syscommands/services/syscommands.datasource";
import { SysCommandDetailService } from 'app/main/system/syscommands/services/syscommand_detail.service';
import { AuthService } from 'app/authentication/services/authentication.service';


import {CourseDialogComponent} from "../dialog/dialog.component";
import { takeUntil } from 'rxjs/internal/operators';

import { locale as syscommandsEnglish } from 'app/main/system/syscommands/i18n/en';
import { locale as syscommandsSpanish } from 'app/main/system/syscommands/i18n/sp';
import { locale as syscommandsFrench } from 'app/main/system/syscommands/i18n/fr';
import { locale as syscommandsPortuguese } from 'app/main/system/syscommands/i18n/pt';
import { Route } from '@angular/compiler/src/core';

@Component({
    selector     : 'system-syscommands',
    templateUrl  : './syscommands.component.html',
    styleUrls    : ['./syscommands.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class SysCommandsComponent implements OnInit
{
    dataSource: SysCommandsDataSource;

    @Output()
    pageEvent: PageEvent;
   
    pageIndex= 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;

    syscommand: any;
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
        private _systemSysCommandsService: SysCommandsService,
        private syscommandDetailService: SysCommandDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    )
    {
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).syscommands;

        


        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(syscommandsEnglish, syscommandsSpanish, syscommandsFrench, syscommandsPortuguese);

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
           tap(() => this.dataSource.loadSysCommands(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "SysCommand_TList"))
        )
        .subscribe( (res: any) => {
            
        });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }
   
    ngOnInit(): void
    {
        

        this.dataSource = new SysCommandsDataSource(this._systemSysCommandsService);
        this.dataSource.loadSysCommands(this.userConncode, this.userID, this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "SysCommand_TList");
    }

    onRowClicked(syscommand) {
        
    }

    selectedFilter() {
        
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadSysCommands(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "SysCommand_TList");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        
        this.dataSource.loadSysCommands(this.userConncode, this.userID, pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "SysCommand_TList");
    }

    filterEvent() {
        this.selectedFilter();
    }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadSysCommands(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "SysCommand_TList");
    }

    addNewSysCommand() {
        this.syscommandDetailService.syscommand_detail = '';
        localStorage.removeItem("syscommand_detail");
        this.router.navigate(['system/syscommands/syscommand_detail']);
    }

    editShowSysCommandDetail(syscommand: any) {
        this.syscommandDetailService.syscommand_detail = syscommand;

        localStorage.setItem("syscommand_detail", JSON.stringify(syscommand));

        this.router.navigate(['system/syscommands/syscommand_detail']);
    }
    
    deleteSysCommand(syscommand): void
    {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            syscommand, flag: this.flag
        };

        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if ( result )
            { 
                
            } else {
                
            }
        });
    }

    duplicateSysCommand(syscommand): void
    {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            syscommand, flag: this.flag
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
