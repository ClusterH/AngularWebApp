import { Component, Inject, OnInit, OnDestroy, ViewChild, ElementRef, NgZone, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MapsAPILoader } from '@agm/core';
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as vehiclesEnglish } from 'app/main/admin/vehicles/i18n/en';
import { locale as vehiclesFrench } from 'app/main/admin/vehicles/i18n/fr';
import { locale as vehiclesPortuguese } from 'app/main/admin/vehicles/i18n/pt';
import { locale as vehiclesSpanish } from 'app/main/admin/vehicles/i18n/sp';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'vehicle-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class UnitLinkDialogComponent implements OnInit, OnDestroy {
    unit: any;
    flag: any;
    private _unsubscribeAll: Subject<any>;

    @ViewChild('streetviewMap') streetviewMap: any;
    @ViewChild('streetviewPano') streetviewPano: any;
    @ViewChild('search') search: any;

    zoom: number = 12;
    heading: number = 34;
    pitch: number = 10;
    scrollwheel: boolean = false;

    latitude: number;
    longitude: number;

    constructor(
        private router: Router,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private dialogRef: MatDialogRef<UnitLinkDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { unit, flag }
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(vehiclesEnglish, vehiclesSpanish, vehiclesFrench, vehiclesPortuguese);
        this.unit = unit;
        this.flag = flag;
    }

    ngOnInit() {
        if (this.flag == 'streetview') {
            this.mapsAPILoader.load().then(() => {
                let center = { lat: this.unit.latitude, lng: this.unit.longitude };
                let map = new window['google'].maps.Map(this.streetviewMap.nativeElement, { center: center, zoom: this.zoom, scrollwheel: this.scrollwheel });
                let panorama = new window['google'].maps.StreetViewPanorama(
                    this.streetviewPano.nativeElement, {
                    position: center,
                    pov: { heading: this.heading, pitch: this.pitch },
                    scrollwheel: this.scrollwheel
                });
                map.setStreetView(panorama);
            });
        } else if (this.flag == 'direction') {
            this.mapsAPILoader.load().then(() => {
                // let temp = this.search.map(res => {
                //
                // })
                let autocomplete = new google.maps.places.Autocomplete(this.search.nativeElement);

                autocomplete.addListener("place_changed", () => {
                    this.ngZone.run(() => {
                        //get the place result
                        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                        //verify result
                        if (place.geometry === undefined || place.geometry === null) {
                            return;
                        }

                        //set latitude, longitude and zoom
                        this.latitude = place.geometry.location.lat();
                        this.longitude = place.geometry.location.lng();
                        // this.zoom = 12;

                    });
                });
            });
        }
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    close() { this.dialogRef.close(); }
    goback() { this.dialogRef.close('goback'); }
}