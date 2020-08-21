// import { MouseEvent, GoogleMapsAPIWrapper, AgmMap, LatLngBounds, LatLngBoundsLiteral } from '@agm/core';
import { MouseEvent } from '@agm/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
    vehmarkers: marker[];
    tmpVehmarkers: marker[];
    zones: marker[];
    routes: marker[];
    tmpZones: marker[];
    tmpRoutes: marker[];
    zoom: number = 12;
    minClusterSize = 2;
    isClickedEvent: boolean = false;
    eventLocation: any = [];
    polygon: any;
    showVehicles: boolean = true;
    showZones: boolean = true;
    showPOIs: boolean = true;
    showRoutes: boolean = true;
    showFilters: boolean = false;
    // filterPanToggle: boolean = false;
    selectedCountry: string;
    user: any;

    // @ViewChild('AgmMap') agmMap: AgmMap;

    // managerOptions = {
    //     drawingControl: true,
    //     drawingControlOptions: {
    //       drawingModes: ['polygon'],
    //       position: google.maps.ControlPosition.BOTTOM_LEFT
    //     },
    //     polygonOptions: {
    //       draggable: true,
    //       editable: true
    //     },
    //     drawingMode: "polygon"
    //   };

	/**
	 * Constructor
	 */
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
    ) {
        this.user = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA;
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

        // Set the defaults
        this.lat = 25.7959;
        this.lng = -80.2871;
        this.zoom
        this.tmpVehmarkers = [];
        this.tmpZones = [];
        this.tmpRoutes = [];
    }

    ngOnInit() {
        this.selectedLanguage = _.find(this.languages, { id: this._translateService.currentLang });

        forkJoin(
            this._adminVehMarkersService.getVehMarkers(this.user.conncode, this.user.id),
            this._adminZonesService.getZones(this.user.conncode, this.user.id),
            this._adminRoutesService.getRoutes(this.user.conncode, this.user.id),
        ).pipe(takeUntil(this._unsubscribeAll)).subscribe(([marker, zone, route]) => {
            console.log('marker==========', marker);
            console.log('zone==========', zone);
            console.log('route==========', route);
            this.vehmarkers = marker.TrackingXLAPI.DATA.slice(0, 10);
            this.zones = JSON.parse("[" + zone.TrackingXLAPI.DATA[0].paths + "]");
            this.routes = JSON.parse("[" + route.TrackingXLAPI.DATA[0].paths + "]");
        });
    }

    ngAfterViewInit() { }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    setLanguage(lang): void {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }

    logOut() {
        this._authService.logOut();
    }

    async loadMapData() {
        let marker = await this._adminVehMarkersService.getVehMarkers(this.user.conncode, this.user.id).pipe(takeUntil(this._unsubscribeAll)).toPromise();
        this.vehmarkers = marker.TrackingXLAPI.DATA.slice(0, 10);

        let zone = await this._adminZonesService.getZones(this.user.conncode, this.user.id).pipe(takeUntil(this._unsubscribeAll)).toPromise()
        this.zones = JSON.parse("[" + zone.TrackingXLAPI.DATA[0].paths + "]");

        let route = await this._adminRoutesService.getRoutes(this.user.conncode, this.user.id).pipe(takeUntil(this._unsubscribeAll)).toPromise()
        this.routes = JSON.parse("[" + route.TrackingXLAPI.DATA[0].paths + "]");
    }

    toggleSidebarOpen(key, id?): void {
        // this._unitInfoSidebarService.getSidebar(key).toggleOpen();
        if (key == 'unitInfoPanel') {
            console.log('map->current Unit=====>', id)
            this.unitInfoService.getUnitInfo(this.user.conncode, this.user.id, id)
                .pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {
                    console.log(res);
                    // this.unitInfoService.onUnitChanged = id;
                    // this.currentUnit = JSON.parse(res.TrackingXLAPI.DATA[0]);
                    this.currentUnit = JSON.parse(res.TrackingXLAPI.DATA[0].Column1).unit;
                    console.log(this.currentUnit);
                    this.currentOperator = JSON.parse(res.TrackingXLAPI.DATA[0].Column1).operator;
                    console.log(this.currentOperator);
                    this.currentEvents = JSON.parse(res.TrackingXLAPI.DATA[0].Column1).events;
                    console.log(this.currentEvents);

                });

            // this.unitInfoService.onUnitChanged = id;
            this._unitInfoSidebarService.getSidebar(key).toggleOpen();
        } else if (key == 'filterPanel') {
            if (this.showFilters) {
                this._unitInfoSidebarService.getSidebar(key).toggleOpen();
            } else {
                this._unitInfoSidebarService.getSidebar(key).close();
            }
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
        console.log(event);
        this.showFilters = false;
    }

    unitInfoToggleOff(event) {
        console.log('unitInfoPanel Closed =======>', event);
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
        console.log(event);
        this.eventLocation = event;
        this.isClickedEvent = true;
        // this.agmMap.mapReady.subscribe(map => {
        //     const bounds: LatLngBounds = new google.maps.LatLngBounds();
        //     for (let mm of this.eventLocation) {
        //         bounds.extend(new google.maps.LatLng(mm.latitude, mm.longitude));
        //     }
        //     map.fitBounds(bounds);
        // });
        this.lat = event[0].latitude;
        this.lng = event[0].longitude;
    }

    cleanEventLocation() {
        this.isClickedEvent = false;
    }
}

interface marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: string;
    visible: boolean;
}