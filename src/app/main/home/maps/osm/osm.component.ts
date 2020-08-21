import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { UnitInfoSidebarService } from 'app/main/home/maps/sidebar/sidebar.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as vehiclesEnglish } from 'app/authentication/i18n/en';
import { locale as vehiclesFrench } from 'app/authentication/i18n/fr';
import { locale as vehiclesPortuguese } from 'app/authentication/i18n/pt';
import { locale as vehiclesSpanish } from 'app/authentication/i18n/sp';
import { AuthService } from 'app/authentication/services/authentication.service';
import { RoutesService } from 'app/main/home/maps/services/routes.service';
import { VehMarkersService } from 'app/main/home/maps/services/vehmarkers.service';
import { UnitInfoService } from 'app/main/home/maps/services/unitInfo.service';
import { ZonesService } from 'app/main/home/maps/services/zones.service';
import { navigation } from 'app/navigation/navigation';
import * as _ from 'lodash';

// import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Map, Control, DomUtil, ZoomAnimEvent, Layer, MapOptions, tileLayer, latLng, Marker, icon, Polygon, Polyline } from 'leaflet';
import { MarkerClusterGroup } from 'leaflet.markercluster'

// import { Subject, BehaviorSubject } from 'rxjs';

// import Map from 'ol/Map';
// import View from 'ol/View';
// import VectorLayer from 'ol/layer/Vector';
// import Style from 'ol/style/Style';
// import Icon from 'ol/style/Icon';
// import OSM from 'ol/source/OSM';
// import * as olProj from 'ol/proj';
// import TileLayer from 'ol/layer/Tile';

@Component({
    selector: 'docs-components-third-party-google-maps',
    templateUrl: './osm.component.html',
    styleUrls: ['./osm.component.scss']
})

export class OpenStreetMapComponent implements OnInit, OnDestroy {
    selectedLanguage: any;
    languages: any;
    userObject: any;
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    navigation: any

    lat: number;
    lng: number;

    map: Map;

    options: MapOptions;

    vehmarkers: marker[];
    tmpVehmarkers: marker[];
    zones: marker[];
    routes: marker[];
    tmpZones: marker[];
    tmpRoutes: marker[];
    polygon: any;
    polyline: any;
    markers: any;
    showVehicles: boolean = true;
    showZones: boolean = true;
    showPOIs: boolean = true;
    showRoutes: boolean = true;
    selectedCountry: string;
    user: any;

    /**
     * Constructor
     */
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
        private _authService: AuthService
    ) {
        this.user = JSON.parse(localStorage.getItem('user_info'));
        this.userObject = JSON.parse(localStorage.getItem('userObjectList'))[0];

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
            {
                id: 'en',
                title: 'English',
                flag: 'us'
            },
            {
                id: 'sp',
                title: 'Spanish',
                flag: 'sp'
            },
            {
                id: 'fr',
                title: 'French',
                flag: 'fr'
            },
            {
                id: 'pt',
                title: 'Portuguese',
                flag: 'pt'
            },
        ];

        this.navigation = navigation;

        // Set the defaults
        this.lat = 25.7959;
        this.lng = -80.2871;
        this.tmpVehmarkers = [];
        this.tmpZones = [];
        this.tmpRoutes = [];
    }

    ngOnInit() {

        this.selectedLanguage = _.find(this.languages, { id: this._translateService.currentLang });

        this.intializeMapOptions();

        this._adminVehMarkersService.getVehMarkers(this.user.conncode, this.user.id).subscribe(
            (data) => {
                this.vehmarkers = data.TrackingXLAPI.DATA;
                this.getMarkerCluster(this.vehmarkers);
            }
        );

        this._adminZonesService.getZones(this.user.conncode, this.user.id).subscribe(
            (data) => {
                this.zones = JSON.parse("[" + data.TrackingXLAPI.DATA[0].paths + "]");
                this.getPolygon(this.zones);
            }
        );

        this._adminRoutesService.getRoutes(this.user.conncode, this.user.id).subscribe(
            (data) => {
                this.routes = JSON.parse("[" + data.TrackingXLAPI.DATA[0].paths + "]");
                this.getPolyline(this.routes);
            }
        );
    }

    onMapReady(map: Map) {
        this.map = map;
    }

    private intializeMapOptions() {
        this.options = {
            layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                opacity: 1,
                maxZoom: 19,
                tileSize: 512,
                zoomOffset: -1,
                detectRetina: true,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            })],
            zoom: 12,
            center: latLng(25.7959, -80.2871)
        };
    }

    setLanguage(lang): void {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }

    getMarkerCluster(vehmarkers) {
        if (vehmarkers.length == 0) {
            this.map.removeLayer(this.markers);
        } else {

            this.markers = new MarkerClusterGroup();

            for (let i = 0; i < vehmarkers.length; i++) {
                let m = new Marker(latLng(vehmarkers[i].lat, vehmarkers[i].lng), {
                    draggable: vehmarkers[i].draggable,
                    icon: icon({
                        iconSize: [25, 41],
                        iconAnchor: [13, 41],
                        iconUrl: 'leaflet/marker-icon.png',
                        shadowUrl: 'leaflet/marker-shadow.png'
                    }),
                    title: vehmarkers[i].label
                });
                // m.bindTooltip(vehmarkers[i].label).openTooltip();
                // m.bindPopup(vehmarkers[i].label).openPopup();
                this.markers.addLayer(m)
            }

            this.markers.on('click', (a: any) => {
                this.toggleSidebarOpen('unitInfoPanel', a.layer.options.title);
            });

            this.map.addLayer(this.markers);
        }
    }

    getPolygon(zones: any) {
        if (zones.length == 0) {
            this.polygon.remove();
        } else {
            this.polygon = new Polygon(zones, { color: 'red', opacity: 0.3, fillColor: 'red', fillOpacity: 0.1 }).addTo(this.map);
        }
    }

    getPolyline(routes: any) {
        if (routes.length == 0) {
            this.polyline.remove();
        } else {
            this.polyline = new Polyline(routes, { color: 'blue', opacity: 1 }).addTo(this.map);
        }
    }

    toggleSidebarOpen(key, label): void {
        this._unitInfoSidebarService.getSidebar(key).toggleOpen();
        // this.unitInfoService.onVehMarkerClickChanged = label;
    }

    toggleFuseSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    // mapClicked($event: MouseEvent) {

    // }

    // markerDragEnd(m: marker, $event: MouseEvent) {

    // }

    onShowValChange(value) {

        if (value == "showVehicles") {
            this.showVehicles = !this.showVehicles;

            if (this.showVehicles) {
                this.vehmarkers = Object.assign([], this.tmpVehmarkers);
                this.tmpVehmarkers.length = 0;
            }
            else {
                this.tmpVehmarkers = Object.assign([], this.vehmarkers);
                this.vehmarkers.length = 0;
            }
            this.getMarkerCluster(this.vehmarkers);
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
            this.map.removeLayer;

            this.getPolygon(this.zones);
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
            this.getPolyline(this.routes);
        }
    }

    // setVisible(value) {
    // 	for (var i = 0; i < this.vehmarkers.length; i++) {
    // 		this.vehmarkers[i].visible = value;
    // 	}
    // }

    // getPaths() {

    // 	if (this.polygon) {
    // 		const vertices = this.polygon.getPaths().getArray()[0];
    // 		let paths = [];
    // 		vertices.getArray().forEach(function (xy, i) {
    // 			//
    // 			let latLng = {
    // 				lat: xy.lat(),
    // 				lng: xy.lng()
    // 			};
    // 			paths.push(JSON.stringify(latLng));
    // 		});
    // 		return paths;
    // 	}
    // 	return [];
    // }

    logOut() {
        this._authService.logOut();
    }

    ngOnDestroy() {
        this.map.clearAllEventListeners;
        this.map.remove();
    };
}

interface marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: string;
    visible: boolean;
}
