import { Component, ElementRef, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as operatorsEnglish } from 'app/main/admin/operators/i18n/en';
import { locale as operatorsFrench } from 'app/main/admin/operators/i18n/fr';
import { locale as operatorsPortuguese } from 'app/main/admin/operators/i18n/pt';
import { locale as operatorsSpanish } from 'app/main/admin/operators/i18n/sp';
import { OperatorsDataSource } from "app/main/admin/operators/services/operators.datasource";
import { OperatorsService } from 'app/main/admin/operators/services/operators.service';
import { OperatorDetailService } from 'app/main/admin/operators/services/operator_detail.service';
import * as $ from 'jquery';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'admin-operators',
    templateUrl: './operators.component.html',
    styleUrls: ['./operators.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class OperatorsComponent implements OnInit {
    dataSource: OperatorsDataSource;
    @Output()
    pageEvent: PageEvent;
    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;
    operator: any;
    restrictValue: any;
    flag: string = '';
    displayedColumns = [
        'id',
        'name',
        'email',
        'password',
        'phonenumber',
        'operatortype',
        'company',
        'group',
        'subgroup',
        'created',
        'createdbyname',
        'deletedwhen',
        'deletedbyname',
        'lastmodifieddate',
        'lastmodifiedbyname',
        'birthdate',
        'hiredate',
        'physicaltestexpirydate',
        'licenseexpirationdate',
        'driverlicensenumber'
    ];

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    private _unsubscribeAll: Subject<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;

    constructor(
        private _adminOperatorsService: OperatorsService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).operators;

        this._fuseTranslationLoaderService.loadTranslations(operatorsEnglish, operatorsSpanish, operatorsFrench, operatorsPortuguese);
        this.pageIndex = 0;
        this.pageSize = 25;
        this.selected = '';
        this.filter_string = '';
    }
    ngAfterViewInit() {
        var node = $("div.page_index");
        var node_length = node.length;
        $("div.page_index").remove();
        $("button.mat-paginator-navigation-previous.mat-icon-button.mat-button-base").after(node[node_length - 1]);
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(tap(() => this.dataSource.loadOperators(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Operator_Tlist")), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnInit(): void {
        this.dataSource = new OperatorsDataSource(this._adminOperatorsService);
        this.dataSource.loadOperators(this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "Operator_Tlist");
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
            this.dataSource.loadOperators(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Operator_Tlist");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadOperators(pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Operator_Tlist");
    }

    filterEvent() { this.selectedFilter(); }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadOperators(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Operator_Tlist");
    }

    addNewOperator() {
        this.router.navigate(['admin/operators/operator_detail']);
    }

    editShowOperatorDetail(operator: any) {
        this.router.navigate(['admin/operators/operator_detail'], { queryParams: operator });
    }

    deleteOperator(operator): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';
        dialogConfig.disableClose = true;
        dialogConfig.data = { operator, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                let deleteVehicle = this._adminOperatorsService.operatorList.findIndex((deletedoperator: any) => deletedoperator.id == operator.id);
                if (deleteVehicle > -1) {
                    this._adminOperatorsService.operatorList.splice(deleteVehicle, 1);
                    this.dataSource.operatorsSubject.next(this._adminOperatorsService.operatorList);
                }
            }
        });
    }

    duplicateOperator(operator): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';
        dialogConfig.disableClose = true;
        dialogConfig.data = { operator, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                this.router.navigate(['admin/operators/operator_detail'], { queryParams: result });
            }
        });
    }
}