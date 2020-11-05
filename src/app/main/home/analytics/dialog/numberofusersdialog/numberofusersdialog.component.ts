import { Component, Inject, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VehiclesDataSource } from "app/main/home/analytics/services/numberofvehicles.datasource";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';
import { locale as vehiclesEnglish } from 'app/main/home/analytics/i18n/en';
import { locale as vehiclesFrench } from 'app/main/home/analytics/i18n/fr';
import { locale as vehiclesPortuguese } from 'app/main/home/analytics/i18n/pt';
import { locale as vehiclesSpanish } from 'app/main/home/analytics/i18n/sp';
import { ClipsService } from 'app/main/home/analytics/services/clips.service';
import * as $ from 'jquery';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'clip-numberofusersdialog',
    templateUrl: './numberofusersdialog.component.html',
    styleUrls: ['./numberofusersdialog.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class NumberOfUsersDialogComponent implements OnInit, OnDestroy {
    detail: any; flag: any;
    displayedColumns = ['name', 'email', 'userprofile', 'timezone'];
    dataSource: VehiclesDataSource;
    @Output()
    pageEvent: PageEvent;
    pageIndex = 0;
    pageSize = 15;
    pageSizeOptions: number[] = [5, 10, 15];
    index_number: number = 1;

    private _unsubscribeAll: Subject<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private clipService: ClipsService,
        private dialogRef: MatDialogRef<NumberOfUsersDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { detail, flag }
    ) {
        this._unsubscribeAll = new Subject();
        this.pageIndex = 0;
        this.pageSize = 15;
        this._fuseTranslationLoaderService.loadTranslations(vehiclesEnglish, vehiclesSpanish, vehiclesFrench, vehiclesPortuguese);
        this.dataSource = new VehiclesDataSource(this.clipService);
        this.flag = flag;
    }
    ngOnInit(): void {
        this.dataSource.loadVehicles(this.pageIndex, this.pageSize, "id", "asc", "clip_numberofusers_detail");
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
    }
    ngAfterViewInit(): void {
        var node = $("div.page_index");
        var node_length = node.length;
        $("div.page_index").remove();
        $("button.mat-paginator-navigation-previous.mat-icon-button.mat-button-base").after(node[node_length - 1]);
        // when paginator event is invoked, retrieve the related data
        this.sort.sortChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => this.paginator.pageIndex = 0);
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(tap(() => this.dataSource.loadVehicles(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, "clip_numberofvehicles_detail")), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadVehicles(pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, "clip_numberofusers_detail");
    }

    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadVehicles(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, "clip_numberofusers_detail");
    }


    // this.dialogRef.close(this.vehicle);


    close() { this.dialogRef.close('save'); }
    goback() { this.dialogRef.close('cancel'); }
}