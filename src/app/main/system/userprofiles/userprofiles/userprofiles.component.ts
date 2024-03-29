import { Component, ElementRef, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as userprofilesEnglish } from 'app/main/system/userprofiles/i18n/en';
import { locale as userprofilesFrench } from 'app/main/system/userprofiles/i18n/fr';
import { locale as userprofilesPortuguese } from 'app/main/system/userprofiles/i18n/pt';
import { locale as userprofilesSpanish } from 'app/main/system/userprofiles/i18n/sp';
import { UserProfilesDataSource } from "app/main/system/userprofiles/services/userprofiles.datasource";
import { UserProfilesService } from 'app/main/system/userprofiles/services/userprofiles.service';
import { UserProfileDetailService } from 'app/main/system/userprofiles/services/userprofile_detail.service';
import * as $ from 'jquery';
import { merge, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'system-userprofiles',
    templateUrl: './userprofiles.component.html',
    styleUrls: ['./userprofiles.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class UserProfilesComponent implements OnInit, OnDestroy {
    dataSource: UserProfilesDataSource;
    @Output()
    pageEvent: PageEvent;
    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;
    userprofile: any;
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
        private _adminUserProfilesService: UserProfilesService,
        private userprofileDetailService: UserProfileDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).userprofiles;
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(userprofilesEnglish, userprofilesSpanish, userprofilesFrench, userprofilesPortuguese);
        this.pageIndex = 0;
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
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(tap(() => this.dataSource.loadUserProfiles(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "UserProfile_TList")), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnInit(): void {
        this.dataSource = new UserProfilesDataSource(this._adminUserProfilesService);
        this.dataSource.loadUserProfiles(this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "UserProfile_TList");
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
            this.dataSource.loadUserProfiles(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "UserProfile_TList");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadUserProfiles(pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "UserProfile_TList");
    }

    filterEvent() { this.selectedFilter(); }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadUserProfiles(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "UserProfile_TList");
    }

    addNewUserProfile() {
        this.router.navigate(['system/userprofiles/userprofile_detail']);
    }

    editShowUserProfileDetail(userprofile: any) {
        this.router.navigate(['system/userprofiles/userprofile_detail'], { queryParams: userprofile });
    }

    deleteUserProfile(userprofile): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';
        dialogConfig.disableClose = true;
        dialogConfig.data = { userprofile, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                let deleteUserProfile = this._adminUserProfilesService.userprofileList.findIndex((deleteduserprofile: any) => deleteduserprofile.id == userprofile.id);
                if (deleteUserProfile > -1) {
                    this._adminUserProfilesService.userprofileList.splice(deleteUserProfile, 1);
                    this.dataSource.userprofilesSubject.next(this._adminUserProfilesService.userprofileList);
                    this.dataSource.totalLength = this.dataSource.totalLength - 1;
                }
            }
        });
    }

    duplicateUserProfile(userprofile): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';
        dialogConfig.disableClose = true;
        dialogConfig.data = { userprofile, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                this.router.navigate(['system/userprofiles/userprofile_detail'], { queryParams: userprofile });
            }
        });
    }
}