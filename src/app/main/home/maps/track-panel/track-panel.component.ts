import { Component, ViewEncapsulation, OnDestroy, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { UnitInfoService } from 'app/main/home/maps/services/unitInfo.service';
import { TrackPanelService } from 'app/main/home/maps/services/trackpanel.service';
import { UnitInfoSidebarService } from 'app/main/home/maps/sidebar/sidebar.service';

export interface Task {
    name: string;
    completed: boolean;
    subtasks?: Task[];
}

@Component({
    selector: 'track-panel',
    templateUrl: './track-panel.component.html',
    styleUrls: ['./track-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TrackPanelComponent implements OnInit, OnDestroy {
    userID: number;
    userConncode: string;
    unitHistoryList: any = [];
    trackSelection = new SelectionModel<Element>(true, []);

    private _unsubscribeAll: Subject<any>;

    config: any = [];
    labels: any = {
        prevLabel: "\u2B9C",
        nextLabel: "\u2B9E"
    };

    step: string = '';

    @Output() centerTrackLocation = new EventEmitter();
    // @Output() showHideTrack = new EventEmitter();
    @Output() trackHistory = new EventEmitter();

    constructor(
        public unitInfoService: UnitInfoService,
        private trackPanelService: TrackPanelService,
        private unitInfoSideBarService: UnitInfoSidebarService,
        private fb: FormBuilder
    ) {

        this._unsubscribeAll = new Subject();

    }

    ngOnInit(): void {
        this.unitInfoService.TrackHistoryList.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            console.log(res);
            if (res != null) {
                if (res.id && res != null) {
                    let isDuplicated = this.unitHistoryList.find(list => list.id == res.id);

                    if (isDuplicated) {
                        alert('already exist!');
                        return;
                    }
                    this.unitHistoryList.push(res);
                    this.config.push({
                        id: res.id,
                        itemsPerPage: 10,
                        currentPage: 1,
                        totalItems: res.historyList.length
                    });
                    this.trackHistory.emit({ tracks: this.unitHistoryList, option: 'add' });
                }
            } else if (res == null) {
                this.unitHistoryList = [];
                this.config = [];
            }
        })
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // isCheckedRow(row: any): boolean {

    //     // this.trackSelection.select(row);
    //     const found = JSON.parse(JSON.stringify(this.trackSelection.selected)).find(el => el === row);
    //
    //     if (found) { return true; }
    //     return false;
    // }


    toggleSidebarOpen(key) {
        this.unitInfoSideBarService.getSidebar(key).toggleOpen();
    }

    pageChanged(event, k) {
        this.config[k].currentPage = event;
    }

    setStep(index: string) {
        this.step = index;
    }

    centerMap(track: any, option: string) {

        this.centerTrackLocation.emit({ track: track, option: option });
    }

    deleteFromList(id: any) {
        let isDeleteList = this.unitHistoryList.findIndex(list => list.id == id);
        this.unitHistoryList.splice(isDeleteList, 1);
        this.config.splice(isDeleteList, 1);
        this.trackHistory.emit({ tracks: this.unitHistoryList, option: 'delete' });
    }

    onShowHideTrack(event: any) {
        let selectedTrack = JSON.parse(JSON.stringify(this.trackSelection.selected));
        let tempHistoryList: any = [];
        tempHistoryList = this.unitHistoryList.filter(item => !selectedTrack.includes(item.id));
        this.trackHistory.emit({ tracks: tempHistoryList, option: 'showhide' });
    }

    colorPicker(event: any) {

    }
}
