import { Component, ElementRef, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as pendingsEnglish } from 'app/main/logistic/maintenance/pendings/i18n/en';
import { locale as pendingsFrench } from 'app/main/logistic/maintenance/pendings/i18n/fr';
import { locale as pendingsPortuguese } from 'app/main/logistic/maintenance/pendings/i18n/pt';
import { locale as pendingsSpanish } from 'app/main/logistic/maintenance/pendings/i18n/sp';
import { PendingsDataSource } from "app/main/logistic/maintenance/pendings/services/pendings.datasource";
import { PendingsService } from 'app/main/logistic/maintenance/pendings/services/pendings.service';
import * as $ from 'jquery';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { AttendDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'logistic-pendings',
    templateUrl: './pendings.component.html',
    styleUrls: ['./pendings.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class PendingsComponent implements OnInit, OnDestroy {
    dataSource: PendingsDataSource;
    @Output() pageEvent: PageEvent;
    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;
    pending: any;
    restrictValue: any;
    dash_pending: string = '';
    dash_created: string = '';
    dash_postponed: string = '';
    flag: string = '';
    displayedColumns = [
        'id',
        'notifydate',
        'unit',
        'description',
        'maintevent',
    ];
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    private _unsubscribeAll: Subject<any>;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;

    constructor(
        private pendingsService: PendingsService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(pendingsEnglish, pendingsSpanish, pendingsFrench, pendingsPortuguese);
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
            .pipe(tap(() => this.dataSource.loadPendings(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintenancepending_TList")), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnInit(): void {
        this.dataSource = new PendingsDataSource(this.pendingsService);
        this.dataSource.loadPendings(this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "maintenancepending_TList");
        this.getDash();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getDash() {
        this.pendingsService.getDashboard().pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                this.dash_pending = res.TrackingXLAPI.DATA[0].pending;
                this.dash_created = res.TrackingXLAPI.DATA[0].created;
                this.dash_postponed = res.TrackingXLAPI.DATA[0].postponed;
            });
    }

    selectedFilter() {
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadPendings(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintenancepending_TList");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadPendings(pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintenancepending_TList");
    }

    filterEvent() { this.selectedFilter(); }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadPendings(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintenancepending_TList");
    }

    attendDetail(pending: any) {
        this.dialogRef = this._matDialog.open(AttendDialogComponent, {
            panelClass: 'attend-form-dialog',
            data: { attend: pending }
        });

        this.dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                // if ( !res ) {
                //     return;
                // }

                // this.pendingsService.saveAttendres)
                // .subscribe((result: any) => {
                //     if ((result.responseCode == 200)||(result.responseCode == 100)) {
                //         alert('Successfully saved');
                //     } else {
                //         alert("Failed save!")
                //     }
                // });

                // const formData: FormGroup = response[1];
            });
    }

}
