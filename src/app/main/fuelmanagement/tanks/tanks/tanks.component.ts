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

import { TanksService } from 'app/main/fuelmanagement/tanks/services/tanks.service';
import { TanksDataSource } from "app/main/fuelmanagement/tanks/services/tanks.datasource";
import { TankDetailService } from 'app/main/fuelmanagement/tanks/services/tank_detail.service';
import { AuthService } from 'app/authentication/services/authentication.service';

import {CourseDialogComponent} from "../dialog/dialog.component";
import { takeUntil } from 'rxjs/internal/operators';

import { locale as tanksEnglish } from 'app/main/fuelmanagement/tanks/i18n/en';
import { locale as tanksSpanish } from 'app/main/fuelmanagement/tanks/i18n/sp';
import { locale as tanksFrench } from 'app/main/fuelmanagement/tanks/i18n/fr';
import { locale as tanksPortuguese } from 'app/main/fuelmanagement/tanks/i18n/pt';
import { Route } from '@angular/compiler/src/core';

@Component({
    selector     : 'fuelmanagement-tanks',
    templateUrl  : './tanks.component.html',
    styleUrls    : ['./tanks.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class TanksComponent implements OnInit
{
    animationDirection: 'left' | 'right' | 'none';
    currentStep: number;

    dataSource: TanksDataSource;

    @Output()
    pageEvent: PageEvent;
   
    userObjectList: any;
    pageIndex= 0;
    pageSize = 1;
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;

    tank: any[];

    userConncode: string;
    userID: number;

    flag: string = '';

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;
    
    constructor(
        public tanksService: TanksService,
        private tankDetailService: TankDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    )
    {
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;
        this.userObjectList = JSON.parse(localStorage.getItem('userObjectList'));

        this.animationDirection = 'none';
        this.currentStep = 0;

        console.log(this.userConncode, this.userID, this.userObjectList);


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
    ngOnInit(): void
    {
        console.log(this.pageSize, this.pageIndex);

        this.dataSource = new TanksDataSource(this.tanksService);
        this.dataSource.loadTanks(this.userConncode, this.userID, this.currentStep, 1, "id", "asc", this.selected, this.filter_string, "FuelTank_TList");
    }

    ngAfterViewInit() {
        console.log("ngAfterViewInit:");
    }

    selectedFilter() {
        console.log(this.selected, this.filter_string);
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.dataSource.loadTanks(this.userConncode, this.userID, 0, 1, 'id', 'asc', this.selected, this.filter_string, "FuelTank_TList");
            this.currentStep = 0;
        }
    }

    filterEvent() {
        this.selectedFilter();
    }
   
    addNewTank() {
        this.tankDetailService.tank_detail = '';
        localStorage.removeItem("tank_detail");
        this.router.navigate(['admin/tanks/tank_detail']);
    }

    /**
     * Go to next step
     */
    gotoNextStep(): void
    {
        if ( this.currentStep === this.dataSource.total_page - 1 )
        {
            return;
        }

        this.currentStep++;

        this.dataSource.loadTanks(this.userConncode, this.userID, this.currentStep, 1, 'id', 'asc', this.selected, this.filter_string, "FuelTank_TList");

        // Increase the current step
    }

    /**
     * Go to previous step
     */
    gotoPreviousStep(): void
    {
        if ( this.currentStep === 0 )
        {
            return;
        }

        this.currentStep--;

        this.dataSource.loadTanks(this.userConncode, this.userID, this.currentStep, this.pageSize, 'id', 'asc', this.selected, this.filter_string, "FuelTank_TList");

        // Decrease the current step
    }

    tankDetail(tank: any) {
        localStorage.setItem("tank_detail", JSON.stringify(tank));

        this.router.navigate(['fuelmanagement/tanks/tank_detail']);
    }
}
