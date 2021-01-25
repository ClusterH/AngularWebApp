import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UnitInfoService } from 'app/main/home/maps/services/unitInfo.service';
import { UnitInfoSidebarService } from 'app/main/home/maps/sidebar/sidebar.service';
import { AutocompleteDialogComponent } from 'app/main/home/maps/unitInfo-panel/autocomplete/autocomplete.component';
import { UnitLinkDialogComponent } from 'app/main/home/maps/unitInfo-panel/dialog/dialog.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare let google: any;
import PlaceResult = google.maps.places.PlaceResult;

export interface Task {
    name: string;
    completed: boolean;
    subtasks?: Task[];
}
@Component({
    selector: 'unitInfo-panel',
    templateUrl: './unitInfo-panel.component.html',
    styleUrls: ['./unitInfo-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UnitInfoPanelComponent implements OnInit, OnDestroy {
    currentChannel = 'mainpanel';
    linkedEmail: any;
    expireTime: number;
    expireTimeUnit = 'minutes';
    playbackDateRange = '0';
    dateStep: FormGroup;

    count = 0;
    color = {
        blue: "#0000ff",
        darkblue: "#00008b",
        darkcyan: "#008b8b",
        darkgreen: "#006400",
        darkmagenta: "#8b008b",
        darkred: "#8b0000",
        darkviolet: "#9400d3",
        fuchsia: "#ff00ff",
        green: "#008000",
        indigo: "#4b0082",
        lime: "#00ff00",
        magenta: "#ff00ff",
        red: "#ff0000",
        yellow: "#ffff00"
    }

    @Input() currentUnit: any = null;
    @Input() currentOperator: any;
    @Input() currentEvents: any = null;

    @Output() eventLocation = new EventEmitter();
    @Output() trackHistory = new EventEmitter();

    private _unsubscribeAll: Subject<any>;

    constructor(
        public unitInfoService: UnitInfoService,
        private unitInfoSideBarService: UnitInfoSidebarService,
        public _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
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

    showEventLocation(event, method) {
        if (method == 'every') {
            let eventGeoLocation = [];
            eventGeoLocation[0] = {
                latitude: event.latitude,
                longitude: event.longitude
            };
            this.eventLocation.emit(eventGeoLocation);
        } else if (method == 'all') {
            this.eventLocation.emit(this.currentEvents);
        }
    }

    goOptionPanel(option: string) {
        this.currentChannel = option;
    }

    sendLocateRequest() {
        this.unitInfoService.locateNow(this.currentUnit.id)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                if (res.TrackingXLAPI.DATA[0].id == '1') {
                    alert('Locate request send!');
                    this.currentChannel = 'mainpanel';
                } else {
                    alert('Failed, Please try again');
                }
            });
    }

    sendLinkEmail() {
        if (this.expireTimeUnit == 'minutes') {
            let temp = this.expireTime * 60;
            this.expireTime = temp;
        } else if (this.expireTimeUnit == 'hours') {
            let temp = this.expireTime * 360;
            this.expireTime = temp;
        }

        this.unitInfoService.sendShareLocation(this.currentUnit.id, this.expireTime, this.linkedEmail)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                if (res.TrackingXLAPI.DATA[0].result == '1') {
                    alert('Link was sent!');
                    this.currentChannel = 'mainpanel';
                } else {
                    alert('Failed, Please try again');
                }
            });
    }

    showPositionDialog(option: string) {
        if (option == 'direction') {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.panelClass = 'custom-dialog-container';
            dialogConfig.disableClose = true;
            dialogConfig.data = { unit: { id: this.currentUnit.id, name: this.currentUnit.name, latitude: Number(this.currentUnit.latitude), longitude: Number(this.currentUnit.longitude) }, flag: option };
            const dialogRef = this._matDialog.open(AutocompleteDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            });
        } else {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.panelClass = 'custom-dialog-container';
            dialogConfig.disableClose = true;
            dialogConfig.data = { unit: { name: this.currentUnit.name, latitude: Number(this.currentUnit.latitude), longitude: Number(this.currentUnit.longitude) }, flag: option };
            const dialogRef = this._matDialog.open(UnitLinkDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {

            });
        }
    }

    onChangePlaybackDateOption(event: any) {

    }

    playbackHistory() {
        let params: any = {};
        params.unitid = this.currentUnit.id;
        params.historytype = this.playbackDateRange;

        if (this.playbackDateRange == '4') {
            if (this.dateStep.get('start').value == null || this.dateStep.get('starttime').value == null || this.dateStep.get('end').value == null || this.dateStep.get('endtime').value == null) {
                alert("Please choose date and time correctly!");
                return;
            }

            params.datefrom = this.paramDateFormat(new Date(this.dateStep.get('start').value)) + " " + this.paramTimeFormat(this.dateStep.get('starttime').value);
            params.dateto = this.paramDateFormat(new Date(this.dateStep.get('end').value)) + " " + this.paramTimeFormat(this.dateStep.get('endtime').value);
        }

        this.unitInfoService.playbackHistory(params, 'GetTrackIDandName').then(idandname => {
            if (idandname.responseCode === 100) {
                // this.unitInfoService.TrackID = res.TrackingXLAPI.DATA[0].id;
                // this.unitInfoService.TrackName = res
                this.unitInfoService.playbackHistory(params, 'GetUnitHistory')
                    .then(history => {
                        if (history.responseCode === 100) {
                            this.count = this.count + 1;
                            let color = this.random_rgba();
                            this.unitInfoService.TrackHistoryList.next({
                                id: idandname.TrackingXLAPI.DATA[0].id,
                                name: idandname.TrackingXLAPI.DATA[0].name,
                                strokeColor: color,
                                historyList: history.TrackingXLAPI.DATA
                            });
                        } else {
                            alert('There are no any Data!');
                            this.goOptionPanel('mainpanel');
                            this.playbackDateRange = '0';
                        }
                    })
            }
        });
    }

    random_rgba() {
        let result;
        let count = 0;
        for (let prop in this.color) {
            if (Math.random() < 1 / ++count) result = prop;
        }

        return this.color[result];
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