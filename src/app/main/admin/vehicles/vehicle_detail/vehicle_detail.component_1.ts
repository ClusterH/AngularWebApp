import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

import * as $ from 'jquery';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { VehicleDetailService } from 'app/main/admin/vehicles/services/vehicle_detail.service';
import { VehiclesService } from 'app/main/admin/vehicles/services/vehicles.service';
import { VehicleDetailDataSource } from "app/main/admin/vehicles/services/vehicle_detail.datasource";

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle_detail.component.html',
  styleUrls: ['./vehicle_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class VehicleDetailComponent implements OnInit
{
  @ViewChild('ng-select', { static: false }) ngSelect;
  @BlockUI('singleSelect') blockUISingleSelect: NgBlockUI;
  @BlockUI('multipleSelect') blockUIMultipleSelect: NgBlockUI;

  vehicle: any;
  pageType: string;

  loadData: any;

  loadArray = [
    { item_id: 1, item_text: "Alaska"
    },
    { item_id: 2, item_text: "California"
    },
    { item_id: 3, item_text: "Colorado"
    },
    { item_id: 4, item_text: "New Mexico"
    },
    { item_id: 5, item_text: "Alabama"
    },
    { item_id: 6, item_text: "Connecticut"
    },
    { item_id: 7, item_text: "New York"
    }
  ];

 

  constructor(
   
  ) {

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

    this.loadData = this.loadArray[2].item_text;

  }

  ngAfterViewInit() {

  }

  saveVehicle(): void {
    console.log("saveVehicle");
  }

  addVehicle(): void {
    console.log("addVehicle");
  }
}
