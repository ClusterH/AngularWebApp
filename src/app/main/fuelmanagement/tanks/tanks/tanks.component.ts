import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Output, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

import { fromEvent, merge, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, map, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { TanksService } from 'app/main/fuelmanagement/tanks/services/tanks.service';
import { TanksDataSource } from "app/main/fuelmanagement/tanks/services/tanks.datasource";
import { TankDetailService } from 'app/main/fuelmanagement/tanks/services/tank_detail.service';
import { AuthService } from 'app/authentication/services/authentication.service';

import { CourseDialogComponent } from "../dialog/dialog.component";
import { locale as tanksEnglish } from 'app/main/fuelmanagement/tanks/i18n/en';
import { locale as tanksSpanish } from 'app/main/fuelmanagement/tanks/i18n/sp';
import { locale as tanksFrench } from 'app/main/fuelmanagement/tanks/i18n/fr';
import { locale as tanksPortuguese } from 'app/main/fuelmanagement/tanks/i18n/pt';
import { Route } from '@angular/compiler/src/core';

@Component({
    selector: 'fuelmanagement-tanks',
    templateUrl: './tanks.component.html',
    styleUrls: ['./tanks.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class TanksComponent implements OnInit {
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
        private tankDetailService: TankDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this.userObjectList = JSON.parse(localStorage.getItem('userObjectList'));
        this.animationDirection = 'none';
        this.currentStep = 0;

        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(tanksEnglish, tanksSpanish, tanksFrench, tanksPortuguese);
        // this.pageIndex= 0;
        // this.pageSize = 25;
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
        this.tankDetailService.tank_detail = '';
        // localStorage.removeItem("tank_detail");
        this.router.navigate(['fuelmanagement/tanks/tank_detail_edit']);
    }

    /**
     * Go to next step
     */
    gotoNextStep(): void {
        if (this.currentStep === this.dataSource.total_page - 1) {
            return;
        }

        this.currentStep++;

        this.dataSource.loadTanks(this.currentStep, 1, 'id', 'asc', this.selected, this.filter_string, "FuelTank_TList");

        // Increase the current step
    }

    /**
     * Go to previous step
     */
    gotoPreviousStep(): void {
        if (this.currentStep === 0) {
            return;
        }

        this.currentStep--;

        this.dataSource.loadTanks(this.currentStep, this.pageSize, 'id', 'asc', this.selected, this.filter_string, "FuelTank_TList");

        // Decrease the current step
    }

    tankDetail(tank: any) {
        this.router.navigate(['fuelmanagement/tanks/tank_detail'], { queryParams: tank });
    }

    tankDetailEdit(tank: any) {
        this.router.navigate(['fuelmanagement/tanks/tank_detail_edit'], { queryParams: tank });
    }
}
