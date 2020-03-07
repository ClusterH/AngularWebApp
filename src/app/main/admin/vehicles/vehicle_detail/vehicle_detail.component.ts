import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Vehicle } from 'app/main/admin/vehicles/vehicle_detail/vehicle_detail.model';
import { VehiclesService } from 'app/main/admin/vehicles/services/vehicles.service';

import { VehicleDetailService } from 'app/main/admin/vehicles/vehicle_detail/vehicle_detail.service';

import { locale as vehiclesEnglish } from 'app/main/admin/vehicles/i18n/en';
import { locale as vehiclesSpanish } from 'app/main/admin/vehicles/i18n/sp';
import { locale as vehiclesFrench } from 'app/main/admin/vehicles/i18n/fr';
import { locale as vehiclesPortuguese } from 'app/main/admin/vehicles/i18n/pt';

@Component({
    selector     : 'app-vehicle_detail',
    templateUrl  : './vehicle_detail.component.html',
    styleUrls    : ['./vehicle_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class VehicleDetailComponent implements OnInit, OnDestroy
{
    vehicle: any;
    pageType: string;
    vehicleForm: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {VehicleDetailService} _vehicleDetailService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        public router: ActivatedRoute,
        private _adminVehiclesService: VehiclesService,

        private _vehicleDetailService: VehicleDetailService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        // this.vehicle = this._adminVehiclesService.vehicle_detail;
        // console.log(this.vehicle);
        // this.router.params.subscribe(params => {
        //     console.log(params);
        //     if (params) {
        //         this.pageType = 'edit';
        //         this.vehicle = params;
        //         this.vehicleForm = this.createVehicleForm();
        //     } else{
        //         this.pageType ='new';

        //     }
        // });
        // Set the default
        this.vehicle = new Vehicle();

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        
        //Load the translations
        this._fuseTranslationLoaderService.loadTranslations(vehiclesEnglish, vehiclesSpanish, vehiclesFrench, vehiclesPortuguese);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to update vehicle on changes
        this._vehicleDetailService.onVehicleChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(vehicle => {

                if ( vehicle )
                {
                    this.vehicle = new Vehicle(vehicle);
                    this.pageType = 'edit';
                }
                else
                {
                    this.pageType = 'new';
                    this.vehicle = new Vehicle();
                }

                this.vehicleForm = this.createVehicleForm();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create vehicle form
     *
     * @returns {FormGroup}
     */
    createVehicleForm(): FormGroup
    {
        return this._formBuilder.group({
            id          : [this.vehicle.id],
            name        : [this.vehicle.name],
            company      : [this.vehicle.company],
            group       : [this.vehicle.group],
            subgroup      : [this.vehicle.subgroup],
            account : [this.vehicle.account],
            operator        : [this.vehicle.operator],
            unittype       : [this.vehicle.unittype],
            serviceplan         : [this.vehicle.serviceplan],
            producttype       : [this.vehicle.producttype],
            make : [this.vehicle.make],
            model    : [this.vehicle.model],
            isactive      : [this.vehicle.isactive],
            timezone : [this.vehicle.timezone],
            created : [this.vehicle.created],
            createdbyname : [this.vehicle.createdbyname],
            deletedwhen    : [this.vehicle.deletedwhen],
            deletedbyname      : [this.vehicle.deletedbyname],
            lastmodifieddate : [this.vehicle.lastmodifieddate],
            lastmodifiedbyname : [this.vehicle.lastmodifiedbyname]

        });
    }

    /**
     * Save vehicle
     */
    saveVehicle(): void
    {
        const data = this.vehicleForm.getRawValue();
        data.handle = FuseUtils.handleize(data.unit);

        this._vehicleDetailService.saveVehicle(data)
            .then(() => {

                // Trigger the subscription with new data
                this._vehicleDetailService.onVehicleChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Vehicle saved', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });
            });
    }

    /**
     * Add vehicle
     */
    addVehicle(): void
    {
        const data = this.vehicleForm.getRawValue();
        data.handle = FuseUtils.handleize(data.unit);

        this._vehicleDetailService.addVehicle(data)
            .then(() => {

                // Trigger the subscription with new data
                this._vehicleDetailService.onVehicleChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Vehicle added', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });

                // Change the location with new one
                this._location.go('admin/vehicles/vehicles/' + this.vehicle.id + '/' + this.vehicle.name);
            });
    }
}
