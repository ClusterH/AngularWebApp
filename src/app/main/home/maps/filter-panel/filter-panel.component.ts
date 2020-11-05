import { Component, ViewEncapsulation, OnDestroy, OnInit, EventEmitter, Output, Input } from '@angular/core';
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
        { name: 'On', id: false },
        { name: 'Off', id: true },
    ];

    gpsData: Array<any> = [
        { name: 'Valid', id: true },
        { name: 'Invalid', id: false }
    ];

    speedData: Array<any> = [
        { name: 'Stop', id: 0 },
        { name: 'Move', id: 1 },
    ];

    lastreportData: Array<any> = [
        { name: '30 Minutes', id: 1 },
        { name: '1 Hours', id: 2 },
        { name: 'Between 1~24hrs', id: 3 },
        { name: 'More than 24hrs', id: 4 },
    ];

    currentOpenedPanel: string = 'unittypeArray';
    unittypepage: number;
    unitclistpage: number;
    filter_string: string = '';
    isFilterPanel: boolean = false;
    isUnitPanel: boolean = false;
    uncheckedFilterOption: Array<any> = [];

    @Input() unitClist: any;
    @Output() unitClistFilterEmitter = new EventEmitter<any>();
    @Output() filterPanelCloseEmitter = new EventEmitter<boolean>();
    @Output() unitLocateNowEmitter = new EventEmitter<boolean>();

    private _unsubscribeAll: Subject<any>;

    constructor(
        public unitInfoService: UnitInfoService,
        private filterPanelService: FilterPanelService,
        private unitInfoSideBarService: UnitInfoSidebarService,
        private fb: FormBuilder
    ) {
        this._unsubscribeAll = new Subject();
        this.getFilterPanelClists('producttype_clist');
        this.getFilterPanelClists('unittype_clist');
        // this.getFilterPanelClists('unit_clist');

        // Set the defaults
        this.date = new Date();
        this.settings = {
            notify: true,
            cloud: false,
            retro: true,
            showVehicles: true
        };

        this.unitForm = this.fb.group({
            producttypeid: this.fb.array([]),
            ignition: this.fb.array([]),
            ValidGPS: this.fb.array([]),
            Speed: this.fb.array([]),
            LastReport: this.fb.array([]),
            unittypeid: this.fb.array([]),
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

    isOpenUnitPanel(event: any) {
        console.log(event);
    }

    openFilterPanel(): void {
        this.isFilterPanel = !this.isFilterPanel;
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
                        // case 'unit_clist':
                        //     this.unitclistData = res.TrackingXLAPI.DATA;
                        //     console.log(this.unitclistData);
                        //     this.unitclistpage = 1;
                        //     break;
                        default:
                            break;
                    }
                }
            });
    }

    afterPanelOpened(event: string) {
        this.currentOpenedPanel = event;
        this.filter_string = '';
        if (this.currentOpenedPanel == 'unittypeArray') {
            this.getFilterPanelClists('unittype_clist');
        } else if (this.currentOpenedPanel == 'unitclistArray') {
            // this.getFilterPanelClists('unit_clist');
            this.unitclistData = this.unitClist.map(unit => ({ ...unit }));
            console.log(this.unitclistData);
            this.unitclistpage = 1;
        }
    }

    onUnitTypePageChange(event) {
        // this.unittypepageconfig.currentPage = event;
    }

    onUnitClistPageChange(event) {
        // this.unitclistpageconfig.currentPage = event;
    }

    onCheckboxChangeUnit(e, id, type) {
        let currentTime = new Date();
        console.log(currentTime, new Date().getTime());
        console.log(new Date('2020-02-24T18:32:48Z'), new Date('2020-11-03T20:30:48' + 'Z').getTime());
        console.log(e, id, type);
        const checkArray: FormArray = this.unitForm.get(type) as FormArray;
        if (e.target.checked) {
            checkArray.push(new FormControl(e.target.value));
            if (type == 'unitclistArray') {
                this.unitclistData.push(this.unitClist.filter(unit => unit.id == id)[0]);
            }
            this.uncheckedFilterOption = this.uncheckedFilterOption.filter(filter => filter.type != type || (filter.type == type && filter.id != id));
        } else {
            let i: number = 0;
            checkArray.controls.forEach((item: FormControl) => {
                if (item.value == e.target.value) {
                    checkArray.removeAt(i);
                    return;
                }
                i++;
            });

            if (type == 'unitclistArray') {
                this.unitclistData = this.unitclistData.filter(unit => unit.id != id);
            }
            this.uncheckedFilterOption.push({ type: type, id: id });
        }
        // console.log(checkArray);
        // console.log(this.uncheckedFilterOption);
        // console.log(this.unitclistData);

        let tempUnitclistData = this.unitclistData.map(unit => ({ ...unit }));

        if (this.uncheckedFilterOption.length > 0) {
            this.uncheckedFilterOption.forEach((option: any) => {
                if (option.type == 'Speed') {
                    if (option.id == 0) {
                        tempUnitclistData = tempUnitclistData.filter(unit => unit[option.type] != option.id);
                    } else {
                        tempUnitclistData = tempUnitclistData.filter(unit => unit[option.type] == 0);
                    }
                } else if (option.type == 'LastReport') {
                    console.log(option);
                    switch (option.id) {
                        case 1:
                            tempUnitclistData = tempUnitclistData.filter(unit => (new Date().getTime() - new Date(unit[option.type] + 'Z').getTime()) / 1000 > 1800);
                            break;
                        case 2:
                            tempUnitclistData = tempUnitclistData.filter(unit => (new Date().getTime() - new Date(unit[option.type] + 'Z').getTime()) / 1000 <= 1800 || (new Date().getTime() - new Date(unit[option.type] + 'Z').getTime()) / 1000 > 3600);
                            break;
                        case 3:
                            tempUnitclistData = tempUnitclistData.filter(unit => (new Date().getTime() - new Date(unit[option.type] + 'Z').getDate()) / 1000 <= 3600 || (new Date().getTime() - new Date(unit[option.type] + 'Z').getDate()) / 1000 > 86400);
                            break;
                        case 4:
                            tempUnitclistData = tempUnitclistData.filter(unit => (new Date().getTime() - new Date(unit[option.type] + 'Z').getDate()) / 1000 <= 86400);
                            break;
                    }
                } else {
                    tempUnitclistData = tempUnitclistData.filter(unit => unit[option.type] != option.id);
                }
            });
        } else {
            tempUnitclistData = this.unitclistData;
        }

        console.log(tempUnitclistData);
        this.unitClistFilterEmitter.emit(tempUnitclistData);
    }

    isCheckedRow(row: any): boolean {
        if (this.currentOpenedPanel == 'unittypeid') {
            const foundunittype = this.unittypeSelection.selected.find(el => el === row);
            if (foundunittype) { return true; }
            return false;
        } else if (this.currentOpenedPanel == 'unitclistArray') {
            const found = this.unitclistSelection.selected.find(el => el === row);
            if (found) { return true; }
            return false;
        }
    }

    onLocateNow(unit: any) {
        console.log(unit);
        this.unitLocateNowEmitter.emit(unit);
    }

    toggleSidebarOpen(key) {
        this.filterPanelCloseEmitter.emit(false);
        this.unitClistFilterEmitter.emit(this.unitClist);
        this.unitclistSelection.clear();
        this.unittypeSelection.clear();
        this.unitInfoSideBarService.getSidebar(key).toggleOpen();
    }

    clearFilter() {
        this.filter_string = '';
        if (this.currentOpenedPanel == 'unittypeid') {
            this.getFilterPanelClists('unittype_clist');
        } else if (this.currentOpenedPanel == 'unitclistArray') {
            this.getFilterPanelClists('unit_clist');
        }
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            if (this.currentOpenedPanel == 'unittypeid') {
                this.getFilterPanelClists('unittype_clist');
            } else if (this.currentOpenedPanel == 'unitclistArray') {
                this.getFilterPanelClists('unit_clist');
            }
            // this.managePageIndex(this.method_string);
            // this.loadVehicleDetail(this.method_string);
        }
    }
}
