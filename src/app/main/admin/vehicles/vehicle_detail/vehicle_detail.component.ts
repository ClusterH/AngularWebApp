import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

import { Vehicle } from 'app/main/admin/vehicles/model/vehicle.model';

import * as $ from 'jquery';

import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

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
  vehicle_detail: any;
  vehicle: any;
  pageType: string;
  // vehicleForm: FormGroup;
  selected_company = '';
  company = '';

  vehicleForm: FormGroup;

  flag: boolean = false;

  displayedColumns: string[] = ['name'];

  dataSourceCompany: VehicleDetailDataSource;
  dataSourceGroup: VehicleDetailDataSource;
  dataSourceAccount: VehicleDetailDataSource;
  dataSourceOperator: VehicleDetailDataSource;
  dataSourceUnitType: VehicleDetailDataSource;
  dataSourceServicePlan: VehicleDetailDataSource;
  dataSourceProductType: VehicleDetailDataSource;
  dataSourceMake: VehicleDetailDataSource;
  dataSourceModel: VehicleDetailDataSource;
  dataSourceTimeZone: VehicleDetailDataSource;
 
  filter_string: string = '';
  method_string: string = '';
  
  @ViewChild(MatPaginator, {static: true})
    paginatorCompany: MatPaginator;
  @ViewChild('paginatorGroup', {read: MatPaginator, static: true})
    paginatorGroup: MatPaginator;
  @ViewChild('paginatorAccount', {read: MatPaginator, static: true})
    paginatorAccount: MatPaginator;
  @ViewChild('paginatorOperator', {read: MatPaginator, static: true})
    paginatorOperator: MatPaginator;
  @ViewChild('paginatorUnitType', {read: MatPaginator, static: true})
    paginatorUnitType: MatPaginator;
  @ViewChild('paginatorServicePlan', {read: MatPaginator, static: true})
    paginatorServicePlan: MatPaginator;
  @ViewChild('paginatorProductType', {read: MatPaginator, static: true})
    paginatorProductType: MatPaginator;
  @ViewChild('paginatorMake', {read: MatPaginator, static: true})
    paginatorMake: MatPaginator;
  @ViewChild('paginatorModel', {read: MatPaginator, static: true})
    paginatorModel: MatPaginator;
  @ViewChild('paginatorTimeZone', {read: MatPaginator, static: true})
    paginatorTimeZone: MatPaginator;
  productForm: FormGroup;

  constructor(
    private vehiclesService: VehiclesService,
    private vehicleDetailService: VehicleDetailService,
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
  ) {
    this.vehicle = this.vehicleDetailService.vehicle_detail;
    // this.company = this.vehicle.company?  this.vehicle.company : '';
      // this.vehicle = sessionStorage.getItem("vehicle_detail")? JSON.parse(sessionStorage.getItem("vehicle_detail")) : '';
      if ( this.vehicle )
      {
        // this.vehicle = JSON.parse(sessionStorage.getItem("vehicle_detail"));
        this.pageType = 'edit';
      }
      else
      {
        // this.vehicle = new Vehicle;
        console.log(this.vehicle);
        this.pageType = 'new';
      }
      this.flag = false;
      this.filter_string = '';
  }

  ngOnInit(): void {
    console.log(this.vehicle);
  
    this.dataSourceCompany        = new VehicleDetailDataSource(this.vehicleDetailService);
    this.dataSourceGroup          = new VehicleDetailDataSource(this.vehicleDetailService);
    this.dataSourceAccount        = new VehicleDetailDataSource(this.vehicleDetailService);
    this.dataSourceOperator       = new VehicleDetailDataSource(this.vehicleDetailService);
    this.dataSourceUnitType       = new VehicleDetailDataSource(this.vehicleDetailService);
    this.dataSourceServicePlan    = new VehicleDetailDataSource(this.vehicleDetailService);
    this.dataSourceProductType    = new VehicleDetailDataSource(this.vehicleDetailService);
    this.dataSourceMake           = new VehicleDetailDataSource(this.vehicleDetailService);
    this.dataSourceModel          = new VehicleDetailDataSource(this.vehicleDetailService);
    this.dataSourceTimeZone       = new VehicleDetailDataSource(this.vehicleDetailService);

    this.dataSourceCompany.loadCompanies("PolarixUSA", 2, 0, 10, this.filter_string, "company_clist");
    this.dataSourceGroup.loadCompanies("PolarixUSA", 2, 0, 10, this.filter_string, "group_clist");
    this.dataSourceAccount.loadCompanies("PolarixUSA", 2, 0, 10, this.filter_string, "account_clist");
    this.dataSourceOperator.loadCompanies("PolarixUSA", 2, 0, 10, this.filter_string, "operator_clist");
    this.dataSourceUnitType.loadCompanies("PolarixUSA", 2, 0, 10, this.filter_string, "unittype_clist");
    this.dataSourceServicePlan.loadCompanies("PolarixUSA", 2, 0, 10, this.filter_string, "serviceplan_clist");
    this.dataSourceProductType.loadCompanies("PolarixUSA", 2, 0, 10, this.filter_string, "producttype_clist");
    this.dataSourceMake.loadCompanies("PolarixUSA", 2, 0, 10, this.filter_string, "make_clist");
    this.dataSourceModel.loadCompanies("PolarixUSA", 2, 0, 10, this.filter_string, "model_clist");
    this.dataSourceTimeZone.loadCompanies("PolarixUSA", 2, 0, 10, this.filter_string, "timezone_clist");

    this.vehicleForm = this._formBuilder.group({
      name               : [null, Validators.required],
      company            : [null, Validators.required],
      group              : [null, Validators.required],
      subgroup           : [null, Validators.required],
      account            : [null, Validators.required],
      operator           : [null, Validators.required],
      unittype           : [null, Validators.required],
      serviceplan        : [null, Validators.required],
      producttype        : [null, Validators.required],
      make               : [null, Validators.required],
      model              : [null, Validators.required],
      isactive           : [null, Validators.required],
      timezone           : [null, Validators.required],
      created            : [null, Validators.required],
      createdbyname      : [null, Validators.required],
      deletedwhen        : [null, Validators.required],
      deletedbyname      : [null, Validators.required],
      lastmodifieddate   : [null, Validators.required],
      lastmodifiedbyname : [null, Validators.required],
  });

  this.setValues();
}

  ngAfterViewInit() {
    console.log("ngAfterViewInit:");

    // var node = $("div.page_index");
    // $("div.page_index").remove();
    // $("mat-select.button.mat-paginator-navigation-previous.mat-icon-button.mat-button-base").after(node);
    merge(this.paginatorCompany.page)
    .pipe(
      tap(() => {
        this.dataSourceCompany.loadCompanies("PolarixUSA", 2, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, "company_clist")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorGroup.page)
    .pipe(
      tap(() => {
        this.dataSourceGroup.loadCompanies("PolarixUSA", 2, this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, `${this.method_string}_clist`)
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorAccount.page)
    .pipe(
      tap(() => {
        this.dataSourceAccount.loadCompanies("PolarixUSA", 2, this.paginatorAccount.pageIndex, this.paginatorAccount.pageSize, this.filter_string, `${this.method_string}_clist`)
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorOperator.page)
    .pipe(
      tap(() => {
        this.dataSourceOperator.loadCompanies("PolarixUSA", 2, this.paginatorOperator.pageIndex, this.paginatorOperator.pageSize, this.filter_string, `${this.method_string}_clist`)
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorUnitType.page)
    .pipe(
      tap(() => {
        this.dataSourceUnitType.loadCompanies("PolarixUSA", 2, this.paginatorUnitType.pageIndex, this.paginatorUnitType.pageSize, this.filter_string, `${this.method_string}_clist`)
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorServicePlan.page)
    .pipe(
      tap(() => {
        this.dataSourceServicePlan.loadCompanies("PolarixUSA", 2, this.paginatorServicePlan.pageIndex, this.paginatorServicePlan.pageSize, this.filter_string, `${this.method_string}_clist`)
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorProductType.page)
    .pipe(
      tap(() => {
        this.dataSourceProductType.loadCompanies("PolarixUSA", 2, this.paginatorProductType.pageIndex, this.paginatorProductType.pageSize, this.filter_string, `${this.method_string}_clist`)
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorMake.page)
    .pipe(
      tap(() => {
        this.dataSourceMake.loadCompanies("PolarixUSA", 2, this.paginatorMake.pageIndex, this.paginatorMake.pageSize, this.filter_string, `${this.method_string}_clist`)
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorModel.page)
    .pipe(
      tap(() => {
        this.dataSourceModel.loadCompanies("PolarixUSA", 2, this.paginatorModel.pageIndex, this.paginatorModel.pageSize, this.filter_string, `${this.method_string}_clist`)
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorTimeZone.page)
    .pipe(
      tap(() => {
        this.dataSourceTimeZone.loadCompanies("PolarixUSA", 2, this.paginatorTimeZone.pageIndex, this.paginatorTimeZone.pageSize, this.filter_string, `${this.method_string}_clist`)
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });
  }

  navigatePageEvent() {
    // console.log(this.index_number);
    // this.paginator.pageIndex = this.dataSource.page_index - 1;
    // this.dataSource.loadCompanies("PolarixUSA", 1, this.paginator.pageIndex, this.paginator.pageSize, "company_clist");
  }

  showCompanyList(item: string) {
    this.method_string = item;
  }

  getCompany(element: any) {
    console.log(element);
    this.selected_company = element.name;
    console.log(this.selected_company);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
        this.paginatorCompany.pageIndex = 0;

        if (this.method_string == 'company') {
            this.dataSourceCompany.loadCompanies("PolarixUSA", 2, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${this.method_string}_clist`)
        } else if (this.method_string == 'group') {
            this.dataSourceGroup.loadCompanies("PolarixUSA", 2, this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, `${this.method_string}_clist`)
        } else if (this.method_string == 'active') {
            this.dataSourceAccount.loadCompanies("PolarixUSA", 2, this.paginatorAccount.pageIndex, this.paginatorAccount.pageSize, this.filter_string, `${this.method_string}_clist`)
        } else if (this.method_string == 'operator') {
            this.dataSourceOperator.loadCompanies("PolarixUSA", 2, this.paginatorOperator.pageIndex, this.paginatorOperator.pageSize, this.filter_string, `${this.method_string}_clist`)
        } else if (this.method_string == 'unittype') {
            this.dataSourceUnitType.loadCompanies("PolarixUSA", 2, this.paginatorUnitType.pageIndex, this.paginatorUnitType.pageSize, this.filter_string, `${this.method_string}_clist`)
        } else if (this.method_string == 'serviceplan') {
            this.dataSourceServicePlan.loadCompanies("PolarixUSA", 2, this.paginatorServicePlan.pageIndex, this.paginatorServicePlan.pageSize, this.filter_string, `${this.method_string}_clist`)
        } else if (this.method_string == 'producttype') {
            this.dataSourceProductType.loadCompanies("PolarixUSA", 2, this.paginatorProductType.pageIndex, this.paginatorProductType.pageSize, this.filter_string, `${this.method_string}_clist`)
        } else if (this.method_string == 'make') {
            this.dataSourceMake.loadCompanies("PolarixUSA", 2, this.paginatorMake.pageIndex, this.paginatorMake.pageSize, this.filter_string, `${this.method_string}_clist`)
        } else if (this.method_string == 'model') {
            this.dataSourceModel.loadCompanies("PolarixUSA", 2, this.paginatorModel.pageIndex, this.paginatorModel.pageSize, this.filter_string, `${this.method_string}_clist`)
        } else if (this.method_string == 'timezone') {
            this.dataSourceTimeZone.loadCompanies("PolarixUSA", 2, this.paginatorTimeZone.pageIndex, this.paginatorTimeZone.pageSize, this.filter_string, `${this.method_string}_clist`)
        }
    } 
    console.log(this.filter_string);
  }

  setValues() {
      this.vehicleForm.get('name').setValue(this.vehicle.name);
      this.vehicleForm.get('company').setValue(this.vehicle.companyid);
      this.vehicleForm.get('group').setValue(this.vehicle.group);
      this.vehicleForm.get('account').setValue(this.vehicle.account);
      this.vehicleForm.get('operator').setValue(this.vehicle.operator);
      this.vehicleForm.get('unittype').setValue(this.vehicle.unittype);
      this.vehicleForm.get('serviceplan').setValue(this.vehicle.serviceplan);
      this.vehicleForm.get('producttype').setValue(this.vehicle.producttype);
      this.vehicleForm.get('make').setValue(this.vehicle.make);
      this.vehicleForm.get('model').setValue(this.vehicle.model);
      this.vehicleForm.get('timezone').setValue(this.vehicle.timezone);
      this.vehicleForm.get('created').setValue(this.vehicle.created);
      this.vehicleForm.get('createdbyname').setValue(this.vehicle.createdbyname);
      this.vehicleForm.get('deletedwhen').setValue(this.vehicle.deletedwhen);
      this.vehicleForm.get('deletedbyname').setValue(this.vehicle.deletedbyname);
      this.vehicleForm.get('lastmodifieddate').setValue(this.vehicle.lastmodifieddate);
      this.vehicleForm.get('lastmodifiedbyname').setValue(this.vehicle.lastmodifiedbyname);
  }
  getValues() {
    this.vehicleForm.get('name')
  }

  changeClient(data) {
    console.log("Company:", data);
  }

  saveVehicle(): void {
    console.log("saveVehicle");
    this.getValues();
  }

  addVehicle(): void {
    console.log("addVehicle");
  }
}
