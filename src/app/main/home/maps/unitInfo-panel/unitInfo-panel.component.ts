import { Component, ViewEncapsulation, OnDestroy, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// import { SelectionModel } from '@angular/cdk/collections';
// import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { UnitInfoService } from 'app/main/home/maps/services/unitInfo.service';
import { UnitInfoSidebarService } from 'app/main/home/maps/sidebar/sidebar.service';
import { UnitLinkDialogComponent } from 'app/main/home/maps/unitInfo-panel/dialog/dialog.component';
import { AutocompleteDialogComponent } from 'app/main/home/maps/unitInfo-panel/autocomplete/autocomplete.component';

import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
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
    userID: number;
    userConncode: string;
    currentChannel: string = 'mainpanel';
    linkedEmail: any;
    expireTime: number;
    expireTimeUnit: string = 'minutes';

    @Input() currentUnit: any;
    @Input() currentOperator: any;
    @Input() currentEvents: any;

    @Output() eventLocation = new EventEmitter();

    private _unsubscribeAll: Subject<any>;

    constructor(
        public unitInfoService: UnitInfoService,
        private unitInfoSideBarService: UnitInfoSidebarService,
        public _matDialog: MatDialog,
    ) {
        this._unsubscribeAll = new Subject();
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;
    }

    ngOnInit(): void { }
    ngAfterViewInit() { }

    ngOnChanges() {
        console.log(this.currentUnit);
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    showEventLocation(event, method) {
        if (method == 'every') {
            console.log(event.latitude, event.longitude);
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
        this.unitInfoService.locateNow(this.userConncode, this.userID, this.currentUnit.id)
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
        console.log(this.linkedEmail, this.expireTime, this.expireTimeUnit);
        if (this.expireTimeUnit == 'minutes') {
            let temp = this.expireTime * 60;
            this.expireTime = temp;
        } else if (this.expireTimeUnit == 'hours') {
            let temp = this.expireTime * 360;
            this.expireTime = temp;
        }

        this.unitInfoService.sendShareLocation(this.userConncode, this.userID, this.currentUnit.id, this.expireTime, this.linkedEmail)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                console.log(res);
                if (res.TrackingXLAPI.DATA[0].result == '1') {
                    alert('Link was sent!');
                    this.currentChannel = 'mainpanel';
                } else {
                    alert('Failed, Please try again');
                }
            });
    }

    showPositionDialog(option: string) {
        console.log(option);
        if (option == 'direction') {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.panelClass = 'custom-dialog-container';
            dialogConfig.disableClose = true;
            dialogConfig.data = { unit: { id: this.currentUnit.id, name: this.currentUnit.name, latitude: Number(this.currentUnit.latitude), longitude: Number(this.currentUnit.longitude) }, flag: option };
            const dialogRef = this._matDialog.open(AutocompleteDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                console.log(result);
            });
        } else {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.panelClass = 'custom-dialog-container';
            dialogConfig.disableClose = true;
            dialogConfig.data = { unit: { name: this.currentUnit.name, latitude: Number(this.currentUnit.latitude), longitude: Number(this.currentUnit.longitude) }, flag: option };
            const dialogRef = this._matDialog.open(UnitLinkDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                console.log(result);
            });
        }
    }
}