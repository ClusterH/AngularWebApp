import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { VehicleDetailService } from 'app/main/admin/vehicles/services/vehicle_detail.service';
import { VehiclesService } from 'app/main/admin/vehicles/services/vehicles.service';

import { Vehicle } from 'app/main/admin/vehicles/model/vehicle.model';

@Component({
  selector: 'app-vehicle_detail',
  templateUrl: './vehicle_detail.component.html',
  styleUrls: ['./vehicle_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class VehicleDetailComponent implements OnInit
{
  vehicle: any;
  pageType: string;
  vehicleForm: FormGroup;
  
  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private vehiclesService: VehiclesService,
    private vehicleDetailService: VehicleDetailService,
    private _formBuilder: FormBuilder,
    private _location: Location,
    private _matSnackBar: MatSnackBar
  ) {
    this.vehicle = this.vehiclesService.vehicle_detail;
    this.vehiclesService.vehicle_detail = '';
    console.log(this.vehicle, this.vehiclesService.vehicle_detail);
  }

  ngOnInit(): void {

    if ( this.vehicle )
    {
      this.pageType = 'edit';
    }
    else
    {
        this.pageType = 'new';
    }

    this.vehicleForm = this.createVehicleForm();
  }

  createVehicleForm(): FormGroup
  {
      return this._formBuilder.group({
          id                 : [this.vehicle.id],
          name               : [this.vehicle.name],
          company            : [this.vehicle.company],
          group              : [this.vehicle.group],
          subgroup           : [this.vehicle.subgroup],
          account            : [this.vehicle.account],
          operator           : [this.vehicle.operator],
          unittype           : [this.vehicle.unittype],
          serviceplan        : [this.vehicle.serviceplan],
          producttype        : [this.vehicle.producttype],
          make               : [this.vehicle.make],
          model              : [this.vehicle.model],
          isactive           : [this.vehicle.isactive],
          timezone           : [this.vehicle.timezone],
          created            : [this.vehicle.created],
          createdbyname      : [this.vehicle.createdbyname],
          deletedwhen        : [this.vehicle.deletedwhen],
          deletedbyname      : [this.vehicle.deletedbyname],
          lastmodifieddate   : [this.vehicle.lastmodifieddate],
          lastmodifiedbyname : [this.vehicle.lastmodifiedbyname]
      });
  }


  saveVehicle(): void {
    console.log("saveVehicle");
  }

  addVehicle(): void {
    console.log("addVehicle");
  }


}
