import { AgmMap, AgmMarker, LatLngBounds, MapsAPILoader, MouseEvent } from '@agm/core';
import { Component, OnDestroy, OnInit, ViewChild, Input, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as vehiclesEnglish } from 'app/authentication/i18n/en';
import { locale as vehiclesFrench } from 'app/authentication/i18n/fr';
import { locale as vehiclesPortuguese } from 'app/authentication/i18n/pt';
import { locale as vehiclesSpanish } from 'app/authentication/i18n/sp';
import { AuthService } from 'app/authentication/services/authentication.service';
import { RoutesService } from 'app/main/home/maps/services/routes.service';
import { UnitInfoService } from 'app/main/home/maps/services/unitInfo.service';
import { VehMarkersService } from 'app/main/home/maps/services/vehmarkers.service';
import { ZonesService } from 'app/main/home/maps/services/zones.service';
import { UnitInfoSidebarService } from 'app/main/home/maps/sidebar/sidebar.service';
import { FilterPanelService } from 'app/main/home/maps/services/searchfilterpanel.service';

import { navigation } from 'app/navigation/navigation';
import * as _ from 'lodash';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare const google: any;

@Component({
    selector: 'docs-components-third-party-google-maps',
    templateUrl: './google-maps.component.html',
    styleUrls: ['./google-maps.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsComponentsThirdPartyGoogleMapsComponent implements OnInit, OnDestroy {
    selectedLanguage: any;
    languages: any;
    userObject: any;
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    navigation: any

    private _unsubscribeAll: Subject<any>;
    currentUnit: any;
    currentOperator: any;
    currentEvents: any;
    currentPOI: any;
    currentPOIEvents: any;
    lat: number;
    lng: number;
    vehmarkers: any = [];
    vehmarkers_temp: any = [];
    userPOIs: any = [];
    userPOIs_temp: any = [];
    unitClist: any = [];
    poiClist: any = [];
    tmpVehmarkers: marker[];
    tmpPOIs: marker[];
    zones: marker[];
    routes: marker[];
    tmpZones: marker[];
    tmpRoutes: marker[];
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
    // filterPanToggle: boolean = false;
    selectedCountry: string;
    user: any;
    map: any;
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

    constructor(
        private _adminVehMarkersService: VehMarkersService,
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
        this.lat = 25.7959;
        this.lng = -80.2871;
        this.zoom = 12;
        this.tmpVehmarkers = [];
        this.tmpZones = [];
        this.tmpRoutes = [];

        const vehmarks = this._adminVehMarkersService.getVehMarkers('GetVehicleLocations');
        const userpois = this._adminVehMarkersService.getVehMarkers('GetUserPOIs');
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

        this.activatedroute.paramMap.pipe(takeUntil(this._unsubscribeAll)).subscribe(params => {
            this.routerLinkType = params.get('type');
            if (this.routerLinkType != ':type') {
                this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
                    console.log(this.routerLinkType, data);
                    this.currentPOI = data;
                });
            }
        });
    }

    ngOnInit() {
        this.selectedLanguage = _.find(this.languages, { id: this._translateService.currentLang });
        if (this.routerLinkType != ':type') {
            setTimeout(() => {
                this.clickedMarker(this.currentPOI.id, 'poiInfoPanel');
            }, 500);
        }
    }

    ngAfterViewInit() {

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
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
            // this.showFilters = !this.showFilters;
            this.toggleSidebarOpen('filterPanel');
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
        console.log(event);
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

    setVisible(value) {
        for (var i = 0; i < this.vehmarkers.length; i++) {
            this.vehmarkers[i].visible = value;
        }
    }

    showInfoUnit(infoWindow: any, gm: any) {
        console.log(gm);
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

    polygonCreated($event) {

        if (this.polygon) {
            this.polygon.setMap(null);
        }
        this.polygon = $event;
        this.addPolygonChangeEvent(this.polygon);
        google.maps.event.addListener(this.polygon, 'coordinates_changed', function (index, obj) {
            // Polygon object: yourPolygon

        });
    }

    getPaths() {

        if (this.polygon) {
            const vertices = this.polygon.getPaths().getArray()[0];
            let paths = [];
            vertices.getArray().forEach(function (xy, i) {
                //
                let latLng = {
                    lat: xy.lat(),
                    lng: xy.lng()
                };
                paths.push(JSON.stringify(latLng));
            });
            return paths;
        }
        return [];
    }

    addPolygonChangeEvent(polygon) {
        var me = polygon,
            isBeingDragged = false,
            triggerCoordinatesChanged = function () {
                // Broadcast normalized event
                google.maps.event.trigger(me, 'coordinates_changed');
            };

        // If  the overlay is being dragged, set_at gets called repeatedly,
        // so either we can debounce that or igore while dragging,
        // ignoring is more efficient
        google.maps.event.addListener(me, 'dragstart', function () {
            isBeingDragged = true;
        });

        // If the overlay is dragged
        google.maps.event.addListener(me, 'dragend', function () {
            triggerCoordinatesChanged();
            isBeingDragged = false;
        });

        // Or vertices are added to any of the possible paths, or deleted
        var paths = me.getPaths();
        paths.forEach(function (path, i) {
            google.maps.event.addListener(path, "insert_at", function () {
                triggerCoordinatesChanged();
            });
            google.maps.event.addListener(path, "set_at", function () {
                if (!isBeingDragged) {
                    triggerCoordinatesChanged();
                }
            });
            google.maps.event.addListener(path, "remove_at", function () {
                triggerCoordinatesChanged();
            });
        });
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
        // this.agmMap.fitBounds('true');


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

        this.lat = 25.7959;
        this.lng = -80.2871;
        this.zoom = 12;
        const bounds: LatLngBounds = new google.maps.LatLngBounds();
        // for (let mm of this.vehmarkers) {
        bounds.extend(new google.maps.LatLng(this.lat, this.lng));
        // }

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
}

interface marker {
    id?: any;
    lat: number;
    lng: number;
    label?: string;
    draggable: string;
    visible: boolean;
}