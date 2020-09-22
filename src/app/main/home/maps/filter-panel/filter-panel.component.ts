import { Component, ViewEncapsulation, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { UnitInfoService } from 'app/main/home/maps/services/unitInfo.service';
import { FilterPanelService } from 'app/main/home/maps/services/searchfilterpanel.service';
import { UnitInfoSidebarService } from 'app/main/home/maps/sidebar/sidebar.service';

export interface Task {
    name: string;
    completed: boolean;
    subtasks?: Task[];
}

@Component({
    selector: 'filter-panel',
    templateUrl: './filter-panel.component.html',
    styleUrls: ['./filter-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FilterPanelComponent implements OnInit, OnDestroy {
    userID: number;
    userConncode: string;
    date: Date;
    events: any[];
    notes: any[];
    settings: any;
    clickedMarkerInfo: any;

    unitForm: FormGroup;
    poiForm: FormGroup;
    zoneForm: FormGroup;
    routeForm: FormGroup;

    productData: Array<any> = [];
    unittypeData: Array<any> = [];
    unitclistData: Array<any> = [];
    unittypeSelection = new SelectionModel<Element>(true, []);
    unitclistSelection = new SelectionModel<Element>(true, []);

    ignitionData: Array<any> = [
        { name: 'On', id: 'off' },
        { name: 'Off', id: 'on' },
    ];

    gpsData: Array<any> = [
        { name: 'Valid', id: 'valid' },
        { name: 'Invalid', id: 'invalid' }
    ];

    speedData: Array<any> = [
        { name: 'Stop', id: 'stop' },
        { name: 'Move', id: 'move' },
    ];

    lastreportData: Array<any> = [
        { name: '30 Minutes', id: '30min' },
        { name: '1 Hours', id: '1hour' },
        { name: 'More than 1day', id: '1day' },
    ];

    currentOpenedPanel: string = 'unittypeArray';
    unittypepage: number;
    unitclistpage: number;
    filter_string: string = '';

    @Output() filterPanelCloseEmitter = new EventEmitter<boolean>();

    private _unsubscribeAll: Subject<any>;

    constructor(
        public unitInfoService: UnitInfoService,
        private filterPanelService: FilterPanelService,
        private unitInfoSideBarService: UnitInfoSidebarService,
        private fb: FormBuilder
    ) {
        console.log('start filter===>');
        this._unsubscribeAll = new Subject();


        this.getFilterPanelClists('producttype_clist');
        this.getFilterPanelClists('unittype_clist');
        this.getFilterPanelClists('unit_clist');

        // Set the defaults
        this.date = new Date();
        this.settings = {
            notify: true,
            cloud: false,
            retro: true,
            showVehicles: true
        };

        this.unitForm = this.fb.group({
            productArray: this.fb.array([]),
            ignitionArray: this.fb.array([]),
            gpsArray: this.fb.array([]),
            speedArray: this.fb.array([]),
            lastreportArray: this.fb.array([]),
            unittypeArray: this.fb.array([]),
            unitclistArray: this.fb.array([]),
        });
    }

    ngOnInit(): void {
        this.unittypeSelection.isSelected = this.isCheckedRow.bind(this);
        this.unitclistSelection.isSelected = this.isCheckedRow.bind(this);
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getFilterPanelClists(method: string): void {
        this.filterPanelService.getFilterPanelClists(1, 10000, this.filter_string, method)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {
                if (res.responseCode == 100) {
                    switch (method) {
                        case 'producttype_clist':
                            this.productData = res.TrackingXLAPI.DATA;
                            break;
                        case 'unittype_clist':
                            this.unittypeData = res.TrackingXLAPI.DATA;
                            this.unittypepage = 1;
                            break;
                        case 'unit_clist':
                            this.unitclistData = res.TrackingXLAPI.DATA;
                            this.unitclistpage = 1;
                            break;
                        default:
                            break;
                    }
                }
            });
    }

    afterPanelOpened(event: string) {
        console.log(event);
        this.currentOpenedPanel = event;
        this.filter_string = '';
        if (this.currentOpenedPanel == 'unittypeArray') {
            this.getFilterPanelClists('unittype_clist');
        } else if (this.currentOpenedPanel == 'unitclistArray') {
            this.getFilterPanelClists('unit_clist');
        }
    }

    onUnitTypePageChange(event) {
        // this.unittypepageconfig.currentPage = event;
    }

    onUnitClistPageChange(event) {
        // this.unitclistpageconfig.currentPage = event;
    }

    onCheckboxChangeUnit(e, type) {
        const checkArray: FormArray = this.unitForm.get(type) as FormArray;
        if (e.target.checked) {
            checkArray.push(new FormControl(e.target.value));
        } else {
            let i: number = 0;
            checkArray.controls.forEach((item: FormControl) => {
                if (item.value == e.target.value) {
                    checkArray.removeAt(i);
                    return;
                }
                i++;
            });
        }
    }

    isCheckedRow(row: any): boolean {
        if (this.currentOpenedPanel == 'unittypeArray') {
            const foundunittype = this.unittypeSelection.selected.find(el => el === row);
            if (foundunittype) { return true; }
            return false;
        } else if (this.currentOpenedPanel == 'unitclistArray') {
            const found = this.unitclistSelection.selected.find(el => el === row);
            if (found) { return true; }
            return false;
        }
    }

    toggleSidebarOpen(key) {
        this.filterPanelCloseEmitter.emit(false);
        this.unitclistSelection.clear();
        this.unittypeSelection.clear();
        this.unitInfoSideBarService.getSidebar(key).toggleOpen();
    }

    clearFilter() {
        this.filter_string = '';
        if (this.currentOpenedPanel == 'unittypeArray') {
            this.getFilterPanelClists('unittype_clist');
        } else if (this.currentOpenedPanel == 'unitclistArray') {
            this.getFilterPanelClists('unit_clist');
        }
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            if (this.currentOpenedPanel == 'unittypeArray') {
                this.getFilterPanelClists('unittype_clist');
            } else if (this.currentOpenedPanel == 'unitclistArray') {
                this.getFilterPanelClists('unit_clist');
            }
            // this.managePageIndex(this.method_string);
            // this.loadVehicleDetail(this.method_string);
        }
    }
}
