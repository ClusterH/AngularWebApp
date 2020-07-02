import { Component } from '@angular/core';
import { merge } from 'rxjs';
import { Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { MouseEvent } from '@agm/core';
import {FormControl} from '@angular/forms';
declare const google: any;

import { VehMarkersService } from 'app/main/home/maps/services/vehmarkers.service';
import { ZonesService } from 'app/main/home/maps/services/zones.service';
import { RoutesService } from 'app/main/home/maps/services/routes.service';

import { VehMarkersDataSource } from "app/main/home/maps/services/vehmarkers.datasource";
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { navigation } from 'app/navigation/navigation';

import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AuthService } from 'app/authentication/services/authentication.service';

import { locale as vehiclesEnglish } from 'app/authentication/i18n/en';
import { locale as vehiclesSpanish } from 'app/authentication/i18n/sp';
import { locale as vehiclesFrench } from 'app/authentication/i18n/fr';
import { locale as vehiclesPortuguese } from 'app/authentication/i18n/pt';
import * as _ from 'lodash';

@Component({
    selector: 'docs-components-third-party-google-maps',
    templateUrl: './google-maps.component.html',
    styleUrls: ['./google-maps.component.scss']
})
export class DocsComponentsThirdPartyGoogleMapsComponent {
   selectedLanguage: any;
    languages: any;
    userObject: any;
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    navigation: any

    private _unsubscribeAll: Subject<any>;

    lat: number;
    lng: number;
    dataSource: VehMarkersDataSource;
    vehmarkers: marker[];
    tmpVehmarkers: marker[];
    zones: marker[];
    routes: marker[];
    tmpZones: marker[];
    tmpRoutes: marker[];
    zoom: number = 8;
    minClusterSize = 2;
    polygon: any; 
    showVehicles: boolean = true;
    showZones: boolean = true;
    showPOIs: boolean = true;
    showRoutes: boolean = true;
    selectedCountry: string;
    user: any;

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
                ,private _adminZonesService: ZonesService
                ,private _adminRoutesService: RoutesService
                ,private _fuseConfigService: FuseConfigService
                ,private _fuseSidebarService: FuseSidebarService
                ,private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private _translateService: TranslateService,
                private _authService: AuthService

                ) {

                    
        this.user = JSON.parse(localStorage.getItem('user_info'));
        this.userObject = JSON.parse(localStorage.getItem('userObjectList'))[0];

        this._fuseTranslationLoaderService.loadTranslations(vehiclesEnglish, vehiclesSpanish, vehiclesFrench, vehiclesPortuguese);

        
        this._fuseConfigService.config = {
          layout: {
              
              toolbar  : {
                  hidden: true
              }
          }
        };

        this.languages = [
          {
              id   : 'en',
              title: 'English',
              flag : 'us'
          },
          {
              id   : 'sp',
              title: 'Spanish',
              flag : 'sp'
          },
          {
              id   : 'fr',
              title: 'French',
              flag : 'fr'
          },
          {
              id   : 'pt',
              title: 'Portuguese',
              flag : 'pt'
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

    ngOnInit(): void {

      // this._fuseConfigService.config
      // .pipe(takeUntil(this._unsubscribeAll))
      // .subscribe((settings) => {
      //     this.horizontalNavbar = settings.layout.navbar.position === 'top';
      //     this.rightNavbar = settings.layout.navbar.position === 'right';
      //     this.hiddenNavbar = settings.layout.navbar.hidden === true;
      // });
        
        // this.dataSource = new VehMarkersDataSource(this._adminVehMarkersService);
        // this.dataSource.loadVehicles("PolarixUSA", 2);

      this.selectedLanguage = _.find(this.languages, {id: this._translateService.currentLang});

      this._adminVehMarkersService.getVehMarkers("PolarixUSA",2).subscribe(
        (data)=>{
            this.vehmarkers = data.TrackingXLAPI.DATA;
        }
    );

    this._adminZonesService.getZones("PolarixUSA",2).subscribe(
        (data)=>{
            // 
            // 
            this.zones = JSON.parse("[" + data.TrackingXLAPI.DATA[0].paths + "]");
        }
    );
    
    this._adminRoutesService.getRoutes("PolarixUSA",2).subscribe(
        (data)=>{
            // 
            // 
            this.routes = JSON.parse("[" + data.TrackingXLAPI.DATA[0].paths + "]");
        }
    );

    }

    ngAfterViewInit() {
        
        
        // merge(this.vehmarkers)
        //     .pipe(
        //         tap(() => this.dataSource.loadVehicles("PolarixUSA", 2))
        //     )
        //     .subscribe((res: any) => {
        //         
        //         
        //     });

    }

    setLanguage(lang): void
    {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }

    logOut() {
      this._authService.logOut();
    }

    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    clickedMarker(label: string, index: number) {
        
    }

    mapClicked($event: MouseEvent) {
      
    }

    markerDragEnd(m: marker, $event: MouseEvent) {
        
    }

    onShowValChange(value){
        
        if (value == "showVehicles"){
            this.showVehicles =!this.showVehicles;
            
            if (this.showVehicles){
                this.vehmarkers = Object.assign([], this.tmpVehmarkers);
                //this.tmpVehmarkers.forEach(val => this.vehmarkers.push(Object.assign({}, val)));
                this.tmpVehmarkers.length = 0;
            }
            else{  
                this.tmpVehmarkers = Object.assign([], this.vehmarkers);              
                //this.vehmarkers.forEach(val => this.tmpVehmarkers.push(Object.assign({}, val)));
                this.vehmarkers.length = 0;
            }
        }
        else if (value == "showZones"){
            this.showZones =!this.showZones;
            
            if (this.showZones){
                this.zones = Object.assign([], this.tmpZones);
                this.tmpZones.length = 0;
            }
            else{                
                this.tmpZones = Object.assign([], this.zones);
                this.zones.length = 0;
            }
        }
        else if (value == "showRoutes"){
            this.showRoutes =!this.showRoutes;
            
            if (this.showRoutes){
                this.routes = Object.assign([], this.tmpRoutes);
                this.tmpRoutes.length = 0;
            }
            else{                
                this.tmpRoutes = Object.assign([], this.routes);
                this.routes.length = 0;
            }
        }

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

}

interface marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
    visible: boolean;
}