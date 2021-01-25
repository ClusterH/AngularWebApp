import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterPanelService } from 'app/main/home/maps/services/searchfilterpanel.service';
import { UnitInfoService } from 'app/main/home/maps/services/unitInfo.service';
import { UnitInfoSidebarService } from 'app/main/home/maps/sidebar/sidebar.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface Task {
    name: string;
    completed: boolean;
    subtasks?: Task[];
}

@Component({
    selector: 'filter-panel',
    templateUrl: './filter-panel.component.html',
    styleUrls: ['./filter-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
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
    unittypeData_temp: Array<any> = [];
    unitclistData: Array<any> = [];
    userPOIsData: Array<any> = [];
    ignitionData: Array<any> = [
        { name: 'On', id: false, isSelected: true },
        { name: 'Off', id: true, isSelected: true },
    ];

    gpsData: Array<any> = [
        { name: 'Valid', id: true, isSelected: true },
        { name: 'Invalid', id: false, isSelected: true }
    ];

    speedData: Array<any> = [
        { name: 'Stop', id: 0, isSelected: true },
        { name: 'Move', id: 1, isSelected: true },
    ];

    lastreportData: Array<any> = [
        { name: '30 Minutes', id: 1, isSelected: true },
        { name: '1 Hours', id: 2, isSelected: true },
        { name: 'Between 1~24hrs', id: 3, isSelected: true },
        { name: 'More than 24hrs', id: 4, isSelected: true },
    ];

    currentOpenedPanel: string = 'unittypeArray';
    unittypepage: number;
    unitclistpage: number;
    userpoipage: number;
    filter_string: string = '';
    isFilterPanel: boolean = false;
    isUnitPanel: boolean = false;
    uncheckedFilterOption: Array<any> = [];
    uncheckedPOIsFilterOption: Array<any> = [];
    unitClist_temp: any;
    userPOIs_temp: any;
    isCheckedAllUnits: boolean = true;
    isCheckedAllUnitType: boolean = true;
    isCheckedAllPOIs: boolean = true;

    @Input() unitClist: any;
    @Input() poiClist: any;

    @Output() filterPanelCloseEmitter = new EventEmitter<boolean>();
    @Output() unitLocateNowEmitter = new EventEmitter<any>();
    @Output() filterUnits = new EventEmitter<boolean>();

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
        this.unitClist = this.unitClist.map(unit => {
            unit.isSelected = true;
            return unit;
        });

        this.poiClist = this.poiClist.map(poi => {
            poi.isSelected = true;
            return poi;
        });

        this.unitClist_temp = this.unitClist.map(unit => ({ ...unit }));
        this.userPOIs_temp = this.poiClist.map(poi => ({ ...poi }));
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
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
                            this.productData = this.productData.map(item => {
                                item.isSelected = true;
                                return item;
                            });
                            break;
                        case 'unittype_clist':
                            this.unittypeData = res.TrackingXLAPI.DATA;
                            this.unittypeData = this.unittypeData.map(item => {
                                item.isSelected = true;
                                return item;
                            });
                            this.unittypeData_temp = this.unittypeData.map(type => ({ ...type }));
                            this.unittypepage = 1;
                            break;
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
            this.unitclistData = this.unitClist_temp.map(unit => ({ ...unit }));
            this.unitclistpage = 1;
        } else if (this.currentOpenedPanel == 'userPOIsArray') {
            this.isFilterPanel = false;
            this.userPOIsData = this.userPOIs_temp.map(poi => ({ ...poi }));
            this.userpoipage = 1;
        }
    }

    checkUncheckAllUnit(isCheckedAll: any, type: string) {
        if (type == 'unitclistArray') {
            if (isCheckedAll) {
                this.unitClist_temp = this.unitClist_temp.map(unit => {
                    unit.isSelected = true;
                    return unit;
                });
                this.unitclistData = this.unitClist_temp;
            } else {
                this.unitClist_temp = this.unitClist_temp.map(unit => {
                    unit.isSelected = false;
                    return unit;
                });

                this.unitclistData = [];
            }
            this.filterUnitEmitter();

        } else if (type == 'unittypeid') {
            if (isCheckedAll) {
                this.unittypeData_temp = this.unittypeData_temp.map(unit => {
                    unit.isSelected = true;
                    return unit;
                });
                this.uncheckedFilterOption = this.uncheckedFilterOption.filter(filter => filter.type != type);
            } else {
                this.unittypeData_temp = this.unittypeData_temp.map(unit => {
                    unit.isSelected = false;
                    return unit;
                });

                this.unittypeData_temp.forEach(item => {
                    this.uncheckedFilterOption.push({ type: type, id: item.id });
                });
            }
            this.filterUnitEmitter();

        } else if (type == 'userPOIsArray') {
            if (isCheckedAll) {
                this.userPOIs_temp = this.userPOIs_temp.map(poi => {
                    poi.isSelected = true;
                    return poi;
                });
                this.userPOIsData = this.userPOIs_temp;
            } else {
                this.userPOIs_temp = this.userPOIs_temp.map(poi => {
                    poi.isSelected = false;
                    return poi;
                });

                this.userPOIsData = [];
            }
            this.filterPOIsEmitter();

        }
    }

    isAllSelected(data: any, type: string) {
        if (type == 'unitclistArray') {
            this.isCheckedAllUnits = this.unitClist_temp.every(item => {
                return item.isSelected == true;
            });
            this.onCheckboxChangeUnit(data, type);
        } else if (type == 'unittypeid') {
            this.isCheckedAllUnitType = this.unittypeData_temp.every(item => {
                return item.isSelected == true;
            });
            this.onCheckboxChangeUnit(data, type);
        } else if (type == 'userPOIsArray') {
            this.isCheckedAllPOIs = this.userPOIs_temp.every(item => {
                return item.isSelected == true;
            });
            this.onCheckboxChangePOI(data, type);
        }
    }

    onCheckboxChangeUnit(data: any, type: string) {
        if (data.isSelected) {
            if (type == 'unitclistArray') {
                this.unitclistData.push(this.unitClist_temp.filter(unit => unit.id == data.id)[0]);
            }
            this.uncheckedFilterOption = this.uncheckedFilterOption.filter(filter => filter.type != type || (filter.type == type && filter.id != data.id));
        } else {
            if (type == 'unitclistArray') {
                this.unitclistData = this.unitclistData.filter(unit => unit.id != data.id);
            }
            this.uncheckedFilterOption.push({ type: type, id: data.id });
        }

        this.filterUnitEmitter();
    }

    onCheckboxChangePOI(data: any, type: string) {
        if (data.isSelected) {
            if (type == 'userPOIsArray') {
                this.userPOIsData.push(this.userPOIs_temp.filter(poi => poi.id == data.id)[0]);
            }
            this.uncheckedPOIsFilterOption = this.uncheckedPOIsFilterOption.filter(filter => filter.type != type || (filter.type == type && filter.id != data.id));
        } else {
            if (type == 'userPOIsArray') {
                this.userPOIsData = this.userPOIsData.filter(poi => poi.id != data.id);
            }
            this.uncheckedPOIsFilterOption.push({ type: type, id: data.id });
        }

        this.filterPOIsEmitter();
    }

    filterUnitEmitter() {
        this.filterPanelService.loadingsubject.next(false);
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

        this.filterPanelService.loadVehMarkers(tempUnitclistData);
        this.filterUnits.emit(true);
        setTimeout(() => {
            this.filterPanelService.loadingsubject.next(true);
        }, 500);
    }

    filterPOIsEmitter() {
        this.filterPanelService.loadingsubject.next(false);
        let tempUserPOIsData = this.userPOIsData.map(poi => ({ ...poi }));
        if (this.uncheckedPOIsFilterOption.length > 0) {
            this.uncheckedPOIsFilterOption.forEach((option: any) => {
                tempUserPOIsData = tempUserPOIsData.filter(poi => poi[option.type] != option.id);
            });
        } else {
            tempUserPOIsData = this.userPOIsData;
        }

        this.filterPanelService.loadUserPOIs(tempUserPOIsData);
        this.filterUnits.emit(true);
        setTimeout(() => {
            this.filterPanelService.loadingsubject.next(true);
        }, 500);
    }

    onLocateNow(unit: any) {
        const target = { lat: unit.lat, lng: unit.lng, isSelected: unit.isSelected };
        this.unitLocateNowEmitter.emit(target);
    }
    onLocatePOINow(poi: any) {
        const target = { lat: poi.latitude, lng: poi.longitude, isSelected: poi.isSelected };
        this.unitLocateNowEmitter.emit(target);
    }

    toggleSidebarOpen(key) {
        this.filterPanelService.loadingsubject.next(false);
        this.filterPanelCloseEmitter.emit(false);
        this.filterPanelService.loadVehMarkers(this.unitClist);
        this.filterPanelService.loadUserPOIs(this.poiClist);
        this.unitInfoSideBarService.getSidebar(key).toggleOpen();
        setTimeout(() => {
            this.filterPanelService.loadingsubject.next(true);
        }, 500);
    }

    clearFilter() {
        this.filter_string = '';
        if (this.currentOpenedPanel == 'unittypeArray') {
            this.unittypeData_temp = this.unittypeData.map(type => ({ ...type }));
            this.unittypepage = 1;
        } else if (this.currentOpenedPanel == 'unitclistArray') {
            this.unitClist_temp = this.unitClist.map(unit => ({ ...unit }));
            this.unitclistpage = 1;
        } else if (this.currentOpenedPanel == 'userPOIsArray') {
            this.userPOIs_temp = this.poiClist.map(poi => ({ ...poi }));
            this.userpoipage = 1;
        }
    }

    onKey(event: any) {
        this.filter_string = event.target.value.toLowerCase();
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            if (this.currentOpenedPanel == 'unittypeArray') {
                this.unittypeData_temp = this.unittypeData.filter(unit => unit.name.toLowerCase().includes(this.filter_string));
                this.unittypepage = 1;
            } else if (this.currentOpenedPanel == 'unitclistArray') {
                this.unitClist_temp = this.unitClist.filter(unit => unit.name.toLowerCase().includes(this.filter_string));
                this.unitclistpage = 1;
            } else if (this.currentOpenedPanel == 'userPOIsArray') {
                this.userPOIs_temp = this.poiClist.filter(poi => poi.name.toLowerCase().includes(this.filter_string));
                this.unittypepage = 1;
            }
        }
    }

    trackFnUnitClist(index, item) {
        return item ? item.id : null;
    }

    trackFnUnitType(index, item) {
        return item ? item.id : null;
    }

    trackByFn(index, item) {
        return index;
    }
}
