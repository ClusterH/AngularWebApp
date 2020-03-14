import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

import {MatTableDataSource} from '@angular/material/table';
import * as $ from 'jquery';

import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { VehicleDetailService } from 'app/main/admin/vehicles/services/vehicle_detail.service';
import { VehiclesService } from 'app/main/admin/vehicles/services/vehicles.service';
import { VehicleDetailDataSource } from "app/main/admin/vehicles/services/vehicle_detail.datasource";

import {CourseDialogComponent} from "../dialog/dialog.component";

import { Vehicle } from 'app/main/admin/vehicles/model/vehicle.model';

@Component({
  selector: 'app-vehicle-detail',
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
  public selected_company = '';

  flag: boolean = false;

  displayedColumns: string[] = ['name'];
  dataSourceCompany: VehicleDetailDataSource;
  dataSourceGroup: VehicleDetailDataSource;
  filter_string: string = '';
  method_string: string = '';

  // Private
  private _unsubscribeAll: Subject<any>;

  @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;
  @ViewChild('paginator2', {read: MatPaginator, static: true})
    paginator2: MatPaginator;

  constructor(
    private vehiclesService: VehiclesService,
    private vehicleDetailService: VehicleDetailService,
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private _location: Location,
    private _matSnackBar: MatSnackBar
  ) {
      this.vehicle = this.vehiclesService.vehicle_detail;
      this.vehiclesService.vehicle_detail = '';
      console.log(this.vehicle, this.vehiclesService.vehicle_detail);
      this.selected_company = this.vehicle.company;
      console.log(this.selected_company);
      this.flag = false;
      this.filter_string = '';
      // this.vehicleForm = this.createVehicleForm();

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


    // this.vehicleForm.get('companyName').setValue(this.vehicle.company);
    this.dataSourceCompany = new VehicleDetailDataSource(this.vehicleDetailService);
    this.dataSourceGroup = new VehicleDetailDataSource(this.vehicleDetailService);
    this.dataSourceCompany.loadCompanies("PolarixUSA", 2, 0, 5, this.filter_string, "company_clist");
    this.dataSourceGroup.loadCompanies("PolarixUSA", 2, 0, 5, this.filter_string, "group_clist");
    // console.log(this.dataSource);
   
    // const paginatorIntl = this.paginator._intl;
    // paginatorIntl.nextPageLabel = '';
    // paginatorIntl.previousPageLabel = '';
    // paginatorIntl.itemsPerPageLabel = '';
    // paginatorIntl.getRangeLabel = disibl;
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit:");

    // var node = $("div.page_index");
    // $("div.page_index").remove();
    // $("mat-select.button.mat-paginator-navigation-previous.mat-icon-button.mat-button-base").after(node);
   
    // // this.paginator.page
    // if (this.dataSource.totalLength) {
      // this.dataSource.loadCompanies("PolarixUSA", 1, 0, 5, "company_clist");
      
      // if (this.method_string == 'company') {
      //   merge(this.paginator.page)
      //   .pipe(
      //     tap(() => {
      //       // if (this.method_string == 'company') {
      //         this.dataSourceCompany.loadCompanies("PolarixUSA", 2, this.paginator.pageIndex, this.paginator.pageSize, this.filter_string, `${this.method_string}_clist`)
      //       // } else if (this.method_string == 'group') {
      //       //   this.dataSourceGroup.loadCompanies("PolarixUSA", 2, this.paginator2.pageIndex, this.paginator2.pageSize, this.filter_string, `${this.method_string}_clist`)
      //       // }
      //     })
      //   )
      //   .subscribe( (res: any) => {
      //       console.log(res);
      //   });
      // } else if (this.method_string == 'group') {

      //   merge(this.paginator2.page)
      //   .pipe(
      //     tap(() => {
      //       // if (this.method_string == 'company') {
      //       //   this.dataSourceCompany.loadCompanies("PolarixUSA", 2, this.paginator.pageIndex, this.paginator.pageSize, this.filter_string, `${this.method_string}_clist`)
      //       // } else if (this.method_string == 'group') {
      //         this.dataSourceGroup.loadCompanies("PolarixUSA", 2, this.paginator2.pageIndex, this.paginator2.pageSize, this.filter_string, `${this.method_string}_clist`)
      //       // }
      //     })
      //   )
      //   .subscribe( (res: any) => {
      //       console.log(res);
      //   });
      // }

      merge(this.paginator.page)
      .pipe(
        tap(() => {
          if (this.method_string == 'company') {
            this.dataSourceCompany.loadCompanies("PolarixUSA", 2, this.paginator.pageIndex, this.paginator.pageSize, this.filter_string, `${this.method_string}_clist`)
          } else if (this.method_string == 'group') {
            this.dataSourceGroup.loadCompanies("PolarixUSA", 2, this.paginator2.pageIndex, this.paginator2.pageSize, this.filter_string, `${this.method_string}_clist`)
          }
        })
      )
      .subscribe( (res: any) => {
          console.log(res);
      });

      merge(this.paginator2.page)
      .pipe(
        tap(() => {
          if (this.method_string == 'company') {
            this.dataSourceCompany.loadCompanies("PolarixUSA", 2, this.paginator.pageIndex, this.paginator.pageSize, this.filter_string, `${this.method_string}_clist`)
          } else if (this.method_string == 'group') {
            this.dataSourceGroup.loadCompanies("PolarixUSA", 2, this.paginator2.pageIndex, this.paginator2.pageSize, this.filter_string, `${this.method_string}_clist`)
          }
        })
      )
      .subscribe( (res: any) => {
          console.log(res);
      });
    }


  // initTable(method: string): boolean {
  //   // this.dataSource = new VehicleDetailDataSource(this.vehicleDetailService);
  //   // this.dataSource.loadCompanies("PolarixUSA", 2, 0, 5, this.filter_string, `${method}_clist`);
  //   this.flag = false;
  //   return true;
  // }

  navigatePageEvent() {
    // console.log(this.index_number);
    // this.paginator.pageIndex = this.dataSource.page_index - 1;
    // this.dataSource.loadCompanies("PolarixUSA", 1, this.paginator.pageIndex, this.paginator.pageSize, "company_clist");
  }

  showCompanyList(item: string) {
    console.log("OK?", item);
    this.method_string = item;
    // this.flag = this.initTable(this.method_string);

    // if (this.flag) {
      // this.dataSource.loadCompanies("PolarixUSA", 2, this.paginator.pageIndex, this.paginator.pageSize, this.filter_string, `${this.method_string}_clist`);

      
      if (item == 'company') {
        this.dataSourceCompany.loadCompanies("PolarixUSA", 2, this.paginator.pageIndex, this.paginator.pageSize, this.filter_string, `${this.method_string}_clist`)
      } else if (item == 'group') {
        this.dataSourceGroup.loadCompanies("PolarixUSA", 2, this.paginator2.pageIndex, this.paginator2.pageSize, this.filter_string, `${this.method_string}_clist`)
      }
    // }
    
    // this.flag = true;
  }

  getCompany(element: any) {
    console.log(element);
    this.selected_company = element.name;
    console.log(this.selected_company);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
      this.paginator.pageIndex = 0;
      // this.dataSource.loadCompanies("PolarixUSA", 2, this.paginator.pageIndex, this.paginator.pageSize, this.filter_string, `${this.method_string}_clist`);
    }
    // else if(this.filter_string == '') {
    //   this.dataSource.loadCompanies("PolarixUSA", 1, this.paginator.pageIndex, this.paginator.pageSize, this.filter_string, "company_clist");
    // }
    console.log(this.filter_string);
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
          lastmodifiedbyname : [this.vehicle.lastmodifiedbyname],
          filter_string      : [this.filter_string]
      });
  }


  saveVehicle(): void {
    console.log("saveVehicle");
  }

  addVehicle(): void {
    console.log("addVehicle");
  }


}
