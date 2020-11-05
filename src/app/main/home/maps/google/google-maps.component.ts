import { MouseEvent, MapsAPILoader, GoogleMapsAPIWrapper, AgmMap, AgmFitBounds, LatLngBounds, LatLngBoundsLiteral, FitBoundsAccessor } from '@agm/core';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { VehMarkersDataSource } from "app/main/home/maps/services/vehmarkers.datasource";
import { VehMarkersService } from 'app/main/home/maps/services/vehmarkers.service';
import { ZonesService } from 'app/main/home/maps/services/zones.service';
import { UnitInfoSidebarService } from 'app/main/home/maps/sidebar/sidebar.service';
import { navigation } from 'app/navigation/navigation';
import * as _ from 'lodash';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare const google: any;

@Component({
    selector: 'docs-components-third-party-google-maps',
    templateUrl: './google-maps.component.html',
    styleUrls: ['./google-maps.component.scss']
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

    lat: number;
    lng: number;
    dataSource: VehMarkersDataSource;
    vehmarkers: any = [];
    vehmarkers_temp: any = [];
    unitClist: any = [];
    tmpVehmarkers: marker[];
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

    @ViewChild('AgmMap') agmMap: AgmMap;

    constructor(
        private _adminVehMarkersService: VehMarkersService
        , private _adminZonesService: ZonesService
        , private _adminRoutesService: RoutesService,
        private unitInfoService: UnitInfoService
        , private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService
        , private _unitInfoSidebarService: UnitInfoSidebarService
        , private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _authService: AuthService,
        private mapsAPILoader: MapsAPILoader,
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

        forkJoin(
            this._adminVehMarkersService.getVehMarkers(),
            this._adminZonesService.getZones(),
            this._adminRoutesService.getRoutes(),
        ).pipe(takeUntil(this._unsubscribeAll)).subscribe(([marker, zone, route]) => {
            // this.vehmarkers = marker.TrackingXLAPI.DATA.slice(0, 10);
            this.vehmarkers = marker.TrackingXLAPI.DATA;
            this.zones = JSON.parse("[" + zone.TrackingXLAPI.DATA[0].paths + "]");
            this.routes = JSON.parse("[" + route.TrackingXLAPI.DATA[0].paths + "]");
            console.log(this.vehmarkers);
            this.vehmarkers_temp = this.vehmarkers.map(unit => ({ ...unit }));
            this.unitClist = this.vehmarkers.map(unit => ({ ...unit }));
        });
    }

    ngOnInit() {
        this.selectedLanguage = _.find(this.languages, { id: this._translateService.currentLang });
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

    async loadMapData() {
        let marker = await this._adminVehMarkersService.getVehMarkers().pipe(takeUntil(this._unsubscribeAll)).toPromise();
        this.vehmarkers = marker.TrackingXLAPI.DATA.slice(0, 10);

        let zone = await this._adminZonesService.getZones().pipe(takeUntil(this._unsubscribeAll)).toPromise()
        this.zones = JSON.parse("[" + zone.TrackingXLAPI.DATA[0].paths + "]");

        let route = await this._adminRoutesService.getRoutes().pipe(takeUntil(this._unsubscribeAll)).toPromise()
        this.routes = JSON.parse("[" + route.TrackingXLAPI.DATA[0].paths + "]");
    }

    toggleSidebarOpen(key, id?): void {
        if (key == 'unitInfoPanel') {
            this.unitInfoService.getUnitInfo(id)
                .pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {
                    this.currentUnit = JSON.parse(res.TrackingXLAPI.DATA[0].Column1).unit;
                    this.currentOperator = JSON.parse(res.TrackingXLAPI.DATA[0].Column1).operator;
                    this.currentEvents = JSON.parse(res.TrackingXLAPI.DATA[0].Column1).events;
                });
            this._unitInfoSidebarService.getSidebar(key).toggleOpen();
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


    clickedMarker(id: any) {
        this.toggleSidebarOpen('unitInfoPanel', id);
    }

    mapClicked($event: MouseEvent) {

    }

    markerDragEnd(m: marker, $event: MouseEvent) {

    }

    onShowValChange(value) {
        if (value == "showVehicles") {
            this.showVehicles = !this.showVehicles;

            if (this.showVehicles) {
                this.vehmarkers = Object.assign([], this.tmpVehmarkers);
                //this.tmpVehmarkers.forEach(val => this.vehmarkers.push(Object.assign({}, val)));
                this.tmpVehmarkers.length = 0;
            }
            else {
                this.tmpVehmarkers = Object.assign([], this.vehmarkers);
                //this.vehmarkers.forEach(val => this.tmpVehmarkers.push(Object.assign({}, val)));
                this.vehmarkers.length = 0;
            }
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
        this.lat = 25.7959;
        this.lng = -80.2871;
        this.zoom = 12;
    }
    filterUnits(event: any) {
        console.log(event);
        this.vehmarkers_temp = event;
        this.lat = 25.7959;
        this.lng = -80.2871;
        this.zoom = 12;
    }

    unitLocateNow(event: any) {
        console.log(event);
        this.lat = event.lat;
        this.lng = event.lng;
        this.zoom = 16;
    }

    unitInfoToggleOff(event) {

    }

    setVisible(value) {
        for (var i = 0; i < this.vehmarkers.length; i++) {
            this.vehmarkers[i].visible = value;
        }
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