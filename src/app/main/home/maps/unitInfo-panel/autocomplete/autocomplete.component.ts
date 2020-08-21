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
    origin: any;
    destination: any;
    waypoints: any = [];

    public renderOptions = {
        suppressMarkers: true,
        polylineOptions: {
            strokeColor: '#1A73E8',
            strokeWeight: 7,
            strokeOpacity: 0.7
        }
    };

    public markerOptions = {
        origin: {
            icon: 'assets/icons/map_unitInfo/residential-places.png',
            infoWindow: ''
        },

        waypoints: [],

        // waypoints: {
        //     icon: 'assets/icons/map_unitInfo/waypoint2.png',
        //     infoWindow: ''
        // },

        destination: {
            icon: 'assets/icons/map_unitInfo/default.png',
            infoWindow: ''
        },
    };

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

                    if (this.isChange) {
                        console.log('deselect======>>');
                        this.poiSelection.clear();
                        this.poiSelection = new SelectionModel<Element>(false, []);

                    }
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
        this.selectedPOIList = [];
        this.waypoints = [];
        this.waypointsList = [];
        this.markerOptions.waypoints = [];

        if (!this.latitude && !this.poiSelection.selected) {
            alert('Please choose poi at least one');
            return
        }

        if (!this.isChange) {
            this.waypointsList.unshift({ lat: this.unit.latitude, lng: this.unit.longitude, name: this.unit.name });
            if (this.latitude) {
                this.waypointsList.push({ lat: this.latitude, lng: this.longitude, name: this.destPlace });
            }

            console.log(this.waypointsList, this.unit.latitude);

            if (this.poiSelection.selected) {
                console.log(this.waypointsList);
                let selectedPOIs = JSON.parse(JSON.stringify(this.poiSelection.selected));
                for (let poiID of selectedPOIs) {
                    let address = this.poiDataList.find(poi => poi.id == poiID);
                    this.selectedPOIList.push({ lat: Number(address.Latitude), lng: Number(address.Longitude), name: address.name });
                };
            } else if (!this.poiSelection.selected) {
                this.selectedPOIList.push({ lat: this.latitude, lng: this.longitude, name: this.destPlace });
            }
        } else {
            if (this.latitude) {
                console.log(this.latitude);
                this.waypointsList.unshift({ lat: this.latitude, lng: this.longitude, name: this.destPlace });
                this.selectedPOIList.push({ lat: this.unit.latitude, lng: this.unit.longitude, name: this.unit.name });
            } else {
                let selectedPOI = JSON.parse(JSON.stringify(this.poiSelection.selected));
                let address = this.poiDataList.find(poi => poi.id == selectedPOI);
                this.waypointsList.unshift({ lat: Number(address.Latitude), lng: Number(address.Longitude), name: address.name });
                this.selectedPOIList.push({ lat: this.unit.latitude, lng: this.unit.longitude, name: this.unit.name });
            }
        }

        let isFinish = this.recursiveWayPoints(this.waypointsList.concat(this.selectedPOIList));
        if (isFinish == true) {
            console.log(this.markerOptions);
            console.log(this.waypoints);
            console.log(this.origin);

        }
        this.isDirection = true;

    }

    recursiveWayPoints(list: any): boolean {
        console.log(list);
        const tempArray = list;
        if (tempArray.length == 2) {
            // this.dir.push(tempArray[0]);
            // this.dir.push(tempArray[1]);
            console.log('end recursive=>>>>', this.dir);
            if (this.isChange) {
                this.origin = this.waypointsList[0];
                this.markerOptions.origin.infoWindow = this.waypointsList[0].name;
            } else {
                this.origin = { lat: this.unit.latitude, lng: this.unit.longitude };
                this.markerOptions.origin.infoWindow = this.unit.name;

            }
            // this.destination = { lat: this.dir[this.dir.length - 1].lat, lng: this.dir[this.dir.length - 1].lng };
            this.destination = { lat: tempArray[1].lat, lng: tempArray[1].lng };
            this.markerOptions.destination.infoWindow = tempArray[1].name;
            // icon: 'assets/icons/map_unitInfo/waypoint2.png',
            for (let p = 0; p < this.dir.length; p++) {
                this.waypoints.push({ location: { lat: this.dir[p].lat, lng: this.dir[p].lng }, stopover: false });
                this.markerOptions.waypoints.push({ infoWindow: this.dir[p].name, icon: 'assets/icons/map_unitInfo/waypoint2.png' });
            }
            return true;

        }

        this.generateWayPointList(tempArray[0], tempArray.slice(1)).then(temp => {
            console.log(temp);
            this.dir.push(temp[0]);
            this.recursiveWayPoints(temp);
        });
    }

    generateWayPointList(origin: {}, dest: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            let waypointList = [];
            console.log(dest);

            for (let i = 0; i < dest.length; i++) {
                this.getDistance(origin, { lat: dest[i].lat, lng: dest[i].lng, name: dest[i].name }).then(distance => {
                    waypointList.push({ lat: dest[i].lat, lng: dest[i].lng, name: dest[i].name, distance: distance });
                    console.log(waypointList, 'distance', distance);
                    if (i == dest.length - 1) {
                        waypointList.sort((a, b) => this.sortByDistance(a, b));
                        console.log(waypointList, i);
                        resolve(waypointList);
                    }
                });
            }
        })
    }

    getDistance(origin: any, destination: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const directionsService = new google.maps.DirectionsService;
            console.log(origin);
            console.log(destination);
            let distance;
            // if (!(origin && destination && origin.lat && destination.lat))
            //     return -1;

            directionsService.route({
                origin,
                destination,
                waypoints: [],
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING
            }, (response, status) => {
                console.log(response, status);
                if (status == 'OK') {
                    distance = response.routes[0].legs[0].distance.value;
                    console.log('distance========>>>', distance);
                    resolve(distance);
                } else {
                    alert('Distance request failed due to ' + status);
                }
            }), reject
        });
    }

    sortByDistance(a, b): number {
        // return new Promise((resolve, reject) => {
        //     console.log('sort==>>', a, b);
        //     if (a.distance > b.distance) resolve(1);
        //     else if (a.distance < b.distance) resolve(-1);
        //     else return resolve(0);
        // })
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

    clearAutoComplete() {
        this.filter_string = '';
        if (this.latitude) {
            this.latitude = null;
            this.longitude = null;
        }
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
        if (this.isChange) {
            this.poiSelection.clear();
            this.poiSelection = new SelectionModel<Element>(false, []);
        } else if (!this.isChange) {
            this.poiSelection = new SelectionModel<Element>(true, []);
        }
        // this.dir = [];
        // this.getDirection();
    }

    close() { this.dialogRef.close(); }
    goback() { this.dialogRef.close('goback'); }
}