import { Component, Inject, OnInit, OnDestroy, ViewChild, NgZone, Optional, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { MapsAPILoader, AgmMap, GoogleMapsAPIWrapper } from '@agm/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as routeplanningEnglish } from 'app/main/logistic/routeplanning/i18n/en';
import { locale as routeplanningFrench } from 'app/main/logistic/routeplanning/i18n/fr';
import { locale as routeplanningPortuguese } from 'app/main/logistic/routeplanning/i18n/pt';
import { locale as routeplanningSpanish } from 'app/main/logistic/routeplanning/i18n/sp';
import { RoutePlanningDriverService } from '../../services';
import { UserPOIs } from '../../model';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isEmpty } from 'lodash';

@Component({
    selector: 'attend-form-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SetStartValuesDialogComponent implements OnInit, OnDestroy {
    startValueForm: FormGroup;
    isTimeChecked: boolean = false;
    isAddressChecked: boolean = false;
    latitude: number;
    longitude: number;
    destPlace: string = '';
    userPOIs$: Observable<UserPOIs[]>;
    userPOIs: UserPOIs[];
    selectedPOI: UserPOIs;
    addressType: string = 'Google Address';

    @ViewChild('search') search: any;

    private flag = new BehaviorSubject<boolean>(false);
    private _unsubscribeAll: Subject<any>;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private routeplanningDriverService: RoutePlanningDriverService,
        public matDialogRef: MatDialogRef<SetStartValuesDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(routeplanningEnglish, routeplanningSpanish, routeplanningFrench, routeplanningPortuguese);

    }

    ngOnInit() {
        this.startValueForm = new FormGroup({
            from: new FormControl(null, Validators.required),
            to: new FormControl(null, Validators.required),
            google_address: new FormControl(null),
            poi_address: new FormControl(null),
        });

        this.routeplanningDriverService.getUserPOIs().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {

            this.userPOIs = res.TrackingXLAPI.DATA;
            this.userPOIs$ = of(this.userPOIs);
        });

        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.search.nativeElement);

            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.destPlace = place.formatted_address;
                });
            });
        });
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    searchFromPOIList(e: any) {
        const filterString = e.target.value;
        const tempPOIs = this.userPOIs.filter(item => item.name.toLowerCase().includes(filterString.toLowerCase()));
        this.userPOIs$ = of(tempPOIs);
    }

    setValue() {

    }

    getValue() {
    }

    paramDateFormat(date: any) {
        let str = '';
        if (date != '') {
            str =
                ("00" + (date.getMonth() + 1)).slice(-2)
                + "/" + ("00" + date.getDate()).slice(-2)
                + "/" + date.getFullYear() + " "
                + ("00" + date.getHours()).slice(-2) + ":"
                + ("00" + date.getMinutes()).slice(-2)
                + ":" + ("00" + date.getSeconds()).slice(-2);
        }

        return str;
    }

    dateFormat(date: any) {
        let str = new Date(date).toISOString().substring(0, 10);

        return str;
    }

    timeFormat(time: any) {
        let str = '';
        if (time != '') {
            str =
                ("00" + time.getHours()).slice(-2) + ":"
                + ("00" + time.getMinutes()).slice(-2)
        }
        return str;
    }

    save() {
        if (!this.isTimeChecked && !this.isAddressChecked) {
            alert('Please choose start Values');
            return;
        }

        if (this.isAddressChecked && this.addressType == 'Google Address') {
            if (isEmpty(this.destPlace)) {
                alert('Please Choose Google address first');
                return;
            }
        } else if (this.isAddressChecked && this.addressType == 'POI Address') {

            this.selectedPOI = this.userPOIs.filter(item => item.name == this.startValueForm.get('poi_address').value)[0];

            if (isEmpty(this.selectedPOI)) {
                alert('Please Choose  POI address first');
                return;
            }
        }

        if (this.isTimeChecked) {
            if (isEmpty(this.startValueForm.get('from').value) || isEmpty(this.startValueForm.get('to').value)) {
                alert('Please Choose Time first');
                return;
            }
        }
        const selectedData = {
            startlocation: this.addressType == 'Google Address' ? this.destPlace : this.selectedPOI.name,
            latitude: this.addressType == 'Google Address' ? this.latitude : this.selectedPOI.latitude,
            longitude: this.addressType == 'Google Address' ? this.longitude : this.selectedPOI.longitude,
            starttime: this.startValueForm.get('from').value,
            endtime: this.startValueForm.get('to').value
        }

        this.matDialogRef.close(selectedData);
    }
}