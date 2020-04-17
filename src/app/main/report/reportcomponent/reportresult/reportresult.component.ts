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

import { ReportResultService } from 'app/main/report/reportcomponent/services/reportresult.service';
import { ReportResultDataSource } from "app/main/report/reportcomponent/services/reportresult.datasource";
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
    selector     : 'report-reportresult',
    templateUrl  : './reportresult.component.html',
    styleUrls    : ['./reportresult.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ReportResultComponent implements OnInit
{
    dataSource: ReportResultDataSource;
    entered_report_params: any;

    @Output()
    pageEvent: PageEvent;
   
    pageIndex= 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    index_number: number = 1;
    currentUser: any;

    user: any;
    userConncode: string;
    userID: number;

    flag: string = '';
    // displayedColumns = [];

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;
    
    constructor(
        private reportResultService: ReportResultService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    )
    {
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;
        console.log(this.userConncode, this.userID);

        this.entered_report_params = JSON.parse(localStorage.getItem('report_result'));
        console.log(this.entered_report_params);

        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(usersEnglish, usersSpanish, usersFrench, usersPortuguese);

        this.pageIndex= 0;
        this.pageSize = 25;
        this.selected = '';
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
        // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        console.log(this.paginator.pageSize);

        merge(this.paginator.page)
        .pipe(
           tap(() =>{
               console.log("afterviewInit");
                this.dataSource = new ReportResultDataSource(this.reportResultService);
                this.dataSource.loadReportResult(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize);
           })
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

        this.dataSource = new ReportResultDataSource(this.reportResultService);
        setTimeout(() => {
            this.dataSource.loadReportResult(this.userConncode, this.userID, this.pageIndex, this.pageSize);
        });
    }

    onRowClicked(user) {
        console.log('Row Clicked:', user);
    }

    // selectedFilter() {
    //     console.log(this.selected, this.filter_string);
    //     if (this.selected == '') {
    //         alert("Please choose Field for filter!");
    //     } else {
    //         this.paginator.pageIndex = 0;
    //         this.dataSource.loadReportResult(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize);
    //     }
    // }

    // actionPageIndexbutton(pageIndex: number) {
    //     console.log(pageIndex);
    //     // this.dataSource.loadUsers(this.userConncode, this.userID, pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "User_Tlist");
    // }

    // filterEvent() {
    //     this.selectedFilter();
    // }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadReportResult(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize);
    }
}
