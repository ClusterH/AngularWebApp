import { AgmMap, LatLngBounds } from '@agm/core';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as vehiclesEnglish } from 'app/core/authentication/i18n/en';
import { locale as vehiclesFrench } from 'app/core/authentication/i18n/fr';
import { locale as vehiclesPortuguese } from 'app/core/authentication/i18n/pt';
import { locale as vehiclesSpanish } from 'app/core/authentication/i18n/sp';
import { AuthService } from 'app/core/authentication/services/authentication.service';
import { UnitInfoSidebarService } from 'app/main/home/maps/sidebar/sidebar.service';
import { navigation } from 'app/core/navigation/navigation';
import * as _ from 'lodash';
import { forkJoin, Observable, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { FilterPanelService, RoutesService, UnitInfoService, VehMarkersService, ZonesService } from '../services';
import { AgmDirectionGeneratorService } from 'app/sharedModules/services';
import { MatFabButtonComponent } from '../components/mat-fab-button/mat-fab-button.component';
import { LanguageModel } from '../models';
import { UserObjectModel } from 'app/sharedModules/models';

declare const google: any;

@Component({
    selector: 'docs-components-third-party-google-maps',
    templateUrl: './google-maps.component.html',
    styleUrls: ['./google-maps.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsComponentsThirdPartyGoogleMapsComponent implements OnInit, OnDestroy {
    selectedLanguage: LanguageModel;
    languages: LanguageModel[];
    userObject: UserObjectModel;
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    navigation: any;

    private _unsubscribeAll: Subject<any>;
    currentUnit: any = {};
    currentOperator: any;
    currentEvents: any;
    currentPOI: any;
    currentPOIEvents: any;
    lat: number = 25.7959;
    lng: number = -80.2871;
    vehmarkers: any = [];
    vehmarkers_temp: any = [];
    userPOIs: any = [];
    userPOIs_temp: any = [];
    unitClist: any = [];
    poiClist: any = [];
    tmpVehmarkers: Marker[] = [];
    tmpPOIs: Marker[];
    zones: Marker[];
    routes: any;
    tmpZones: Marker[] = [];
    tmpRoutes: Marker[] = [];
    zoom: number = 12;
    bounds: any;
    minClusterSize = 2;
    isClickedEvent: boolean = false;
    isTrackUnitHistory: boolean = false;
    eventLocation: any = [];
    trackHistoryPolylines: any = [];
    polygon: any;

    showVehicles: boolean = true;
    showZones: boolean = true;
    showPOIs: boolean = true;
    showRoutes: boolean = true;
    showFilters: boolean = false;
    selectedCountry: string;
    user: any;
    map: any;
    //create New Option section
    createOptionType: string = 'Anyone';
    newRouteLocations: Array<Marker> = [];
    newRouteOrigin: Marker;
    newRouteDestination: Marker;
    newRouteStops: any = [];
    newRouteStopsTemp: any = [];
    newRoutePath: any = [];
    isGenerateRoute: boolean = false;
    isImportStopsFromFile: boolean = false;
    isAddStopsOnMap: boolean = false;
    waypointDistance: Array<any> = [];
    countDisRequest: number = 0;
    directionDisplayer: any;
    directionsService: any;

    routerLinkType: string = '';

    unit_icon = {
        url: 'assets/icons/googlemap/unit-marker.png',
        scaledSize: { width: 33, height: 44 },
        labelOrigin: { x: 15, y: 50 }
    }
    poi_icon = {
        url: 'assets/icons/googlemap/employment.png',
        scaledSize: { width: 33, height: 44 },
        labelOrigin: { x: 15, y: 50 }
    }

    @ViewChild('AgmMap') agmMap: AgmMap;
    @ViewChild(MatFabButtonComponent) fabBtnComponent: MatFabButtonComponent;

    constructor(
        private vehMarkersService: VehMarkersService,
        private _adminZonesService: ZonesService,
        private _adminRoutesService: RoutesService,
        private unitInfoService: UnitInfoService,
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _unitInfoSidebarService: UnitInfoSidebarService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _authService: AuthService,
        public filterPanelService: FilterPanelService,
        public agmDirectionGeneratorService: AgmDirectionGeneratorService,
        private router: Router,
        private activatedroute: ActivatedRoute
    ) {
        this.userObject = JSON.parse(localStorage.getItem('userObjectList'))[0];
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(vehiclesEnglish, vehiclesSpanish, vehiclesFrench, vehiclesPortuguese);
        this._fuseConfigService.config = {
            layout: {
                toolbar: {
                    hidden: true
                },
                navbar: {
                    folded: true
                }
            }
        };

        this.languages = [
            { id: 'en', title: 'English', flag: 'us' },
            { id: 'sp', title: 'Spanish', flag: 'sp' },
            { id: 'fr', title: 'French', flag: 'fr' },
            { id: 'pt', title: 'Portuguese', flag: 'pt' },
        ];

        this.navigation = navigation;
        this.activatedroute.paramMap.pipe(takeUntil(this._unsubscribeAll)).subscribe(params => {
            this.routerLinkType = params.get('type');
            if (this.routerLinkType != 'main') {
                this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
                    this.currentPOI = data;
                });
            }
        });

        this.startLoadingMapData();
    }

    ngOnInit() {
        this.selectedLanguage = _.find(this.languages, { id: this._translateService.currentLang });
        if (this.routerLinkType != 'main') {
            setTimeout(() => {
                this.clickedMarker(this.currentPOI.id, 'poiInfoPanel');
            }, 500);
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    startLoadingMapData(): void {
        const vehmarks = this.vehMarkersService.getVehMarkers('GetVehicleLocations');
        const userpois = this.vehMarkersService.getVehMarkers('GetUserPOIs');
        const zone = this._adminZonesService.getZones();
        const route = this._adminRoutesService.getRoutes();

        forkJoin([vehmarks, userpois, zone, route]).pipe(takeUntil(this._unsubscribeAll)).subscribe(([marker, poi, zone, route]) => {
            this.vehmarkers = marker.TrackingXLAPI.DATA;
            this.userPOIs = poi.TrackingXLAPI.DATA;
            this.zones = JSON.parse("[" + zone.TrackingXLAPI.DATA[0].paths + "]");
            this.routes = JSON.parse("[" + route.TrackingXLAPI.DATA[0].paths + "]");
            this.filterPanelService.loadVehMarkers(this.vehmarkers);
            this.filterPanelService.loadUserPOIs(this.userPOIs);
            setTimeout(() => {
                this.filterPanelService.loadingsubject.next(true);
            }, 500);
            this.unitClist = this.vehmarkers.map(unit => ({ ...unit }));
            this.poiClist = this.userPOIs.map(poi => ({ ...poi }));
        });
    }

    setLanguage(lang): void {
        this.selectedLanguage = lang;
        this._translateService.use(lang.id);
    }

    logOut() {
        this._authService.logOut();
    }

    onMapReady(map: any) {
        this.map = map;
    }

    trackedMarker(index: number, item: any): number {
        return item ? item.id : undefined;
    }

    toggleSidebarOpen(key, id?): void {
        if (key == 'unitInfoPanel') {
            this.unitInfoService.getUnitInfo(id)
                .pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {
                    this.currentUnit = JSON.parse(res.TrackingXLAPI.DATA[0].Column1).unit;
                    this.currentOperator = JSON.parse(res.TrackingXLAPI.DATA[0].Column1).operator;
                    this.currentEvents = JSON.parse(res.TrackingXLAPI.DATA[0].Column1).events;
                    this._unitInfoSidebarService.getSidebar(key).toggleOpen();
                });
        } else if (key == 'poiInfoPanel') {
            this.unitInfoService.getPOIInfo_v1(id)
                .pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {
                    this.currentPOI = JSON.parse(res.TrackingXLAPI.DATA[0].Column1).poi;
                    this.currentEvents = JSON.parse(res.TrackingXLAPI.DATA[0].Column1).events;
                    this._unitInfoSidebarService.getSidebar(key).toggleOpen();
                });

        } else if (key == 'filterPanel') {
            if (this.showFilters) {
                this._unitInfoSidebarService.getSidebar(key).toggleOpen();
            } else {
                this._unitInfoSidebarService.getSidebar(key).close();
            }
        } else if (key == 'trackPanel') {
            this._unitInfoSidebarService.getSidebar(key).toggleOpen();
        }
    }

    toggleFuseSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    clickedMarker(id: any, type: string) {
        this.toggleSidebarOpen(type, id);
    }

    onShowValChange(value) {
        if (value == "showVehicles") {
            this.filterPanelService.loadingsubject.next(false);
            this.showVehicles = !this.showVehicles;
            if (this.showVehicles) {
                this.filterPanelService.loadVehMarkers(this.tmpVehmarkers);
                this.tmpVehmarkers = [];
            }
            else {
                this.tmpVehmarkers = Object.assign([], this.filterPanelService.vehmarkerSubject.value);
                this.filterPanelService.loadVehMarkers([]);
            }
            setTimeout(() => {
                this.filterPanelService.loadingsubject.next(true);
            }, 500);
        }
        else if (value == "showPOIs") {
            this.filterPanelService.loadingsubject.next(false);
            this.showPOIs = !this.showPOIs;
            if (this.showPOIs) {
                this.filterPanelService.loadUserPOIs(this.tmpPOIs);
                this.tmpPOIs = [];
            }
            else {
                this.tmpPOIs = Object.assign([], this.filterPanelService.userPOISubject.value);
                this.filterPanelService.loadUserPOIs([]);
            }
            setTimeout(() => {
                this.filterPanelService.loadingsubject.next(true);
            }, 500);
        }
        else if (value == "showZones") {
            this.showZones = !this.showZones;
            if (this.showZones) {
                this.zones = Object.assign([], this.tmpZones);
                this.tmpZones.length = 0;
            }
            else {
                this.tmpZones = Object.assign([], this.zones);
                this.zones.length = 0;
            }
        }
        else if (value == "showRoutes") {
            this.showRoutes = !this.showRoutes;

            if (this.showRoutes) {
                this.routes = Object.assign([], this.tmpRoutes);
                this.tmpRoutes.length = 0;
            }
            else {
                this.tmpRoutes = Object.assign([], this.routes);
                this.routes.length = 0;
            }
        }
        else if (value == "showFilters") {
            this.toggleSidebarOpen('filterPanel');
        }
    }

    newOptionEmitter(event: string): void {
        console.log(event);
        this.createOptionType = event;

        const optionList = {
            "showVehicles": this.showVehicles,
            "showPOIs": this.showPOIs,
            "showZones": this.showZones,
            "showRoutes": this.showRoutes,
        }

        if (event !== 'Anyone') {
            if (event === 'Create Route') {
                this.agmDirectionGeneratorService.directionsService = new google.maps.DirectionsService();
                this.agmDirectionGeneratorService.directionDisplayer = new google.maps.DirectionsRenderer({
                    draggable: true,
                    map: this.map
                });

                google.maps.event.addListener(this.agmDirectionGeneratorService.directionDisplayer, 'directions_changed', () => {
                    console.log('google change direection===>>>');
                    this.agmDirectionGeneratorService.onChangeRouteByDragging(this.agmDirectionGeneratorService.directionDisplayer.directions);
                });
            }
            for (let option in optionList) {
                if (optionList[option]) {
                    console.log(option);
                    this.onShowValChange(option);
                }
            }
        } else {
            for (let option in optionList) {
                if (!optionList[option]) {
                    this.onShowValChange(option);
                }
            }
        }
    }

    filterToggleOff(event) {
        this.showFilters = false;
        if (!this.showVehicles) {
            this.tmpVehmarkers = Object.assign([], this.filterPanelService.vehmarkerSubject.value);
            this.filterPanelService.loadVehMarkers([]);
        }
        if (!this.showPOIs) {
            this.tmpPOIs = Object.assign([], this.filterPanelService.userPOISubject.value);
            this.filterPanelService.loadUserPOIs([]);
        }
        this.lat = 25.7959;
        this.lng = -80.2871;
        this.zoom = 12;
    }

    filterUnits(event: boolean) {
        this.lat = 25.7959;
        this.lng = -80.2871;
        this.zoom = 12;
    }

    unitLocateNow(event: any) {

        if (event.isSelected) {
            this.zoom = 16;
        } else {
            this.zoom = 12;
        }
        this.lat = event.lat + (0.0000000000100 * Math.random());
        this.lng = event.lng + (0.0000000000100 * Math.random());
    }

    unitInfoToggleOff(event) {

    }

    showVisibleOnlyEmitter(event: boolean): void {
        console.log(event);
        const bounds = this.agmMap.LatLngBounds();
        console.log(bounds);
        this.vehmarkers.map(marker => {
            if (bounds.contains({ lat: marker.lat, lng: marker.lng })) {
                marker.visible = true;
            } else {
                marker.visible = false;
            }

            return marker;
        })

        this.unitClist = this.vehmarkers.map(unit => ({ ...unit }));
    }

    setVisible(value) {
        for (var i = 0; i < this.vehmarkers.length; i++) {
            this.vehmarkers[i].visible = value;
        }
    }

    showInfoUnit(infoWindow: any, gm: any) {
        if (gm.lastOpen != null) {
            gm.lastOpen.close();
        }
        gm.lastOpen = infoWindow;
        infoWindow.open();
    }

    options: any = {
        lat: 33.5362475,
        lng: -111.9267386,
        zoom: 10,
        fillColor: '#DC143C',
        draggable: true,
        editable: true,
        visible: true
    };

    showEventLocation(event: any) {
        this.eventLocation = event;
        this.isClickedEvent = true;
        this.lat = event[0].latitude;
        this.lng = event[0].longitude;
    }

    cleanEventLocation() {
        this.zoom = 12;
        this.isClickedEvent = false;
    }

    showHideTrackPolyline(event: any) {
        if (event.option == 'showhide' || event.option == 'delete') {
            if (event.tracks.length == 0) {
                this.isTrackUnitHistory = false;
                this.cleanTrackLocation(event.option);
            } else {
                this.isTrackUnitHistory = true;
                this.trackHistoryPolylines = event.tracks;
            }
        } else if (event.option == 'add') {
            this.trackHistoryPolylines = [];
            this.isTrackUnitHistory = true;
            this.trackHistoryPolylines = event.tracks;
        }
    }

    cleanTrackLocation(option?: any) {
        this.isTrackUnitHistory = false;
        if (option == 'delete') {
            this.unitInfoService.TrackHistoryList.next(null);
        }

        this.resetFitBound();
    }

    resetFitBound(): void {
        this.lat = 25.7959;
        this.lng = -80.2871;
        this.zoom = 12;
        const bounds: LatLngBounds = new google.maps.LatLngBounds();
        bounds.extend(new google.maps.LatLng(this.lat, this.lng));
        this.map.fitBounds(bounds);
        let zoomChangeBoundsListener = google.maps.event.addListenerOnce(this.map, 'bounds_changed', function (event) {
            if (this.getZoom()) {
                this.setZoom(12);
            }
        });
        setTimeout(() => { google.maps.event.removeListener(zoomChangeBoundsListener) }, 2000);
    }

    centerTrackLocation(event: any) {
        this.isTrackUnitHistory = true;
        if (event.option == 'trackList') {
            const bounds: LatLngBounds = new google.maps.LatLngBounds();
            for (let mm of event.track.historyList) {
                bounds.extend(new google.maps.LatLng(mm.lat, mm.lng));
            }
            this.map.fitBounds(bounds);
        } else if (event.option == 'trackItem') {
            this.lat = Number(event.track.lat);
            this.lng = Number(event.track.lng);
            this.zoom = 12;
        }
    }

    //createNewOption Section

    addRouteLocations(event: any) {
        if (this.createOptionType !== 'Create Route') {
            return false;
        }

        this.agmDirectionGeneratorService.addRouteLocations(event, this.map);
    }

    markerDragEnd(event: any, index: number): void {
        this.agmDirectionGeneratorService.newRouteLocations[index] = { ...event.coords };
    }

    removeRouteEmitter(): void {
        this.agmDirectionGeneratorService.directionDisplayer.setMap(null);
        this.newOptionEmitter('Anyone');
        this.resetFitBound();
        this.fabBtnComponent.fabButtons[0].isActive = false;
    }

    saveRouteEmitter(event: number): void {
        console.log(event);
        if (event > 0) {
            this.agmDirectionGeneratorService.newRoutePath.map(path => {
                path.routeid = event;
                return path;
            });
            setTimeout(() => {
                this._adminRoutesService.setRoutePath(this.agmDirectionGeneratorService.newRoutePath).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                    if (res.responseCode === 100) {
                        alert("Success!");
                        this.agmDirectionGeneratorService.directionDisplayer.setMap(null);
                        this.newOptionEmitter('Anyone');
                        this.fabBtnComponent.fabButtons[0].isActive = false;
                    } else {
                        alert("Failed to save path");
                    }
                })
            }, 500)

        }
    }
}

interface Marker {
    id?: any;
    lat: number;
    lng: number;
    label?: string;
    draggable?: string;
    visible?: boolean;
}