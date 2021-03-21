import { Component, Inject, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
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
export class AutocompletePOIDialogComponent implements OnInit, OnDestroy {
    unit: any;
    flag: any;

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
        destination: {
            icon: 'assets/icons/map_unitInfo/default.png',
            infoWindow: ''
        },
    };

    destPlace: any;
    dir: any = [];
    waypointsList: Array<any> = [];
    waypointDistance: Array<any> = [];
    selectedPOIList: Array<any> = [];
    poiDataList: Array<any> = [];
    poiDataListPage: number;
    countDisRequest: number = 0;
    poiSelection = new SelectionModel<Element>(true, []);

    constructor(
        private router: Router,
        private mapsAPILoader: MapsAPILoader,
        private mapsAPIWrapper: GoogleMapsAPIWrapper,
        private agmDirection: AgmDirection,
        private ngZone: NgZone,
        public unitInfoService: UnitInfoService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dialogRef: MatDialogRef<AutocompletePOIDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { unit, flag }
    ) {
        this._unsubscribeAll = new Subject();

        this._fuseTranslationLoaderService.loadTranslations(vehiclesEnglish, vehiclesSpanish, vehiclesFrench, vehiclesPortuguese);
        this.unit = unit;
        this.flag = flag;
        this.getPOIList(1, 1000, this.filter_string);
    }

    ngOnInit() {
        this.poiSelection.isSelected = this.isCheckedRow.bind(this);
        this.mapsAPILoader.load().then(() => {
            this.agmDirection = new AgmDirection(this.mapsAPIWrapper);
            let autocomplete = new google.maps.places.Autocomplete(this.search.nativeElement);
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.destPlace = place.name;

                    if (this.isChange) {
                        this.poiSelection.clear();
                        this.poiSelection = new SelectionModel<Element>(false, []);
                    }
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

            if (this.poiSelection.selected) {
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
                this.waypointsList.unshift({ lat: this.latitude, lng: this.longitude, name: this.destPlace });
                this.selectedPOIList.push({ lat: this.unit.latitude, lng: this.unit.longitude, name: this.unit.name });
            } else {
                let selectedPOI = JSON.parse(JSON.stringify(this.poiSelection.selected));
                let address = this.poiDataList.find(poi => poi.id == selectedPOI);
                this.waypointsList.unshift({ lat: Number(address.Latitude), lng: Number(address.Longitude), name: address.name });
                this.selectedPOIList.push({ lat: this.unit.latitude, lng: this.unit.longitude, name: this.unit.name });
            }
        }

        this.recursiveWayPoints(this.waypointsList.concat(this.selectedPOIList));
    }

    recursiveWayPoints(list: any) {
        const tempArray = list;
        if (tempArray.length == 2) {
            if (this.isChange) {
                this.origin = this.waypointsList[0];
                this.markerOptions.origin.infoWindow = this.waypointsList[0].name;
                this.markerOptions.waypoints = [];
                this.destination = { lat: tempArray[1].lat, lng: tempArray[1].lng };
                this.markerOptions.destination.infoWindow = tempArray[1].name;
                this.isDirection = true;
                return
            } else {
                this.origin = { lat: this.unit.latitude, lng: this.unit.longitude };
                this.markerOptions.origin.infoWindow = this.unit.name;
                this.destination = { lat: tempArray[1].lat, lng: tempArray[1].lng };
                this.markerOptions.destination.infoWindow = tempArray[1].name;
                for (let p = 0; p < this.dir.length; p++) {
                    this.waypoints.push({ location: { lat: this.dir[p].lat, lng: this.dir[p].lng }, stopover: false });
                    this.markerOptions.waypoints.push({ infoWindow: this.dir[p].name, icon: 'assets/icons/map_unitInfo/waypoint2.png' });
                    if (p == this.dir.length - 1) {
                        this.isDirection = true;
                        return
                    }
                }
            }
        } else {
            this.generateWayPointList(tempArray[0], tempArray.slice(1)).then(temp => {
                this.dir.push(temp[0]);
                this.recursiveWayPoints(temp);
            });
        }
    }

    async generateWayPointList(origin: {}, dest: any[]): Promise<any> {
        return await new Promise((resolve, reject) => {
            this.waypointDistance = [];

            for (let i = 0; i < dest.length; i++) {
                this.getDistance(origin, { lat: dest[i].lat, lng: dest[i].lng, name: dest[i].name }).then(distance => {
                    this.waypointDistance.push({ lat: dest[i].lat, lng: dest[i].lng, name: dest[i].name, distance: distance });
                    if (i == dest.length - 1) {
                        setTimeout(() => {
                            this.waypointDistance.sort((a, b) => this.sortByDistance(a, b));
                            resolve(this.waypointDistance);
                        }, 250);

                    }
                });
            };
        })
    }

    getDistance(origin: any, destination: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const directionsService = new google.maps.DirectionsService;
            let distance = 0;
            this.countDisRequest += 1;
            if (this.countDisRequest == 10) {
                setTimeout(() => {
                    directionsService.route({
                        origin,
                        destination,
                        waypoints: [],
                        optimizeWaypoints: true,
                        travelMode: google.maps.TravelMode.DRIVING
                    }, (response, status) => {
                        if (status == 'OK') {
                            distance = response.routes[0].legs[0].distance.value;
                            this.countDisRequest = 0;
                            resolve(distance);
                        } else {
                            alert('Distance request failed due to ' + status);
                        }
                    });
                }, 1000)
            } else {
                directionsService.route({
                    origin,
                    destination,
                    waypoints: [],
                    optimizeWaypoints: true,
                    travelMode: google.maps.TravelMode.DRIVING
                }, (response, status) => {

                    if (status == 'OK') {
                        distance = response.routes[0].legs[0].distance.value;
                        resolve(distance);
                    } else {
                        alert('Distance request failed due to ' + status);
                    }
                });
            }

        })
    }

    sortByDistance(a, b): number {
        if (a.distance > b.distance) return 1;
        else if (a.distance < b.distance) return -1;
        else return 0;
    }

    getPOIList(pageindex: number, pagesize: number, filter_string: string) {
        this.unitInfoService.getPOIList(this.unit.id, pageindex, pagesize, filter_string).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {

            this.poiDataList = res.TrackingXLAPI.DATA;
            this.poiDataListPage = 1;
        });
    }

    onChange(event: any) {

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
            this.getPOIList(1, 1000000, this.filter_string);
        }
    }

    // onCheckboxChangeUnit(e, type) {
    //
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