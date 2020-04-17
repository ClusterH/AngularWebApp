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

import { UserProfilesService } from 'app/main/system/userprofiles/services/userprofiles.service';
import { UserProfilesDataSource } from "app/main/system/userprofiles/services/userprofiles.datasource";
import { UserProfileDetailService } from 'app/main/system/userprofiles/services/userprofile_detail.service';
import { AuthService } from 'app/authentication/services/authentication.service';


import {CourseDialogComponent} from "../dialog/dialog.component";
import { takeUntil } from 'rxjs/internal/operators';

import { locale as userprofilesEnglish } from 'app/main/system/userprofiles/i18n/en';
import { locale as userprofilesSpanish } from 'app/main/system/userprofiles/i18n/sp';
import { locale as userprofilesFrench } from 'app/main/system/userprofiles/i18n/fr';
import { locale as userprofilesPortuguese } from 'app/main/system/userprofiles/i18n/pt';
import { Route } from '@angular/compiler/src/core';

@Component({
    selector     : 'system-userprofiles',
    templateUrl  : './userprofiles.component.html',
    styleUrls    : ['./userprofiles.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class UserProfilesComponent implements OnInit
{
    dataSource: UserProfilesDataSource;

    @Output()
    pageEvent: PageEvent;
   
    pageIndex= 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;

    userprofile: any;
    userConncode: string;
    userID: number;

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
        private _adminUserProfilesService: UserProfilesService,
        private userprofileDetailService: UserProfileDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    )
    {
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;
        console.log(this.userConncode, this.userID);


        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(userprofilesEnglish, userprofilesSpanish, userprofilesFrench, userprofilesPortuguese);

        this.pageIndex= 0;
        this.pageSize = 25;
        this.selected = '';
        this.filter_string = '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngAfterViewInit() {
        console.log("ngAfterViewInit:");

        var node = $("div.page_index");
        var node_length = node.length;
        $("div.page_index").remove();
        $("button.mat-paginator-navigation-previous.mat-icon-button.mat-button-base").after(node[node_length - 1]);
   
        // when paginator event is invoked, retrieve the related data
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        console.log(this.paginator.pageSize);

        merge(this.sort.sortChange, this.paginator.page)
        .pipe(
           tap(() => this.dataSource.loadUserProfiles(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "UserProfile_TList"))
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

        this.dataSource = new UserProfilesDataSource(this._adminUserProfilesService);
        this.dataSource.loadUserProfiles(this.userConncode, this.userID, this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "UserProfile_TList");
    }

    onRowClicked(userprofile) {
        console.log('Row Clicked:', userprofile);
    }

    selectedFilter() {
        console.log(this.selected, this.filter_string);
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadUserProfiles(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "UserProfile_TList");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        console.log(pageIndex);
        this.dataSource.loadUserProfiles(this.userConncode, this.userID, pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "UserProfile_TList");
    }

    filterEvent() {
        this.selectedFilter();
    }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadUserProfiles(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "UserProfile_TList");
    }

    addNewUserProfile() {
        this.userprofileDetailService.userprofile_detail = '';
        localStorage.removeItem("userprofile_detail");
        this.router.navigate(['system/userprofiles/userprofile_detail']);
    }

    editShowUserProfileDetail(userprofile: any) {
        this.userprofileDetailService.userprofile_detail = userprofile;

        localStorage.setItem("userprofile_detail", JSON.stringify(userprofile));

        this.router.navigate(['system/userprofiles/userprofile_detail']);
    }
    
    deleteUserProfile(userprofile): void
    {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            userprofile, flag: this.flag
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

    duplicateUserProfile(userprofile): void
    {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';

        dialogConfig.disableClose = true;
        
        dialogConfig.data = {
            userprofile, flag: this.flag
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
