import { Component, ElementRef, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as usersEnglish } from 'app/main/admin/users/i18n/en';
import { locale as usersFrench } from 'app/main/admin/users/i18n/fr';
import { locale as usersPortuguese } from 'app/main/admin/users/i18n/pt';
import { locale as usersSpanish } from 'app/main/admin/users/i18n/sp';
import { UsersDataSource } from "app/main/admin/users/services/users.datasource";
import { UsersService } from 'app/main/admin/users/services/users.service';
import { UserDetailService } from 'app/main/admin/users/services/user_detail.service';
import * as $ from 'jquery';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'admin-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit, OnDestroy {
    dataSource: UsersDataSource;

    @Output()
    pageEvent: PageEvent;
    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;
    user: any;
    userConncode: string;
    userID: number;
    restrictValue: any;
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
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;

    constructor(
        private _adminUsersService: UsersService,
        private userDetailService: UserDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).users;
        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(usersEnglish, usersSpanish, usersFrench, usersPortuguese);

        this.pageIndex = 0;
        this.pageSize = 25;
        this.selected = '';
        this.filter_string = '';
    }

    ngOnInit(): void {
        this.dataSource = new UsersDataSource(this._adminUsersService);
        this.dataSource.loadUsers(this.userConncode, this.userID, this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "User_TList");
    }

    ngAfterViewInit() {
        var node = $("div.page_index");
        var node_length = node.length;
        $("div.page_index").remove();
        $("button.mat-paginator-navigation-previous.mat-icon-button.mat-button-base").after(node[node_length - 1]);
        // when paginator event is invoked, retrieve the related data
        this.sort.sortChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => this.paginator.pageIndex = 0);
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(tap(() => this.dataSource.loadUsers(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "User_Tlist")), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    selectedFilter() {
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadUsers(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "User_Tlist");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadUsers(this.userConncode, this.userID, pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "User_Tlist");
    }

    filterEvent() { this.selectedFilter(); }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadUsers(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "User_Tlist");
    }

    addNewUser() {
        // this.userDetailService.user_detail = '';
        // localStorage.removeItem("user_detail");
        this.router.navigate(['admin/users/user_detail']);
    }

    editShowUserDetail(user: any) {
        // this.userDetailService.user_detail = user;
        // localStorage.setItem("user_detail", JSON.stringify(user));
        this.router.navigate(['admin/users/user_detail'], { queryParams: user });
    }

    deleteUser(user): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';
        dialogConfig.disableClose = true;
        dialogConfig.data = { user, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                let deleteUser = this._adminUsersService.userList.findIndex((deleteduser: any) => deleteduser.id == user.id);
                if (deleteUser > -1) {
                    this._adminUsersService.userList.splice(deleteUser, 1);
                    this.dataSource.usersSubject.next(this._adminUsersService.userList);
                    this.dataSource.totalLength = this.dataSource.totalLength - 1;
                }
            }
        });
    }

    duplicateUser(user): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';
        dialogConfig.disableClose = true;
        dialogConfig.data = { user, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(user => {
            if (user) { this.router.navigate(['admin/users/user_detail'], { queryParams: user }); }
        });
    }
}
