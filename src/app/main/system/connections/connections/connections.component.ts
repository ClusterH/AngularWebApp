import { Component, ElementRef, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as connectionsEnglish } from 'app/main/system/connections/i18n/en';
import { locale as connectionsFrench } from 'app/main/system/connections/i18n/fr';
import { locale as connectionsPortuguese } from 'app/main/system/connections/i18n/pt';
import { locale as connectionsSpanish } from 'app/main/system/connections/i18n/sp';
import { ConnectionsDataSource } from "app/main/system/connections/services/connections.datasource";
import { ConnectionsService } from 'app/main/system/connections/services/connections.service';
import { ConnectionDetailService } from 'app/main/system/connections/services/connection_detail.service';
import * as $ from 'jquery';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector     : 'system-connections',
    templateUrl  : './connections.component.html',
    styleUrls    : ['./connections.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ConnectionsComponent implements OnInit
{
    dataSource: ConnectionsDataSource;

    @Output()
    pageEvent: PageEvent;
   
    pageIndex= 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;

    connection: any;
    userConncode: string;
    userID: number;
    restrictValue: number;

    flag: string = '';
    displayedColumns = [
        'id',
        'name',
        'conntype',
        'localport',
        'protocol',
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
        private _systemConnectionsService: ConnectionsService,
        private connectionDetailService: ConnectionDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    )
    {
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).connections;

        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(connectionsEnglish, connectionsSpanish, connectionsFrench, connectionsPortuguese);

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
           tap(() => this.dataSource.loadConnections(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Connection_Tlist"))
        )
        .subscribe( (res: any) => {
            
        });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }
   
    ngOnInit(): void
    {
        this.dataSource = new ConnectionsDataSource(this._systemConnectionsService);
        this.dataSource.loadConnections(this.userConncode, this.userID, this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "Connection_Tlist");
    }

    selectedFilter() {
        
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadConnections(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Connection_Tlist");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        
        this.dataSource.loadConnections(this.userConncode, this.userID, pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Connection_Tlist");
    }

    filterEvent() {
        this.selectedFilter();
    }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadConnections(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Connection_Tlist");
    }

    addNewConnection() {
        this.connectionDetailService.connection_detail = '';
        localStorage.removeItem("connection_detail");
        this.router.navigate(['system/connections/connection_detail']);
    }

    editShowConnectionDetail(connection: any) {
        this.connectionDetailService.connection_detail = connection;

        localStorage.setItem("connection_detail", JSON.stringify(connection));

        this.router.navigate(['system/connections/connection_detail']);
    }
    
    deleteConnection(connection: any): void
    {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            connection, flag: this.flag
        };

        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if ( result )
            { 
                let deleteConnection =  this._systemConnectionsService.connectionList.findIndex((deletedconnection: any) => deletedconnection.id == connection.id);
        
                if (deleteConnection > -1) {
                    this._systemConnectionsService.connectionList.splice(deleteConnection, 1);
                    this.dataSource.connectionsSubject.next(this._systemConnectionsService.connectionList);
                    this.dataSource.totalLength = this.dataSource.totalLength - 1;
                }  
            } else {
                
            }
        });
    }

    duplicateConnection(connection: any): void
    {
        

        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            connection, flag: this.flag
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
