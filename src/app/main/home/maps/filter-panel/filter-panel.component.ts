import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterPanelService, UnitInfoService, VehMarkersService, ZonesService, RoutesService } from '../services';
import { UnitInfoSidebarService } from 'app/main/home/maps/sidebar/sidebar.service';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { VehicleModel, POIModel, ZoneRouteModel } from '../models';

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
    clickedMarkerInfo: any;

    unitForm: FormGroup;
    poiForm: FormGroup;
    zoneForm: FormGroup;
    routeForm: FormGroup;

    productData: Array<any> = [];
    unittypeData: Array<any> = [];
    unittypeData_temp: Array<any> = [];
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
    zonepage: number;
    routepage: number;
    filter_string: string = '';
    isFilterPanel: boolean = false;
    isUnitPanel: boolean = false;
    uncheckedFilterOption: Array<any> = [];
    uncheckedPOIsFilterOption: Array<any> = [];
    vehicleMarkers: VehicleModel[];
    vehicleMarkers$: Observable<VehicleModel[]>;
    poiMarkers: POIModel[];
    poiMarkers$: Observable<POIModel[]>;
    zones: Array<ZoneRouteModel[]>;
    zones$: Observable<Array<ZoneRouteModel[]>>;
    routes: Array<ZoneRouteModel[]>;
    routes$: Observable<Array<ZoneRouteModel[]>>;

    isCheckedAllUnits: boolean = true;
    isCheckedAllUnitType: boolean = true;
    isCheckedAllPOIs: boolean = true;
    isCheckedAllZones: boolean = true;
    isCheckedAllRoutes: boolean = true;
    isCheckedVisibility: boolean = false;

    @Output() filterPanelCloseEmitter = new EventEmitter<boolean>();
    @Output() unitLocateNowEmitter = new EventEmitter<any>();
    @Output() filterUnits = new EventEmitter<any>();

    private _unsubscribeAll: Subject<any>;

    constructor(
        private vehicleMarkersService: VehMarkersService,
        private zonesService: ZonesService,
        private routesService: RoutesService,
        public unitInfoService: UnitInfoService,
        private filterPanelService: FilterPanelService,
        private unitInfoSideBarService: UnitInfoSidebarService,
        private fb: FormBuilder
    ) {
        this._unsubscribeAll = new Subject();
        this.getFilterPanelClists('producttype_clist');
        this.getFilterPanelClists('unittype_clist');

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
        this.vehicleMarkersService.filterMarkers$.pipe(takeUntil(this._unsubscribeAll)).subscribe(markers => {
            this.vehicleMarkers = markers.map(marker => ({ ...marker }));
            this.vehicleMarkers$ = of(this.isCheckedVisibility ? this.vehicleMarkers.filter(marker => marker.isSelected) : [...this.vehicleMarkers]);
            if (this.isCheckedVisibility) {
                this.isCheckedAllUnits = true;
            } else {
                this.isCheckedAllUnits = this.vehicleMarkers.every(item => {
                    return item.isSelected === true;
                });
            }
        });

        this.vehicleMarkersService.poiFilterMarkers$.pipe(takeUntil(this._unsubscribeAll)).subscribe(pois => {
            this.poiMarkers = pois.map(poi => ({ ...poi }));
            this.poiMarkers$ = of(this.isCheckedVisibility ? this.poiMarkers.filter(poi => poi.isSelected) : [...this.poiMarkers]);
            if (this.isCheckedVisibility) {
                this.isCheckedAllPOIs = true;
            } else {
                this.isCheckedAllPOIs = this.poiMarkers.every(item => {
                    return item.isSelected === true;
                });
            }
        });

        this.zonesService.filterZones$.pipe(takeUntil(this._unsubscribeAll)).subscribe(zones => {
            this.zones = zones.map(zone => ([...zone]));
            this.zones$ = of(this.isCheckedVisibility ? this.zones.filter(zone => zone[0].isSelected) : [...this.zones]);
            if (this.isCheckedVisibility) {
                this.isCheckedAllZones = true;
            } else {
                this.isCheckedAllZones = this.zones.every(item => {
                    return item[0].isSelected === true;
                });
            }
        });

        this.routesService.filterRoutes$.pipe(takeUntil(this._unsubscribeAll)).subscribe(routes => {
            this.routes = routes.map(route => ([...route]));
            this.routes$ = of(this.isCheckedVisibility ? this.routes.filter(route => route[0].isSelected) : [...this.routes]);
            if (this.isCheckedVisibility) {
                this.isCheckedAllRoutes = true;
            } else {
                this.isCheckedAllRoutes = this.routes.every(item => {
                    return item[0].isSelected === true;
                });
            }
        });

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
        if (this.currentOpenedPanel === 'unittypeArray') {
            this.getFilterPanelClists('unittype_clist');
        } else if (this.currentOpenedPanel === 'unitclistArray') {
            this.unitclistpage = 1;
        } else if (this.currentOpenedPanel === 'userPOIsArray') {
            this.isFilterPanel = false;
            this.userpoipage = 1;
        } else if (this.currentOpenedPanel === 'zonesArray') {
            this.isFilterPanel = false;
            this.zonepage = 1;
        } else if (this.currentOpenedPanel === 'routesArray') {
            this.isFilterPanel = false;
            this.routepage = 1;
        }
    }

    checkUncheckAllUnit(isCheckedAll: any, type: string) {
        if (type === 'unitclistArray') {
            this.vehicleMarkers = this.vehicleMarkers.map(unit => {
                unit.isSelected = isCheckedAll;
                return unit;
            });
            this.filterUnitEmitter();
        } else if (type === 'unittypeid') {
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
        } else if (type === 'userPOIsArray') {
            this.poiMarkers = this.poiMarkers.map(poi => {
                poi.isSelected = isCheckedAll;
                return poi;
            });

            this.filterPOIsEmitter();
        } else if (type === 'zonesArray') {
            this.zones = this.zones.map(zone => {
                zone.map(path => {
                    path.isSelected = isCheckedAll;
                    return path;
                });
                return zone;
            });

            this.filterZonesEmitter();
        } else if (type === 'routesArray') {
            this.routes = this.routes.map(route => {
                route.map(path => {
                    path.isSelected = isCheckedAll;
                    return path;
                });
                return route;
            });

            this.filterRoutesEmitter();
        }
    }

    isAllSelected(data: any, type: string) {
        if (type === 'unitclistArray') {
            this.onCheckboxChangeUnit(data, type);
        } else if (type === 'unittypeid') {
            this.isCheckedAllUnitType = this.unittypeData_temp.every(item => {
                return item.isSelected == true;
            });
            this.onCheckboxChangeUnit(data, type);
        } else if (type === 'userPOIsArray') {
            this.onCheckboxChangePOI(data, type);
        } else if (type === 'zonesArray') {
            this.onCheckboxChangeZone(data, type);
        } else if (type === 'routesArray') {
            this.onCheckboxChangeRoute(data, type);
        }
    }

    onCheckboxChangeUnit(data: any, type: string) {
        if (data.isSelected) {
            if (type === 'unitclistArray') {
                this.vehicleMarkers.map(marker => {
                    if (marker.id === data.id) {
                        marker.isSelected = true;
                    }
                });
            }
            this.uncheckedFilterOption = this.uncheckedFilterOption.filter(filter => filter.type !== type || (filter.type === type && filter.id !== data.id));
        } else {
            if (type === 'unitclistArray') {
                this.vehicleMarkers.map(marker => {
                    if (marker.id === data.id) {
                        marker.isSelected = false;
                    }
                });
            }
            this.uncheckedFilterOption.push({ type: type, id: data.id });
        }

        this.filterUnitEmitter();
    }

    onCheckboxChangePOI(data: any, type: string) {
        if (data.isSelected) {
            if (type === 'userPOIsArray') {
                this.poiMarkers.map(marker => {
                    if (marker.id === data.id) {
                        marker.isSelected = true;
                    }
                });
            }
            this.uncheckedPOIsFilterOption = this.uncheckedPOIsFilterOption.filter(filter => filter.type !== type || (filter.type === type && filter.id !== data.id));
        } else {
            if (type === 'userPOIsArray') {
                this.poiMarkers.map(poi => {
                    if (poi.id === data.id) {
                        poi.isSelected = false;
                    }
                });
            }
            this.uncheckedPOIsFilterOption.push({ type: type, id: data.id });
        }

        this.filterPOIsEmitter();
    }

    onCheckboxChangeZone(data: any, type: string) {
        if (type === 'zonesArray') {
            this.zones.map(zone => {
                if (zone[0].name === data[0].name) {
                    zone.map(path => path.isSelected = data[0].isSelected)
                }
            });
        }
        this.filterZonesEmitter();
    }
    onCheckboxChangeRoute(data: any, type: string) {
        if (type === 'zonesArray') {
            this.routes.map(route => {
                if (route[0].name === data[0].name) {
                    route.map(path => path.isSelected = data[0].isSelected)
                }
            });
        }
        this.filterRoutesEmitter();
    }

    filterUnitEmitter() {
        this.filterPanelService.loadingsubject.next(false);
        let tempVehicleMarkers: VehicleModel[];
        if (this.uncheckedFilterOption.length > 0) {
            this.uncheckedFilterOption.forEach((option: any) => {
                if (option.type === 'Speed') {
                    if (option.id === 0) {
                        tempVehicleMarkers = this.vehicleMarkers.filter(unit => unit[option.type] !== option.id);
                    } else {
                        tempVehicleMarkers = this.vehicleMarkers.filter(unit => unit[option.type] === 0);
                    }
                } else if (option.type === 'LastReport') {
                    switch (option.id) {
                        case 1:
                            tempVehicleMarkers = this.vehicleMarkers.filter(unit => (new Date().getTime() - new Date(unit[option.type] + 'Z').getTime()) / 1000 > 1800);
                            break;
                        case 2:
                            tempVehicleMarkers = this.vehicleMarkers.filter(unit => (new Date().getTime() - new Date(unit[option.type] + 'Z').getTime()) / 1000 <= 1800 || (new Date().getTime() - new Date(unit[option.type] + 'Z').getTime()) / 1000 > 3600);
                            break;
                        case 3:
                            tempVehicleMarkers = this.vehicleMarkers.filter(unit => (new Date().getTime() - new Date(unit[option.type] + 'Z').getDate()) / 1000 <= 3600 || (new Date().getTime() - new Date(unit[option.type] + 'Z').getDate()) / 1000 > 86400);
                            break;
                        case 4:
                            tempVehicleMarkers = this.vehicleMarkers.filter(unit => (new Date().getTime() - new Date(unit[option.type] + 'Z').getDate()) / 1000 <= 86400);
                            break;
                    }
                } else {
                    tempVehicleMarkers = this.vehicleMarkers.filter(unit => unit[option.type] !== option.id);
                }
            });
        } else {
            tempVehicleMarkers = this.vehicleMarkers.map(unit => ({ ...unit }));;
        }

        this.vehicleMarkersService.updateVehicleMarkers(tempVehicleMarkers.filter(marker => marker.isSelected));
        this.vehicleMarkersService.updateFilterMarkers(tempVehicleMarkers);
        this.vehicleMarkers$ = of(this.isCheckedVisibility ? tempVehicleMarkers.filter(marker => marker.isSelected) : tempVehicleMarkers);

        this.filterUnits.emit({ vehicles: this.vehicleMarkers$ });
        setTimeout(() => {
            this.filterPanelService.loadingsubject.next(true);
        }, 500);
    }

    filterPOIsEmitter() {
        this.filterPanelService.loadingsubject.next(false);
        let tempUserPOIsData: POIModel[];
        if (this.uncheckedPOIsFilterOption.length > 0) {
            this.uncheckedPOIsFilterOption.forEach((option: any) => {
                tempUserPOIsData = this.poiMarkers.filter(poi => poi[option.type] !== option.id);
            });
        } else {
            tempUserPOIsData = this.poiMarkers.map(poi => ({ ...poi }));
        }

        this.vehicleMarkersService.updatePoiMarkers(tempUserPOIsData.filter(poi => poi.isSelected));
        this.vehicleMarkersService.updatePoiFilterMarkers(tempUserPOIsData);
        this.poiMarkers$ = of(this.isCheckedVisibility ? tempUserPOIsData.filter(poi => poi.isSelected) : tempUserPOIsData);

        this.filterUnits.emit({ pois: this.poiMarkers$ });
        setTimeout(() => {
            this.filterPanelService.loadingsubject.next(true);
        }, 500);
    }

    filterZonesEmitter() {
        this.filterPanelService.loadingsubject.next(false);
        let tempZonesData: Array<ZoneRouteModel[]>;

        tempZonesData = this.zones.map(zone => ([...zone]));

        this.zonesService.updateZones(tempZonesData.filter(zone => zone[0].isSelected));
        this.zonesService.updateFilterZones(tempZonesData);
        this.zones$ = of(this.isCheckedVisibility ? tempZonesData.filter(zone => zone[0].isSelected) : tempZonesData);

        this.filterUnits.emit({ zones: this.zones$ });
        setTimeout(() => {
            this.filterPanelService.loadingsubject.next(true);
        }, 500);
    }

    filterRoutesEmitter() {
        this.filterPanelService.loadingsubject.next(false);
        let tempRoutesData: Array<ZoneRouteModel[]>;

        tempRoutesData = this.routes.map(route => ([...route]));

        this.routesService.updateRoutes(tempRoutesData.filter(route => route[0].isSelected));
        this.routesService.updateFilterRoutes(tempRoutesData);
        this.routes$ = of(this.isCheckedVisibility ? tempRoutesData.filter(route => route[0].isSelected) : tempRoutesData);

        this.filterUnits.emit({ routes: this.routes$ });
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
        this.vehicleMarkersService.updateVehicleMarkers(this.vehicleMarkers.map(marker => { marker.isSelected = true; return marker; }));
        this.vehicleMarkersService.updatePoiMarkers(this.poiMarkers.map(poi => { poi.isSelected = true; return poi; }));
        this.zonesService.updateZones(this.zones.map(zone => {
            zone.map(path => {
                path.isSelected = true; return path;
            });
            return zone;
        }));

        this.routesService.updateRoutes(this.routes.map(route => {
            route.map(path => {
                path.isSelected = true; return path;
            });
            return route;
        }));

        this.filterPanelCloseEmitter.emit(false);
        this.unitInfoSideBarService.getSidebar(key).toggleOpen();
        setTimeout(() => {
            this.filterPanelService.loadingsubject.next(true);
        }, 500);
    }

    clearFilter() {
        this.filter_string = '';
        if (this.currentOpenedPanel === 'unittypeArray') {
            this.unittypeData_temp = this.unittypeData.map(type => ({ ...type }));
            this.unittypepage = 1;
        } else if (this.currentOpenedPanel === 'unitclistArray') {
            this.vehicleMarkers$ = of(this.vehicleMarkers.filter(marker => (this.isCheckedVisibility && marker.isSelected) || !this.isCheckedVisibility));
            this.unitclistpage = 1;
        } else if (this.currentOpenedPanel === 'userPOIsArray') {
            this.poiMarkers$ = of(this.poiMarkers.filter(poi => (this.isCheckedVisibility && poi.isSelected) || !this.isCheckedVisibility));
            this.userpoipage = 1;
        } else if (this.currentOpenedPanel === 'zonesArray') {
            this.zones$ = of(this.zones.filter(zone => (this.isCheckedVisibility && zone[0].isSelected) || !this.isCheckedVisibility));
            this.zonepage = 1;
        } else if (this.currentOpenedPanel === 'routesArray') {
            this.routes$ = of(this.routes.filter(route => (this.isCheckedVisibility && route[0].isSelected) || !this.isCheckedVisibility));
            this.routepage = 1;
        }
    }

    onKey(event: any) {
        this.filter_string = event.target.value.toLowerCase();
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            if (this.currentOpenedPanel === 'unittypeArray') {
                this.unittypeData_temp = this.unittypeData.filter(unit => unit.name.toLowerCase().includes(this.filter_string));
                this.unittypepage = 1;
            } else if (this.currentOpenedPanel === 'unitclistArray') {
                this.vehicleMarkers$ = of(this.vehicleMarkers.filter(unit => unit.name.toLowerCase().includes(this.filter_string) && ((this.isCheckedVisibility && unit.isSelected) || !this.isCheckedVisibility)));
                this.unitclistpage = 1;
            } else if (this.currentOpenedPanel === 'userPOIsArray') {
                this.poiMarkers$ = of(this.poiMarkers.filter(poi => poi.name.toLowerCase().includes(this.filter_string) && ((this.isCheckedVisibility && poi.isSelected) || !this.isCheckedVisibility)));
                this.unittypepage = 1;
            } else if (this.currentOpenedPanel === 'zonesArray') {
                this.zones$ = of(this.zones.filter(zone => zone[0].name.toLowerCase().includes(this.filter_string) && ((this.isCheckedVisibility && zone[0].isSelected) || !this.isCheckedVisibility)));
                this.zonepage = 1;
            } else if (this.currentOpenedPanel === 'routesArray') {
                this.routes$ = of(this.routes.filter(route => route[0].name.toLowerCase().includes(this.filter_string) && ((this.isCheckedVisibility && route[0].isSelected) || !this.isCheckedVisibility)));
                this.routepage = 1;
            }
        }
    }

    switchVisibility(): void {
        this.filter_string = '';
        if (this.isCheckedVisibility) {
            this.vehicleMarkers$ = of(this.vehicleMarkers.filter(marker => marker.isSelected));
            this.isCheckedAllUnits = true;

            this.poiMarkers$ = of(this.poiMarkers.filter(poi => poi.isSelected));
            this.isCheckedAllPOIs = true;

            this.zones$ = of(this.zones.filter(zone => zone[0].isSelected));
            this.isCheckedAllZones = true;

            this.routes$ = of(this.routes.filter(route => route[0].isSelected));
            this.isCheckedAllRoutes = true;
        } else {
            this.vehicleMarkersService.filterMarkers$.pipe(takeUntil(this._unsubscribeAll)).subscribe(markers => {
                this.vehicleMarkers = markers.map(marker => ({ ...marker }));
                this.vehicleMarkers$ = of([...this.vehicleMarkers]);

                this.isCheckedAllUnits = this.vehicleMarkers.every(item => {
                    return item.isSelected === true;
                });
            });

            this.vehicleMarkersService.poiFilterMarkers$.pipe(takeUntil(this._unsubscribeAll)).subscribe(pois => {
                this.poiMarkers = pois.map(poi => ({ ...poi }));
                this.poiMarkers$ = of([...this.poiMarkers]);

                this.isCheckedAllPOIs = this.poiMarkers.every(item => {
                    return item.isSelected === true;
                });
            });

            this.zonesService.filterZones$.pipe(takeUntil(this._unsubscribeAll)).subscribe(zones => {
                this.zones = zones.map(zone => ([...zone]));
                this.zones$ = of([...this.zones]);

                this.isCheckedAllZones = this.zones.every(item => {
                    return item[0].isSelected === true;
                });
            });

            this.routesService.filterRoutes$.pipe(takeUntil(this._unsubscribeAll)).subscribe(routes => {
                this.routes = routes.map(route => ([...route]));
                this.routes$ = of([...this.routes]);

                this.isCheckedAllRoutes = this.routes.every(item => {
                    return item[0].isSelected === true;
                });
            });
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
