import { Component, ElementRef, OnInit, OnDestroy, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as tanksEnglish } from 'app/main/fuelmanagement/tanks/i18n/en';
import { locale as tanksFrench } from 'app/main/fuelmanagement/tanks/i18n/fr';
import { locale as tanksPortuguese } from 'app/main/fuelmanagement/tanks/i18n/pt';
import { locale as tanksSpanish } from 'app/main/fuelmanagement/tanks/i18n/sp';
import { TanksDataSource } from "app/main/fuelmanagement/tanks/services/tanks.datasource";
import { TanksService } from 'app/main/fuelmanagement/tanks/services/tanks.service';
import { TankDetailService } from 'app/main/fuelmanagement/tanks/services/tank_detail.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'fuelmanagement-tanks',
    templateUrl: './tanks.component.html',
    styleUrls: ['./tanks.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class TanksComponent implements OnInit, OnDestroy {
    animationDirection: 'left' | 'right' | 'none';
    currentStep: number;
    dataSource: TanksDataSource;

    @Output()
    pageEvent: PageEvent;
    userObjectList: any;
    pageIndex = 0;
    pageSize = 1;
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;
    tank: any[];
    flag: string = '';
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    private _unsubscribeAll: Subject<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;

    constructor(
        public tanksService: TanksService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this.userObjectList = JSON.parse(localStorage.getItem('userObjectList'));
        this.animationDirection = 'none';
        this.currentStep = 0;
        this._fuseTranslationLoaderService.loadTranslations(tanksEnglish, tanksSpanish, tanksFrench, tanksPortuguese);
        this.selected = '';
        this.filter_string = '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    ngOnInit(): void {
        this.dataSource = new TanksDataSource(this.tanksService);
        this.dataSource.loadTanks(this.currentStep, 1, "id", "asc", this.selected, this.filter_string, "FuelTank_TList");
    }

    ngAfterViewInit() { }
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    selectedFilter() {
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.dataSource.loadTanks(0, 1, 'id', 'asc', this.selected, this.filter_string, "FuelTank_TList");
            this.currentStep = 0;
        }
    }

    filterEvent() { this.selectedFilter(); }
    addNewTank() {
        this.router.navigate(['fuelmanagement/tanks/tank_detail_edit']);
    }

    gotoNextStep(): void {
        if (this.currentStep === this.dataSource.total_page - 1) {
            return;
        }
        this.currentStep++;
        this.dataSource.loadTanks(this.currentStep, 1, 'id', 'asc', this.selected, this.filter_string, "FuelTank_TList");
    }

    gotoPreviousStep(): void {
        if (this.currentStep === 0) {
            return;
        }
        this.currentStep--;
        this.dataSource.loadTanks(this.currentStep, this.pageSize, 'id', 'asc', this.selected, this.filter_string, "FuelTank_TList");
    }

    tankDetail(tank: any) {
        this.router.navigate(['fuelmanagement/tanks/tank_detail'], { queryParams: tank });
    }

    tankDetailEdit(tank: any) {
        this.router.navigate(['fuelmanagement/tanks/tank_detail_edit'], { queryParams: tank });
    }
}