import { Component, Inject, OnInit, OnDestroy, ViewChild, ElementRef, NgZone, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MapsAPILoader, AgmMap, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmDirection } from 'agm-direction';
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as vehiclesEnglish } from 'app/main/admin/vehicles/i18n/en';
import { locale as vehiclesFrench } from 'app/main/admin/vehicles/i18n/fr';
import { locale as vehiclesPortuguese } from 'app/main/admin/vehicles/i18n/pt';
import { locale as vehiclesSpanish } from 'app/main/admin/vehicles/i18n/sp';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { UnitInfoService } from 'app/main/home/maps/services/unitInfo.service';

@Component({
    selector: 'autocomplete-dialog',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteDialogComponent implements OnInit, OnDestroy {
    unit: any;
    flag: any;
    userConncode: string;
    userID: number;
    private _unsubscribeAll: Subject<any>;

    @ViewChild('unitMap') unitMap: AgmMap;
    @ViewChild('search') search: any;
    @ViewChild('currentpanel') currentpanel: any;

    zoom: number = 12;
    latitude: number;
    longitude: number;
    isDirection: boolean = false;
    isChange: boolean = false;
    filter_string: string = '';
    origin: any = [];
    destination: any = [];
    destPlace: any;

    dir: any = [];
    waypointsList: Array<any> = [];
    selectedPOIList: Array<any> = [];
    poiDataList: Array<any> = [];
    poiDataListPage: number;
    poiSelection = new SelectionModel<Element>(true, []);

    constructor(
        private router: Router,
        private mapsAPILoader: MapsAPILoader,
        private mapsAPIWrapper: GoogleMapsAPIWrapper,
        private agmDirection: AgmDirection,
        private ngZone: NgZone,
        public unitInfoService: UnitInfoService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dialogRef: MatDialogRef<AutocompleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { unit, flag }
    ) {
        this._unsubscribeAll = new Subject();
        this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;
        this._fuseTranslationLoaderService.loadTranslations(vehiclesEnglish, vehiclesSpanish, vehiclesFrench, vehiclesPortuguese);
        this.unit = unit;
        this.flag = flag;
        console.log(this.unit, this.flag);
        this.getPOIList(this.userConncode, this.userID, 1, 1000, this.filter_string);
    }

    ngOnInit() {
        this.poiSelection.isSelected = this.isCheckedRow.bind(this);
        this.mapsAPILoader.load().then(() => {
            // let input = document.getElementById('testtttt');
            this.agmDirection = new AgmDirection(this.mapsAPIWrapper);
            console.log('agmDirection==========>>>>>', this.agmDirection);

            console.log('search==>', this.search);
            // console.log('search==>', input);
            let autocomplete = new google.maps.places.Autocomplete(this.search.nativeElement);
            console.log("autocomplete=>>>>", autocomplete);
            console.log("searchElementRef=>>>>", this.search.nativeElement);
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    //get the place result
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                    console.log(place);
                    //verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    //set latitude, longitude and zoom
                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.destPlace = place.name;
                    this.waypointsList = [];
                    this.waypointsList.push({ lat: this.latitude, lng: this.longitude });
                    // this.dir = [];
                    // this.zoom = 12;
                    console.log(this.latitude, this.longitude);
                });
            });
        });
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getDirection() {
        this.isDirection = false;
        this.dir = [];
        console.log(this.poiSelection.selected[0], "selected===>>>", this.poiSelection);

        if (!this.latitude && !this.poiSelection.selected) {
            alert('Please choose poi at least one');
            return
        }

        if (!this.isChange) {
            if (this.poiSelection.selected) {
                let selectedPOIs = JSON.parse(JSON.stringify(this.poiSelection.selected));
                for (let poiID of selectedPOIs) {
                    let address = this.poiDataList.find(poi => poi.id == poiID);
                    this.selectedPOIList.push(address);
                };

                let tempArray = this.generateWayPointList({ lat: this.unit.latitude, lng: this.unit.longitude }, this.selectedPOIList);
                console.log(tempArray);
                //     let distance = this.getDistance({ lat: this.unit.latitude, lng: this.unit.longitude }, { lat: Number(address.Latitude), lng: Number(address.Longitude) });
                //     this.waypointsList.push({lat: Number(address.Latitude), lng: Number(address.Longitude), distance: distance})

                // this.waypointsList.sort((a, b) => this.sortByDistance(a, b))
            }
        }

        // if (this.latitude) {
        //     console.log('change========>>>>', this.isChange);
        //     if (!this.isChange) {
        //         console.log('change========>>>>', this.isChange);
        //         this.dir.push({
        //             origin: { lat: this.unit.latitude, lng: this.unit.longitude },
        //             destination: { lat: this.latitude, lng: this.longitude },
        //             renderOptions: { suppressMarkers: true },
        //             markerOptions: {
        //                 origin: {
        //                     draggable: true,
        //                     infoWindow: this.unit.name,
        //                 },
        //                 destination: {
        //                     infoWindow: this.destPlace,
        //                     draggable: true
        //                 }
        //             }
        //         });
        //         console.log('DIR========>>>>', this.dir);
        //     } else {
        //         this.dir.push({
        //             origin: { lat: this.latitude, lng: this.longitude },
        //             destination: { lat: this.unit.latitude, lng: this.unit.longitude },
        //             renderOptions: { suppressMarkers: true },
        //             markerOptions: {
        //                 origin: {
        //                     draggable: true,
        //                     infoWindow: this.destPlace,
        //                 },
        //                 destination: {
        //                     infoWindow: this.unit.name,
        //                     draggable: true
        //                 }
        //             }
        //         });
        //     }
        //     this.isDirection = true;
        // }
        // if (this.poiSelection.selected) {
        //     let selectedPOIs = JSON.parse(JSON.stringify(this.poiSelection.selected));
        //     console.log(selectedPOIs);
        //     if (!this.isChange) {
        //         for (let poiID of selectedPOIs) {
        //             let address = this.poiDataList.find(el => el.id == poiID);
        //             console.log(address);
        //             this.dir.push({
        //                 origin: { lat: this.unit.latitude, lng: this.unit.longitude },
        //                 destination: { lat: Number(address.Latitude), lng: Number(address.Longitude) },
        //                 renderOptions: { suppressMarkers: true },
        //                 markerOptions: {
        //                     origin: {
        //                         draggable: true,
        //                         infoWindow: this.unit.name,
        //                     },
        //                     destination: {
        //                         infoWindow: 'destinationHHH',
        //                         draggable: true
        //                     }
        //                 }
        //             });
        //         }
        //     } else {
        //         for (let poiID of selectedPOIs) {
        //             let address = this.poiDataList.find(el => el.id == poiID);

        //             this.dir.push({
        //                 origin: { lat: Number(address.Latitude), lng: Number(address.Longitude) },
        //                 destination: { lat: this.unit.latitude, lng: this.unit.longitude },
        //                 renderOptions: { suppressMarkers: true },
        //                 markerOptions: {
        //                     origin: {
        //                         draggable: true,
        //                         infoWindow: 'OriginHHH',
        //                     },
        //                     destination: {
        //                         infoWindow: this.unit.name,
        //                         draggable: true
        //                     }
        //                 }
        //             });
        //         }
        //     }

        //     this.isDirection = true;
        // } else {
        //     alert('please select POIs at least one');
        //     return;
        // }
    }

    async generateWayPointList(origin: {}, dest: any[]) {
        let waypointList = [];
        for (let address of dest) {
            let distance = await this.getDistance(origin, { lat: Number(address.Latitude), lng: Number(address.Longitude) });
            waypointList.push({ lat: Number(address.Latitude), lng: Number(address.Longitude), distance: distance });
            console.log(waypointList);
        }
        waypointList.sort((a, b) => this.sortByDistance(a, b));
        console.log(waypointList);
        return waypointList;
    }

    getDistance(origin: any, destination: any): number {
        const directionsService = new google.maps.DirectionsService;
        console.log(origin);
        console.log(destination);
        if (!(origin && destination && origin.lat && destination.lat))
            return -1;

        directionsService.route({
            origin,
            destination,
            waypoints: [],
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING
        }, (response, status) => {
            console.log(response, status);
            if (status == 'OK') {
                let distance = response.routes[0].legs[0].distance.value;
                console.log('distance========>>>', distance);
                return distance;
            } else {
                alert('Distance request failed due to ' + status);
                return -1;
            }
        })
    }

    sortByDistance(a, b) {
        if (a.distance > b.distance) return 1;
        else if (a.distance < b.distance) return -1;
        else return 0;
    }

    getPOIList(conncode: string, userid: number, pageindex: number, pagesize: number, filter_string: string) {
        this.unitInfoService.getPOIList(conncode, userid, this.unit.id, pageindex, pagesize, filter_string).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            console.log(res);
            this.poiDataList = res.TrackingXLAPI.DATA;
            this.poiDataListPage = 1;
        });
    }

    onChange(event: any) {
        console.log(event);
    }

    clearFilter() {
        this.filter_string = '';
    }

    onKey(event: any) {
        this.filter_string = event.target.value;
        if (this.filter_string.length >= 3 || this.filter_string == '') {
            this.getPOIList(this.userConncode, this.userID, 1, 1000000, this.filter_string);
        }
        // this.managePageIndex(this.method_string);
        // this.loadVehicleDetail(this.method_string);
    }

    // onCheckboxChangeUnit(e, type) {
    //     console.log(e, type);
    //     const checkArray: FormArray = this.unitForm.get(type) as FormArray;
    //     if (e.target.checked) {
    //         checkArray.push(new FormControl(e.target.value));
    //     } else {
    //         let i: number = 0;
    //         checkArray.controls.forEach((item: FormControl) => {
    //             if (item.value == e.target.value) {
    //                 checkArray.removeAt(i);
    //                 return;
    //             }
    //             i++;
    //         });
    //     }
    // }

    isCheckedRow(row: any): boolean {
        const foundunittype = this.poiSelection.selected.find(el => el === row);
        if (foundunittype) { return true; }
        return false;
    }

    onChangeDirection() {
        this.isChange = !this.isChange;
        // if (this.isChange) {
        //     console.log(this.poiSelection);
        //     this.poiSelection.clear();
        //     this.poiSelection.
        // }
        // this.dir = [];
        // this.getDirection();
    }

    close() { this.dialogRef.close(); }
    goback() { this.dialogRef.close('goback'); }
}