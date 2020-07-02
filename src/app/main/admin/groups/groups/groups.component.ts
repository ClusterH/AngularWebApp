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

import { GroupsService } from 'app/main/admin/groups/services/groups.service';
import { GroupsDataSource } from "app/main/admin/groups/services/groups.datasource";
import { GroupDetailService } from 'app/main/admin/groups/services/group_detail.service';
import { AuthService } from 'app/authentication/services/authentication.service';

import {CourseDialogComponent} from "../dialog/dialog.component";

import { locale as groupsEnglish } from 'app/main/admin/groups/i18n/en';
import { locale as groupsSpanish } from 'app/main/admin/groups/i18n/sp';
import { locale as groupsFrench } from 'app/main/admin/groups/i18n/fr';
import { locale as groupsPortuguese } from 'app/main/admin/groups/i18n/pt';

@Component({
    selector     : 'admin-groups',
    templateUrl  : './groups.component.html',
    styleUrls    : ['./groups.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class GroupsComponent implements OnInit
{
    dataSource: GroupsDataSource;

    @Output()
    pageEvent: PageEvent;
   
    pageIndex= 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;

    group: any;
    userConncode: string;
    userID: number;
    restrictValue: number;

    flag: string = '';
    displayedColumns = [
        'id',
        'name',
        'email',
        'contactname',
        'contactphone',
        'address',
        'company',
        'account',
        'created',
        'createdbyname',
        'deletedwhen',
        'deletedbyname', 
        'lastmodifieddate',
        'lastmodifiedbyname',
    ];

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;
    
    constructor(
        private _adminGroupsService: GroupsService,
        private groupDetailService: GroupDetailService,
        private authService: AuthService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    )
    {
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).groups;

        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(groupsEnglish, groupsSpanish, groupsFrench, groupsPortuguese);

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
           tap(() => this.dataSource.loadGroups(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Group_Tlist"))
        )
        .subscribe( (res: any) => {
            
        });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }
   
    ngOnInit(): void
    {
        this.dataSource = new GroupsDataSource(this._adminGroupsService);
        this.dataSource.loadGroups(this.userConncode, this.userID, this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "Group_Tlist");
    }

    selectedFilter() {
        
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadGroups(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Group_Tlist");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        
        this.dataSource.loadGroups(this.userConncode, this.userID, pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Group_Tlist");
    }

    filterEvent() {
        this.selectedFilter();
    }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadGroups(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Group_Tlist");
    }

    addNewGroup() {
        this.groupDetailService.group_detail = '';
        localStorage.removeItem("group_detail");
        this.router.navigate(['admin/groups/group_detail']);
    }

    editShowGroupDetail(group: any) {
        this.groupDetailService.group_detail = group;

        localStorage.setItem("group_detail", JSON.stringify(group));

        this.router.navigate(['admin/groups/group_detail']);
    }
    
    deleteGroup(group): void
    {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            group, flag: this.flag
        };

        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if ( result )
            { 
                let deleteGroup =  this._adminGroupsService.groupList.findIndex((deletedgroup: any) => deletedgroup.id == group.id);
        
                if (deleteGroup > -1) {
                    this._adminGroupsService.groupList.splice(deleteGroup, 1);
                    this.dataSource.groupsSubject.next(this._adminGroupsService.groupList);
                    this.dataSource.totalLength = this.dataSource.totalLength - 1;
                }  
            } else {
                
            }
        });
    }

    duplicateGroup(group): void
    {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            group, flag: this.flag
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
