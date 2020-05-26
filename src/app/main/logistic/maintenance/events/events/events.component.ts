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

import { EventsService } from 'app/main/logistic/maintenance/events/services/events.service';
import { EventsDataSource } from "app/main/logistic/maintenance/events/services/events.datasource";
import { EventDetailService } from 'app/main/logistic/maintenance/events/services/event_detail.service';

import {CourseDialogComponent} from "../dialog/dialog.component";

import { locale as eventsEnglish } from 'app/main/logistic/maintenance/events/i18n/en';
import { locale as eventsSpanish } from 'app/main/logistic/maintenance/events/i18n/sp';
import { locale as eventsFrench } from 'app/main/logistic/maintenance/events/i18n/fr';
import { locale as eventsPortuguese } from 'app/main/logistic/maintenance/events/i18n/pt';
import { Route } from '@angular/compiler/src/core';

@Component({
    selector     : 'logistic-events',
    templateUrl  : './events.component.html',
    styleUrls    : ['./events.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EventsComponent implements OnInit
{
    dataSource: EventsDataSource;

    @Output()
    pageEvent: PageEvent;
   
    pageIndex= 0;
    pageSize = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    selected = '';
    filter_string: string = '';
    index_number: number = 1;
    currentEvent: any;

    event: any;
    userConncode: string;
    userID: number;
    restrictValue: number;

    flag: string = '';
    displayedColumns = [
        'id',
        'name',
        'description',
        'company',
        'group',
    ];

    dialogRef: any;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;
    
    constructor(
        private _adminEventsService: EventsService,
        private eventDetailService: EventDetailService,
        public _matDialog: MatDialog,
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    )
    {
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;
        this.restrictValue = JSON.parse(localStorage.getItem('restrictValueList')).events;

        


        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(eventsEnglish, eventsSpanish, eventsFrench, eventsPortuguese);

        this.pageIndex= 0;
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
   
        // when paginator event is invoked, retrieve the related data
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        

        merge(this.sort.sortChange, this.paginator.page)
        .pipe(
           tap(() => this.dataSource.loadEvents(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintevent_TList"))
        )
        .subscribe( (res: any) => {
            
        });

        const list_page = document.getElementsByClassName('mat-paginator-page-size-label');
        list_page[0].innerHTML = 'Page Size :';
    }
   
    ngOnInit(): void
    {
        

        this.dataSource = new EventsDataSource(this._adminEventsService);
        this.dataSource.loadEvents(this.userConncode, this.userID, this.pageIndex, this.pageSize, "id", "asc", this.selected, this.filter_string, "maintevent_TList");
    }

    onRowClicked(event) {
        
    }

    selectedFilter() {
        
        if (this.selected == '') {
            alert("Please choose Field for filter!");
        } else {
            this.paginator.pageIndex = 0;
            this.dataSource.loadEvents(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintevent_TList");
        }
    }

    actionPageIndexbutton(pageIndex: number) {
        
        this.dataSource.loadEvents(this.userConncode, this.userID, pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintevent_TList");
    }

    filterEvent() {
        this.selectedFilter();
    }
    navigatePageEvent() {
        this.paginator.pageIndex = this.dataSource.page_index - 1;
        this.dataSource.loadEvents(this.userConncode, this.userID, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.selected, this.filter_string, "maintevent_TList");
    }

    addNewEvent() {
        this.eventDetailService.event_detail = '';
        localStorage.removeItem("event_detail");
        this.router.navigate(['logistic/events/event_detail']);
    }

    editShowEventDetail(event: any) {
        this.eventDetailService.event_detail = event;

        localStorage.setItem("event_detail", JSON.stringify(event));

        this.router.navigate(['logistic/events/event_detail']);
    }
    
    deleteEvent(event): void
    {
        console.log(event);

        this.dialogRef = this._matDialog.open(CourseDialogComponent, {
            panelClass: 'delete-dialog',
            disableClose: true,
            data      : {
                eventDetail: event,
                flag: 'delete'
            }
        });

        this.dialogRef.afterClosed()
        .subscribe(res => {
            console.log(res);
            this.dataSource.eventsSubject.next(res);

        });
    }

    // duplicateEvent(event): void
    // {
    //     const dialogConfig = new MatDialogConfig();
    //     this.flag = 'duplicate';

    //     dialogConfig.disableClose = true;
        
    //     dialogConfig.data = {
    //         event, flag: this.flag
    //     };

    //     const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

    //     dialogRef.afterClosed().subscribe(result => {
    //         if ( result )
    //         { 
                
    //         } else {
                
    //         }
    //     });
    // }
}
