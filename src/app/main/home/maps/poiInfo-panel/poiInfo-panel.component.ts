import { Component, ViewEncapsulation, OnDestroy, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnitInfoService } from 'app/main/home/maps/services/unitInfo.service';
import { UnitInfoSidebarService } from 'app/main/home/maps/sidebar/sidebar.service';
import { AutocompletePOIDialogComponent } from 'app/main/home/maps/poiInfo-panel/autocomplete/autocomplete.component';

import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
declare let google: any;
import PlaceResult = google.maps.places.PlaceResult;
import { identifierName } from '@angular/compiler';
import { random } from 'lodash';

export interface Task {
    name: string;
    completed: boolean;
    subtasks?: Task[];
}
@Component({
    selector: 'poiInfo-panel',
    templateUrl: './poiInfo-panel.component.html',
    styleUrls: ['./poiInfo-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class POIInfoPanelComponent implements OnInit, OnDestroy {
    currentChannel: string = 'mainpanel';
    linkedEmail: any;
    expireTime: number;
    expireTimeUnit: string = 'minutes';
    playbackDateRange: string = '0';
    dateStep: FormGroup;

    count: number = 0;

    @Input() currentPOI: any;
    @Input() currentPOIEvents: any;

    @Output() eventLocation = new EventEmitter();

    private _unsubscribeAll: Subject<any>;

    constructor(
        public unitInfoService: UnitInfoService,
        private unitInfoSideBarService: UnitInfoSidebarService,
        public _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        private router: Router,
    ) {
        this._unsubscribeAll = new Subject();

        this.count = 0;
    }

    ngOnInit(): void {
        this.dateStep = this._formBuilder.group({
            starttime: [null],
            start: [null],
            end: [null],
            endtime: [null]
        });

    }
    ngAfterViewInit() { }

    ngOnChanges() {

        this.goOptionPanel('mainpanel');
        this.playbackDateRange = '0';
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    editPOI(): void {
        console.log('POI Edit');
        this.router.navigate(['admin/poi/pois/poi_detail/map'], { queryParams: this.currentPOI });
    }

    goOptionPanel(option: string) {
        this.currentChannel = option;
    }

    showPositionDialog(option: string) {
        if (option == 'direction') {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.panelClass = 'custom-dialog-container';
            dialogConfig.disableClose = true;
            dialogConfig.data = { unit: { id: this.currentPOI.id, name: this.currentPOI.name, latitude: Number(this.currentPOI.latitude), longitude: Number(this.currentPOI.longitude) }, flag: option };
            const dialogRef = this._matDialog.open(AutocompletePOIDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {

            });
        }
    }

    showEventLocation(event, method) {
        if (method == 'every') {

            let eventGeoLocation = [];
            eventGeoLocation[0] = {
                latitude: event.latitude,
                longitude: event.longitude
            };
            this.eventLocation.emit(eventGeoLocation);
        } else if (method == 'all') {
            this.eventLocation.emit(this.currentPOIEvents);
        }
    }

    paramDateFormat(date: any) {
        let str = '';
        if (date != '') {
            str = ("00" + (date.getMonth() + 1)).slice(-2) + "/" + ("00" + date.getDate()).slice(-2) + "/" + date.getFullYear();
        }
        return str;
    }

    paramTimeFormat(time) {
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
        if (time.length > 1) { // If time format correct
            time = time.slice(1); // Remove full string match value
            time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
            time[0] = +(time[0] % 12) < 10 ? '0' + time[0] % 12 : time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    }
}