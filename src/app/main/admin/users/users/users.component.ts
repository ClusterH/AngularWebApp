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

import { UsersService } from 'app/main/admin/users/services/users.service';
import { UsersDataSource } from "app/main/admin/users/services/users.datasource";
import { UserDetailService } from 'app/main/admin/users/services/user_detail.service';
import { AuthService } from 'app/authentication/services/authentication.service';


import {CourseDialogComponent} from "../dialog/dialog.component";
import { takeUntil } from 'rxjs/internal/operators';

import { locale as usersEnglish } from 'app/main/admin/users/i18n/en';
import { locale as usersSpanish } from 'app/main/admin/users/i18n/sp';
import { locale as usersFrench } from 'app/main/admin/users/i18n/fr';
import { locale as usersPortuguese } from 'app/main/admin/users/i18n/pt';
import { Route } from '@angular/compiler/src/core';

@Component({
    selector     : 'admin-users',
    templateUrl  : './users.component.html',
    styleUrls    : ['./users.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit
{
    dataSource: UsersDataSource;

    @Output()
    pageEvent: PageEvent;
   
    pageIndex= 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;

    user: any;
    userConncode: string;
    userID: number;

    flag: string = '';
    displayedColumns = [
        'id',
        'name',
        'email',
        'password',
        'userprofile',
        'timezone',
        'lengthunit',
        'fuelunit',
        'weightunit',
        'tempunit',
        'isactive',
        'company',
        'group',
        'subgroup',
        'created',
        'createdbyname',
        'deletedwhen',
        'deletedbyname', 
        'lastmodifieddate',
        'lastmodifiedbyname',
        'language'
    ];

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;
    
    constructor(
        private _adminUsersService: UsersService,
        private userDetailService: UserDetailService,
        private authService: AuthService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    )
    {
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;
        console.log(this.userConncode, this.userID);


        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(usersEnglish, usersSpanish, usersFrench, usersPortuguese);

        this.pageIndex= 0;
        this.pageSize = 25;
        this.selected = '';
        this.filter_string = '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngAfterViewInit() {
        console.log("ngAfterViewInit:user");

        var node = $("div.page_index");
        var node_length = node.length;
        $("div.page_index").remove();
        $("button.mat-paginator-navigation-previous.mat-icon-button.mat-button-base").after(node[node_length - 1]);
   
        // when paginator event is invoked, retrieve the related data
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        console.log(this.paginator.pageSize);

        merge(this.sort.sortChange, this.paginator.page)
        .pipe(
           tap(() => this.dataSource.loadUsers(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "User_Tlist"))
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

        this.dataSource = new UsersDataSource(this._adminUsersService);
        this.dataSource.loadUsers(this.userConncode, this.userID, this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "User_TList");
    }

    onRowClicked(user) {
        console.log('Row Clicked:', user);
    }

    selectedFilter() {
        console.log(this.selected, this.filter_string);
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadUsers(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "User_Tlist");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        console.log(pageIndex);
        this.dataSource.loadUsers(this.userConncode, this.userID, pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "User_Tlist");
    }

    filterEvent() {
        this.selectedFilter();
    }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadUsers(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "User_Tlist");
    }

    addNewUser() {
        this.userDetailService.user_detail = '';
        localStorage.removeItem("user_detail");
        this.router.navigate(['admin/users/user_detail']);
    }

    editShowUserDetail(user: any) {
        this.userDetailService.user_detail = user;

        localStorage.setItem("user_detail", JSON.stringify(user));

        this.router.navigate(['admin/users/user_detail']);
    }
    
    deleteUser(user): void
    {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            user, flag: this.flag
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

    duplicateUser(user): void
    {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            user, flag: this.flag
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
