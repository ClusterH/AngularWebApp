import { AgmMap, LatLngBounds } from '@agm/core';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as mapEnglish } from 'app/main/home/maps/i18n/en';
import { locale as mapFrench } from 'app/main/home/maps/i18n/en';
import { locale as mapPortuguese } from 'app/main/home/maps/i18n/en';
import { locale as mapSpanish } from 'app/main/home/maps/i18n/en';
import { AuthService } from 'app/core/authentication/services/authentication.service';
import { UnitInfoSidebarService } from 'app/main/home/maps/sidebar/sidebar.service';
import { navigation } from 'app/core/navigation/navigation';
import * as _ from 'lodash';
import { forkJoin, Observable, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { FilterPanelService, RoutesService, UnitInfoService, VehMarkersService, ZonesService } from '../services';
import { AgmDirectionGeneratorService } from 'app/sharedModules/services';
import { MatFabButtonComponent } from '../components/mat-fab-button/mat-fab-button.component';
import { LanguageModel, VehicleModel, POIModel, ZoneRouteModel, NewPOIModel } from '../models';
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
    currentUnit: VehicleModel;
    currentOperator: any;
    currentEvents: any;
    currentPOI: any;
    currentPOIEvents: any;
    lat: number = 25.7959;
    lng: number = -80.2871;
    vehmarkers: VehicleModel[] = [];
    userPOIs: POIModel[] = [];
    zones: Array<ZoneRouteModel[]>;
    routes: Array<ZoneRouteModel[]>;

    zoom: number = 12;
    bounds: any;
    minClusterSize = 2;
    isClickedEvent: boolean = false;
    isTrackUnitHistory: boolean = false;
    eventLocation: any = [];
    trackHistoryPolylines: any = [];

    showVehicles: boolean = true;
    showZones: boolean = true;
    showPOIs: boolean = true;
    showRoutes: boolean = true;
    showFilters: boolean = false;
    disabledOptionList: any = [];
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

    geoFencePointsList: any = [];

    pointList: { lat: number; lng: number }[] = [];
    isStartCreatePOI: boolean = false;
    drawingManager: any;
    selectedShape: any;
    selectedArea = 0;

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

    measure_point_icon = {
        url: 'assets/icons/googlemap/green-marker.png',
        scaledSize: { width: 10, height: 10 },
    };

    @ViewChild('AgmMap') agmMap: AgmMap;
    @ViewChild(MatFabButtonComponent, { static: true }) fabBtnComponent: MatFabButtonComponent;

    constructor(
        public vehMarkersService: VehMarkersService,
        public zonesService: ZonesService,
        public routesService: RoutesService,
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
        this._fuseTranslationLoaderService.loadTranslations(mapEnglish, mapSpanish, mapFrench, mapPortuguese);
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
        const zone = this.zonesService.getZones();
        const route = this.routesService.getRoutes();

        forkJoin([vehmarks, userpois, zone, route]).pipe(takeUntil(this._unsubscribeAll)).subscribe(([marker, poi, zone, route]) => {
            this.vehmarkers = marker.TrackingXLAPI.DATA.slice(0, 10);
            this.vehmarkers.map(marker => {
                marker.isSelected = true;
            });
            this.vehMarkersService.updateVehicleMarkers(this.vehmarkers.filter(marker => marker.isSelected));
            this.vehMarkersService.updateFilterMarkers(this.vehmarkers);

            this.userPOIs = poi.TrackingXLAPI.DATA.slice(0, 10);
            this.userPOIs.map(poi => {
                poi.isSelected = true;
            });
            this.vehMarkersService.updatePoiMarkers(this.userPOIs.filter(marker => marker.isSelected));
            this.vehMarkersService.updatePoiFilterMarkers(this.userPOIs);

            this.zones = JSON.parse("[" + zone.TrackingXLAPI.DATA[0].paths + "]");
            this.zones.map(zone => {
                zone.map(path => path.isSelected = true);
            });
            this.zonesService.updateZones(this.zones.filter(zone => zone[0].isSelected));
            this.zonesService.updateFilterZones(this.zones);

            this.routes = JSON.parse("[" + route.TrackingXLAPI.DATA[0].paths + "]");
            this.routes.map(route => {
                route.map(path => path.isSelected = true);
            });
            this.routesService.updateRoutes(this.routes.filter(route => route[0].isSelected));
            this.routesService.updateFilterRoutes(this.routes);

            setTimeout(() => {
                this.filterPanelService.loadingsubject.next(true);
            }, 500);
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
        if (key === 'unitInfoPanel') {
            this.unitInfoService.getUnitInfo(id)
                .pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {
                    this.currentUnit = JSON.parse(res.TrackingXLAPI.DATA[0].Column1).unit;
                    this.currentOperator = JSON.parse(res.TrackingXLAPI.DATA[0].Column1).operator;
                    this.currentEvents = JSON.parse(res.TrackingXLAPI.DATA[0].Column1).events;
                    this._unitInfoSidebarService.getSidebar(key).toggleOpen();
                });
        } else if (key === 'poiInfoPanel') {
            this.unitInfoService.getPOIInfo_v1(id)
                .pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {
                    this.currentPOI = JSON.parse(res.TrackingXLAPI.DATA[0].Column1).poi;
                    this.currentEvents = JSON.parse(res.TrackingXLAPI.DATA[0].Column1).events;
                    this._unitInfoSidebarService.getSidebar(key).toggleOpen();
                });

        } else if (key === 'filterPanel') {
            if (this.showFilters) {
                this._unitInfoSidebarService.getSidebar(key).toggleOpen();
            } else {
                this._unitInfoSidebarService.getSidebar(key).close();
                this.vehmarkers.map(marker => marker.isSelected = true);
                this.vehMarkersService.updateVehicleMarkers(this.showVehicles ? this.vehmarkers : []);

                this.userPOIs.map(poi => poi.isSelected = true);
                this.vehMarkersService.updatePoiMarkers(this.showPOIs ? this.userPOIs : []);

                this.zones.map(zone => zone.map(path => path.isSelected = true));
                this.zonesService.updateZones(this.showZones ? this.zones : []);

                this.routes.map(route => route.map(path => path.isSelected = true));
                this.routesService.updateRoutes(this.showRoutes ? this.routes : []);
            }
        } else if (key === 'trackPanel') {
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
        if (value === "showVehicles") {
            this.filterPanelService.loadingsubject.next(false);
            this.showVehicles = !this.showVehicles;
            if (this.showVehicles) {
                this.vehMarkersService.updateVehicleMarkers(this.vehmarkers.filter(marker => marker.isSelected));
            }
            else {
                this.vehMarkersService.updateVehicleMarkers([]);
            }

            this.filterPanelService.loadingsubject.next(true);
        }
        else if (value === "showPOIs") {
            this.filterPanelService.loadingsubject.next(false);
            this.showPOIs = !this.showPOIs;
            if (this.showPOIs) {
                this.vehMarkersService.updatePoiMarkers(this.userPOIs.filter(poi => poi.isSelected));
            }
            else {
                this.vehMarkersService.updatePoiMarkers([]);
            }

            this.filterPanelService.loadingsubject.next(true);
        }
        else if (value === "showZones") {
            this.showZones = !this.showZones;
            if (this.showZones) {
                this.zonesService.updateZones(this.zones.filter(zone => zone[0].isSelected));
            } else {
                this.zonesService.updateZones([]);
            }
        }
        else if (value === "showRoutes") {
            this.showRoutes = !this.showRoutes;
            if (this.showRoutes) {
                this.routesService.updateRoutes(this.routes.filter(route => route[0].isSelected));
            } else {
                this.routesService.updateRoutes([]);
            }
        }
        else if (value === "showFilters") {
            this.showFilters = !this.showFilters;
            this.toggleSidebarOpen('filterPanel');
        }
    }

    filterToggleOff(event) {
        this.showFilters = false;
        this.vehmarkers.map(marker => marker.isSelected = true);
        if (!this.showVehicles) {
            this.vehMarkersService.updateVehicleMarkers([]);
        }
        this.userPOIs.map(poi => poi.isSelected = true);
        if (!this.showPOIs) {
            this.vehMarkersService.updatePoiMarkers([]);
        }
        this.zones.map(zone => zone.map(path => path.isSelected = true));
        if (!this.showZones) {
            this.zonesService.updateZones([]);
        }
        this.routes.map(route => route.map(path => path.isSelected = true));
        if (!this.showRoutes) {
            this.routesService.updateRoutes([]);
        }

        this.lat = 25.7959;
        this.lng = -80.2871;
        this.zoom = 12;
    }

    filterUnits(event: any) {
        this.lat = 25.7959;
        this.lng = -80.2871;
        this.zoom = 12;
        if (Object.keys(event)[0] === 'vehicles') {
            event.vehicles.pipe(takeUntil(this._unsubscribeAll)).subscribe(markers => {
                this.vehmarkers = [...markers];
                if (this.showVehicles) {
                    this.vehMarkersService.updateVehicleMarkers(this.vehmarkers.filter(marker => marker.isSelected));
                }
                else {
                    this.vehMarkersService.updateVehicleMarkers([]);
                }
            })
        } else if (Object.keys(event)[0] === 'pois') {
            event.pois.pipe(takeUntil(this._unsubscribeAll)).subscribe(pois => {
                this.userPOIs = [...pois];
                if (this.showPOIs) {
                    this.vehMarkersService.updatePoiMarkers(this.userPOIs.filter(poi => poi.isSelected));
                }
                else {
                    this.vehMarkersService.updatePoiMarkers([]);
                }
            })
        } else if (Object.keys(event)[0] === 'zones') {
            event.zones.pipe(takeUntil(this._unsubscribeAll)).subscribe(zones => {
                this.zones = [...zones];
                if (this.showZones) {
                    this.zonesService.updateZones(this.zones.filter(zone => zone[0].isSelected));
                } else {
                    this.zonesService.updateZones([]);
                }
            })
        } else if (Object.keys(event)[0] === 'routes') {
            event.routes.pipe(takeUntil(this._unsubscribeAll)).subscribe(routes => {
                this.routes = [...routes];
                if (this.showRoutes) {
                    this.routesService.updateRoutes(this.routes.filter(route => route[0].isSelected));
                } else {
                    this.routesService.updateRoutes([]);
                }
            })
        }
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

    showInfoUnit(infoWindow: any, gm: any) {
        if (gm.lastOpen != null) {
            gm.lastOpen.close();
        }
        gm.lastOpen = infoWindow;
        infoWindow.open();
    }

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
        if (this.createOptionType === 'Create Route') {
            this.agmDirectionGeneratorService.addRouteLocations(event, this.map);
        } else if (this.createOptionType === 'Measure Distance') {
            this.routesService.updateMeasureDistancePointsList(event.coords, this.map);
        } else if (this.createOptionType === 'Create Geofence') {
            console.log(this.zonesService.isStartDrawZone);
            this.zonesService.isStartDrawZone = true;
        } else if (this.createOptionType === 'Create POI') {
            this.vehMarkersService.updateNewPOILocation(event.coords);
        } else {
            return false;
        }
    }

    newOptionEmitter(event: string): void {
        this.resetMapOptions();
        this.createOptionType = event;

        if (event !== 'Anyone') {
            if (event === 'Create Route') {
                this.agmDirectionGeneratorService.directionsService = new google.maps.DirectionsService();
                this.agmDirectionGeneratorService.directionDisplayer = new google.maps.DirectionsRenderer({
                    draggable: true,
                    map: this.map
                });

                google.maps.event.addListener(this.agmDirectionGeneratorService.directionDisplayer, 'directions_changed', () => {
                    this.agmDirectionGeneratorService.onChangeRouteByDragging(this.agmDirectionGeneratorService.directionDisplayer.directions);
                });
                this.agmDirectionGeneratorService.isAddStopsOnMap = true;
            } else if (event === 'Measure Distance') {
                this.routesService.showDialog = true;
            } else if (event === 'Create Geofence') {
                this.initDrawingManager(this.map);
            } else if (event === 'Create POI') {
                this.isStartCreatePOI = true;
            }

            const optionList = {
                "showVehicles": this.showVehicles,
                "showPOIs": this.showPOIs,
                "showZones": this.showZones,
                "showRoutes": this.showRoutes,
            }

            for (let option in optionList) {
                if (optionList[option]) {
                    this.onShowValChange(option);
                } else {
                    this.disabledOptionList.push(option);
                }
            }
        } else {
            this.returnMapState();
        }
    }

    resetMapOptions(): void {
        //Route Option
        this.removeRouteEmitter();
        this.agmDirectionGeneratorService.resetRoutes();
        //Zone Option
        this.selectedShape?.setMap(null);
        this.drawingManager?.setMap(null);
        this.selectedArea = 0;
        this.pointList = [];
        this.zonesService.zonePointsList = [];
        //Measurement Option
        this.routesService.resetMeasurement();
        this.routesService.showDialog = false;
        //POI Option
        this.vehMarkersService.newPOILocation.next(undefined);
        this.vehMarkersService.hasLocation = false;
        this.isStartCreatePOI = false;
    }

    returnMapState(): void {
        this.createOptionType = 'Anyone';
        this.disabledOptionList = [...[]];
        const optionList = {
            "showVehicles": this.showVehicles,
            "showPOIs": this.showPOIs,
            "showZones": this.showZones,
            "showRoutes": this.showRoutes,
        }

        for (let option in optionList) {
            if (!this.disabledOptionList.includes(option)) {
                this.onShowValChange(option);
            }
        }

        this.fabBtnComponent.fabButtons.map(button => {
            if (button.isActive) {
                button.isActive = false;
                return button;
            }
        });
    }

    //Creating Route Section
    markerDragEnd(event: any, index: number): void {
        this.agmDirectionGeneratorService.newRouteLocations[index] = { ...event.coords };
    }

    removeRouteEmitter(): void {
        this.resetFitBound();
        // this.resetMapOptions();
    }

    cancelRouteEmitter(): void {
        this.resetMapOptions();
        this.returnMapState();
    }

    saveRouteEmitter(event: number): void {
        if (event > 0) {
            this.agmDirectionGeneratorService.newRoutePath.map(path => {
                path.routeid = event;
                return path;
            });
            setTimeout(() => {
                this.routesService.setRoutePath(this.agmDirectionGeneratorService.newRoutePath).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                    if (res.responseCode === 100) {
                        alert("Success!");
                        this.agmDirectionGeneratorService.resetRoutes();
                        this.resetMapOptions();
                        this.returnMapState();
                    } else {
                        alert("Failed to save path");
                    }
                })
            }, 500)
        }
    }
    //Measurement Distance, Area Section
    finishMeasurement(event): void {
        this.resetMapOptions();
        this.returnMapState();
    }
    //Creating Zone Section
    cancelZoneEmitter(): void {
        this.selectedShape?.setMap(null);
        this.selectedArea = 0;
        this.pointList = [];
        this.zonesService.zonePointsList = [];
        this.zonesService.isStartDrawZone = false;

        this.resetMapOptions();
        this.returnMapState();
    }

    removeZoneEmitter(): void {
        this.deleteSelectedShape();
    }

    saveZoneEmitter(event: number): void {
        if (event > 0) {
            this.zonesService.zonePointsList.map(path => {
                path.zoneid = event;
                return path;
            });
            setTimeout(() => {
                this.zonesService.setZonePath(this.zonesService.zonePointsList).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                    if (res.responseCode === 100) {
                        alert("Success!");
                        this.selectedShape.setMap(null);
                        this.selectedArea = 0;
                        this.pointList = [];
                        this.zonesService.zonePointsList = [];
                        this.zonesService.isStartDrawZone = false;
                        this.resetMapOptions();
                        this.returnMapState();
                    } else {
                        alert("Failed to save path");
                    }
                })
            }, 500)
        }
    }

    initDrawingManager = (map: any) => {
        const self = this;
        const options = {
            drawingControl: false,
            drawingControlOptions: {
                drawingModes: ['polygon'],
            },
            polygonOptions: {
                draggable: false,
                editable: true,
                fillColor: 'red',
                fillOpacity: '0.2',
                strokeColor: 'red',
                strokeOpacity: '0.9'
            },
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
        };
        this.drawingManager = new google.maps.drawing.DrawingManager(options);
        this.drawingManager.setMap(map);
        google.maps.event.addListener(
            this.drawingManager,
            'overlaycomplete',
            (event) => {
                if (event.type === google.maps.drawing.OverlayType.POLYGON) {
                    console.log('draw-zone');
                    const paths = event.overlay.getPaths();
                    for (let p = 0; p < paths.getLength(); p++) {
                        google.maps.event.addListener(
                            paths.getAt(p),
                            'set_at',
                            () => {
                                if (!event.overlay.drag) {
                                    self.updatePointList(event.overlay.getPath());
                                }
                            }
                        );
                        google.maps.event.addListener(
                            paths.getAt(p),
                            'insert_at',
                            () => {
                                self.updatePointList(event.overlay.getPath());
                            }
                        );
                        google.maps.event.addListener(
                            paths.getAt(p),
                            'remove_at',
                            () => {
                                self.updatePointList(event.overlay.getPath());
                            }
                        );
                    }
                    self.updatePointList(event.overlay.getPath());
                    this.selectedShape = event.overlay;
                    this.selectedShape.type = event.type;
                }
                if (event.type !== google.maps.drawing.OverlayType.MARKER) {
                    // Switch back to non-drawing mode after drawing a shape.
                    self.drawingManager.setDrawingMode(null);
                    // To hide:
                    self.drawingManager.setOptions({
                        drawingControl: false,
                    });
                }
            }
        );
    }

    updatePointList(path) {
        this.pointList = [];
        const len = path.getLength();
        for (let i = 0; i < len; i++) {
            this.pointList.push(
                path.getAt(i).toJSON()
            );
        }
        this.selectedArea = google.maps.geometry.spherical.computeArea(
            path
        );

        this.zonesService.zonePointsList = [...this.pointList];
    }

    deleteSelectedShape() {
        if (this.selectedShape) {
            this.selectedShape.setMap(null);
            this.selectedArea = 0;
            this.pointList = [];
            this.zonesService.isStartDrawZone = false;
            this.zonesService.zonePointsList = [];
            // To show:
            this.initDrawingManager(this.map);
        }
    }

    //Create New POI
    createNewPOIEmitter(event: boolean): void {
        this.isStartCreatePOI = false;

        this.resetMapOptions();
        this.returnMapState();
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