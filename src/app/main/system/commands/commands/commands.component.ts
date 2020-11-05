import { Component, ElementRef, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as commandsEnglish } from 'app/main/system/commands/i18n/en';
import { locale as commandsFrench } from 'app/main/system/commands/i18n/fr';
import { locale as commandsPortuguese } from 'app/main/system/commands/i18n/pt';
import { locale as commandsSpanish } from 'app/main/system/commands/i18n/sp';
import { CommandsDataSource } from "app/main/system/commands/services/commands.datasource";
import { CommandsService } from 'app/main/system/commands/services/commands.service';
import { CommandDetailService } from 'app/main/system/commands/services/command_detail.service';
import * as $ from 'jquery';
import { merge, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
    selector: 'system-commands',
    templateUrl: './commands.component.html',
    styleUrls: ['./commands.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class CommandsComponent implements OnInit, OnDestroy {
    dataSource: CommandsDataSource;
    @Output()
    pageEvent: PageEvent;
    pageIndex = 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentUser: any;
    command: any;
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
        private _systemCommandsService: CommandsService,
        private commandDetailService: CommandDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).commands;
        this._fuseTranslationLoaderService.loadTranslations(commandsEnglish, commandsSpanish, commandsFrench, commandsPortuguese);
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
            .pipe(tap(() => this.dataSource.loadCommands(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Command_TList")), takeUntil(this._unsubscribeAll)).subscribe((res: any) => { });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }

    ngOnInit(): void {
        this.dataSource = new CommandsDataSource(this._systemCommandsService);
        this.dataSource.loadCommands(this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "Command_TList");
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
            this.dataSource.loadCommands(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Command_TList");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        this.dataSource.loadCommands(pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Command_TList");
    }

    filterEvent() { this.selectedFilter(); }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadCommands(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "Command_TList");
    }

    addNewCommand() {
        this.router.navigate(['system/commands/command_detail']);
    }

    editShowCommandDetail(command: any) {
        this.router.navigate(['system/commands/command_detail'], { queryParams: command });
    }

    deleteCommand(command): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'delete';
        dialogConfig.disableClose = true;
        dialogConfig.data = { command, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {

                let deleteCommand = this._systemCommandsService.commandList.findIndex((deletedcommand: any) => deletedcommand.id == command.id);
                if (deleteCommand > -1) {

                    this._systemCommandsService.commandList.splice(deleteCommand, 1);
                    this.dataSource.commandsSubject.next(this._systemCommandsService.commandList);
                    this.dataSource.totalLength = this.dataSource.totalLength - 1;
                }
            }
        });
    }

    duplicateCommand(command): void {
        const dialogConfig = new MatDialogConfig();
        this.flag = 'duplicate';
        dialogConfig.disableClose = true;
        dialogConfig.data = { command, flag: this.flag };
        const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                this.router.navigate(['system/commands/command_detail'], { queryParams: result });
            }
        });
    }
}