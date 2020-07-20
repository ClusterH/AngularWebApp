import { Component, ViewEncapsulation, OnDestroy, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChange } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { UnitInfoService } from 'app/main/home/maps/services/unitInfo.service';
import { UnitInfoSidebarService } from 'app/main/home/maps/sidebar/sidebar.service';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';

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

    @Input() currentUnit: any = {};

    private _unsubscribeAll: Subject<any>;


    /**
     * Constructor
     */
    constructor(
        public unitInfoService: UnitInfoService,
        private unitInfoSideBarService: UnitInfoSidebarService,
        private fb: FormBuilder) {
        this._unsubscribeAll = new Subject();
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;
    }

    ngOnInit(): void {
        console.log('aaaaaaaaaa');
    }

    ngOnChanges() {
        console.log(this.currentUnit);
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
