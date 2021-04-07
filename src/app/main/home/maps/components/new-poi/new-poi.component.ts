import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as mapEnglish } from 'app/main/home/maps/i18n/en';
import { locale as mapFrench } from 'app/main/home/maps/i18n/en';
import { locale as mapPortuguese } from 'app/main/home/maps/i18n/en';
import { locale as mapSpanish } from 'app/main/home/maps/i18n/en';

import { VehMarkersService } from '../../services';
import { NewPOIModel } from '../../models';

declare const google: any;

@Component({
  selector: 'app-new-poi',
  templateUrl: './new-poi.component.html',
  styleUrls: ['./new-poi.component.scss']
})
export class NewPoiComponent implements OnInit, OnDestroy {
  newPOIForm: FormGroup;
  newPOILocation: NewPOIModel;
  isCancelPOIDialog: boolean = false;

  @Output() createNePOIEmitter = new EventEmitter<boolean>();

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _formBuilder: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private vehiclesService: VehMarkersService,
  ) {
    this._unsubscribeAll = new Subject();
    this._fuseTranslationLoaderService.loadTranslations(mapEnglish, mapSpanish, mapFrench, mapPortuguese);
  }

  ngOnInit(): void {
    this.newPOIForm = this._formBuilder.group({
      name: [null, Validators.required],
      address: [null, Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
    });

    this.vehiclesService.newPOILocation$.pipe(takeUntil(this._unsubscribeAll)).subscribe(poi => {
      this.newPOILocation = poi;
      if (!!this.newPOILocation?.latitude) {
        this.getGeoLocation(this.newPOILocation.latitude, this.newPOILocation.longitude);
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  setValueNewPOIForm(poiLocation: NewPOIModel): void {
    this.newPOIForm.get('name').setValue(poiLocation.name);
    this.newPOIForm.get('address').setValue(poiLocation.address);
    this.newPOIForm.get('latitude').setValue(Number(poiLocation.latitude?.toFixed(5)) || undefined);
    this.newPOIForm.get('longitude').setValue(Number(poiLocation.longitude?.toFixed(5)) || undefined);
  }

  saveValueNewPOIForm(): void {
    const userID: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
    const newPOILocation: NewPOIModel = {
      id: 0,
      name: this.newPOIForm.get('name').value,
      address: this.newPOIForm.get('address').value,
      latitude: this.newPOIForm.get('latitude').value,
      longitude: this.newPOIForm.get('longitude').value,
      created: new Date().toISOString(),
      createdby: userID
    }

    this.vehiclesService.savePoiDetail(newPOILocation).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      if (res.responseCode === 100) {
        this.createNePOIEmitter.emit(true)
      } else {
        alert('Failed to save new POI');
      }
    })
  }

  getGeoLocation(lat: number, lng: number): void {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(lat, lng);
    const request = { latLng: latlng };

    geocoder.geocode(request, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        const result = results[0];
        if (result !== null) {
          this.newPOILocation.address = result.formatted_address;
          this.setValueNewPOIForm(this.newPOILocation);
        } else {
          alert("No address available!");
        }
      }
    });
  }

  save(): void {
    this.saveValueNewPOIForm();
  }

  close(): void {
    this.isCancelPOIDialog = true;
  }

  restart(): void {
    this.vehiclesService.newPOILocation.next(undefined);
    const resetData = { name: '', address: '', latitude: undefined, longitude: undefined };
    this.setValueNewPOIForm(resetData);
  }

  closeConfirmDialog(isConfirm): void {
    this.isCancelPOIDialog = false;

    if (isConfirm) {
      this.createNePOIEmitter.emit(true);
    } else {
      return;
    }
  }
}
