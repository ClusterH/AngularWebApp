import { Component, ElementRef, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as modelsEnglish } from 'app/main/admin/models/i18n/en';
import { locale as modelsFrench } from 'app/main/admin/models/i18n/fr';
import { locale as modelsPortuguese } from 'app/main/admin/models/i18n/pt';
import { locale as modelsSpanish } from 'app/main/admin/models/i18n/sp';
import { ModelsDataSource } from "app/main/admin/models/services/models.datasource";
import { ModelsService } from 'app/main/admin/models/services/models.service';
import { ModelDetailService } from 'app/main/admin/models/services/model_detail.service';
import * as $ from 'jquery';
import { merge, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'admin-models',
    templateUrl: './models.component.html',
    styleUrls: ['./models.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ModelsComponent implements OnInit {
    dataSource: ModelsDataSource;
    @Output()
    pageEvent: PageEvent;
    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;
    model: any;
    restrictValue: any;
    flag: string = '';
    displayedColumns = [
        'id',
        'name',
        'make',
        'createdwhen',
        'createdbyname',
        'deletedwhen',
        'deletedbyname',
        'lastmodifieddate',
        'lastmodifiedbyname',
        'tireconfiguration'
    ];
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    private _unsubscribeAll: Subject<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;

    constructor(
        private _adminModelsService: ModelsService,
        private modelDetailService: ModelDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).models;
        this._fuseTranslationLoaderService.loadTranslations(modelsEnglish, modelsSpanish, modelsFrench, modelsPortuguese);
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
            .pipe(tap(() => this.dataSource.loadModels(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Model_TList")), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnInit(): void {
        this.dataSource = new ModelsDataSource(this._adminModelsService);
        this.dataSource.loadModels(this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "Model_TList");
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
            this.dataSource.loadModels(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Model_TList");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadModels(pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Model_TList");
    }

    filterEvent() { this.selectedFilter(); }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadModels(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Model_TList");
    }

    addNewModel() {
        this.router.navigate(['admin/models/model_detail']);
    }

    editShowModelDetail(model: any) {
        this.router.navigate(['admin/models/model_detail'], { queryParams: model });
    }

    deleteModel(model): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';
        dialogConfig.disableClose = true;
        dialogConfig.data = { model, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                let deleteModel = this._adminModelsService.modelList.findIndex((deletedmodel: any) => deletedmodel.id == model.id);
                if (deleteModel > -1) {
                    this._adminModelsService.modelList.splice(deleteModel, 1);
                    this.dataSource.modelsSubject.next(this._adminModelsService.modelList);
                    this.dataSource.totalLength = this.dataSource.totalLength - 1;
                }
            }
        });
    }

    duplicateModel(model): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';
        dialogConfig.disableClose = true;
        dialogConfig.data = { model, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                this.router.navigate(['admin/models/model_detail'], { queryParams: result });
            }
        });
    }
}