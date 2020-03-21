import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { VehicleDetail } from 'app/main/admin/vehicles/model/vehicle.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import * as $ from 'jquery';

import { Subject, merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { VehicleDetailService } from 'app/main/admin/vehicles/services/vehicle_detail.service';
import { VehicleDetailDataSource } from "app/main/admin/vehicles/services/vehicle_detail.datasource";
import { AuthService } from 'app/authentication/services/authentication.service';

import { locale as vehiclesEnglish } from 'app/main/admin/vehicles/i18n/en';
import { locale as vehiclesSpanish } from 'app/main/admin/vehicles/i18n/sp';
import { locale as vehiclesFrench } from 'app/main/admin/vehicles/i18n/fr';
import { locale as vehiclesPortuguese } from 'app/main/admin/vehicles/i18n/pt';

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
  public vehicle: any;
  pageType: string;
  userConncode: string;
  userID: number;

  vehicleModel_flag: boolean;

  vehicleForm: FormGroup;
  vehicleDetail: VehicleDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: VehicleDetailDataSource;

  dataSourceCompany:     VehicleDetailDataSource;
  dataSourceGroup:       VehicleDetailDataSource;
  dataSourceAccount:     VehicleDetailDataSource;
  dataSourceOperator:    VehicleDetailDataSource;
  dataSourceUnitType:    VehicleDetailDataSource;
  dataSourceServicePlan: VehicleDetailDataSource;
  dataSourceProductType: VehicleDetailDataSource;
  dataSourceMake:        VehicleDetailDataSource;
  dataSourceModel:       VehicleDetailDataSource;
  dataSourceTimeZone:    VehicleDetailDataSource;
 
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
  @ViewChild('paginatorModel', {read: MatPaginator})
    paginatorModel: MatPaginator;
  @ViewChild('paginatorTimeZone', {read: MatPaginator, static: true})
    paginatorTimeZone: MatPaginator;

  constructor(
    public vehicleDetailService: VehicleDetailService,
    private authService: AuthService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(vehiclesEnglish, vehiclesSpanish, vehiclesFrench, vehiclesPortuguese);

    this.vehicle = sessionStorage.getItem("vehicle_detail")? JSON.parse(sessionStorage.getItem("vehicle_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.vehicle != '' )
    {
      this.vehicleDetailService.current_makeID = this.vehicle.makeid;
      this.vehicleModel_flag = true;
      console.log("makeid: ", this.vehicleDetailService.current_makeID);
      this.pageType = 'edit';
    }
    else
    {
      console.log(this.vehicle);
      this.vehicleDetailService.current_makeID = 0;
      this.vehicleModel_flag = false;

      this.pageType = 'new';
    }

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

    this.dataSourceCompany      .loadVehicleDetail(this.userConncode, this.userID, 0, 10, this.vehicle.company, "company_clist");
    this.dataSourceGroup        .loadVehicleDetail(this.userConncode, this.userID, 0, 10, this.vehicle.group, "group_clist");
    this.dataSourceAccount      .loadVehicleDetail(this.userConncode, this.userID, 0, 10, this.vehicle.account, "account_clist");
    this.dataSourceOperator     .loadVehicleDetail(this.userConncode, this.userID, 0, 10, this.vehicle.operator, "operator_clist");
    this.dataSourceUnitType     .loadVehicleDetail(this.userConncode, this.userID, 0, 10, this.vehicle.unittype, "unittype_clist");
    this.dataSourceServicePlan  .loadVehicleDetail(this.userConncode, this.userID, 0, 10, this.vehicle.serviceplan, "serviceplan_clist");
    this.dataSourceProductType  .loadVehicleDetail(this.userConncode, this.userID, 0, 10, '', "producttype_clist");
    this.dataSourceMake         .loadVehicleDetail(this.userConncode, this.userID, 0, 10, this.vehicle.make, "make_clist");
    if(this.vehicleModel_flag) {
      this.dataSourceModel      .loadVehicleDetail(this.userConncode, this.userID, 0, 10, this.vehicle.model, "model_clist");
    }
    this.dataSourceTimeZone     .loadVehicleDetail(this.userConncode, this.userID, 0, 10, this.vehicle.timezone, "timezone_clist");

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
      created            : [{value: '', disabled: true}, Validators.required],
      createdbyname      : [{value: '', disabled: true}, Validators.required],
      deletedwhen        : [{value: '', disabled: true}, Validators.required],
      deletedbyname      : [{value: '', disabled: true}, Validators.required],
      lastmodifieddate   : [{value: '', disabled: true}, Validators.required],
      lastmodifiedbyname : [{value: '', disabled: true}, Validators.required],
      filterstring       : [null, Validators.required],
  });

  this.setValues();
}

  ngAfterViewInit() {
    console.log("ngAfterViewInit:");
    
    merge(this.paginatorCompany.page)
    .pipe(
      tap(() => {
        this.loadVehicleDetail("company")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorGroup.page)
    .pipe(
      tap(() => {
        this.loadVehicleDetail("group")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorAccount.page)
    .pipe(
      tap(() => {
        this.loadVehicleDetail("account")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorOperator.page)
    .pipe(
      tap(() => {
        this.loadVehicleDetail("operator")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorUnitType.page)
    .pipe(
      tap(() => {
        this.loadVehicleDetail("unittype")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorServicePlan.page)
    .pipe(
      tap(() => {
        this.loadVehicleDetail("serviceplan")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorProductType.page)
    .pipe(
      tap(() => {
        this.loadVehicleDetail("producttype")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorMake.page)
    .pipe(
      tap(() => {
        this.loadVehicleDetail("make")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    if(this.vehicleModel_flag) {
      merge(this.paginatorModel.page)
      .pipe(
        tap(() => {
          // this.vehicleDetailService.current_makeID = this.vehicleForm.get('make').value;

          console.log("makeid: ", this.vehicleDetailService.current_makeID);
          this.paginatorModel.pageIndex = 0
  
          this.loadVehicleDetail('model')
        })
      )
      .subscribe( (res: any) => {
          console.log(res);
      });
    }

    merge(this.paginatorTimeZone.page)
    .pipe(
      tap(() => {
        this.loadVehicleDetail("timezone")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });
  }

  loadVehicleDetail(method_string: string) {
    if (method_string == 'company') {
      this.dataSourceCompany.loadVehicleDetail(this.userConncode, this.userID, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'group') {
        this.dataSourceGroup.loadVehicleDetail(this.userConncode, this.userID, this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'active') {
        this.dataSourceAccount.loadVehicleDetail(this.userConncode, this.userID, this.paginatorAccount.pageIndex, this.paginatorAccount.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'operator') {
        this.dataSourceOperator.loadVehicleDetail(this.userConncode, this.userID, this.paginatorOperator.pageIndex, this.paginatorOperator.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'unittype') {
        this.dataSourceUnitType.loadVehicleDetail(this.userConncode, this.userID, this.paginatorUnitType.pageIndex, this.paginatorUnitType.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'serviceplan') {
        this.dataSourceServicePlan.loadVehicleDetail(this.userConncode, this.userID, this.paginatorServicePlan.pageIndex, this.paginatorServicePlan.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'producttype') {
        this.dataSourceProductType.loadVehicleDetail(this.userConncode, this.userID, this.paginatorProductType.pageIndex, this.paginatorProductType.pageSize, "", `${method_string}_clist`)
    } else if (method_string == 'make') {
        this.dataSourceMake.loadVehicleDetail(this.userConncode, this.userID, this.paginatorMake.pageIndex, this.paginatorMake.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'model') {
        this.dataSourceModel.loadVehicleDetail(this.userConncode, this.userID, this.paginatorModel.pageIndex, this.paginatorModel.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'timezone') {
        this.dataSourceTimeZone.loadVehicleDetail(this.userConncode, this.userID, this.paginatorTimeZone.pageIndex, this.paginatorTimeZone.pageSize, this.filter_string, `${method_string}_clist`)
    }
  }

  managePageIndex(method_string: string) {
    switch(method_string) {
      case 'company':
        this.paginatorCompany.pageIndex = 0;
      break;

      case 'account':
        this.paginatorAccount.pageIndex = 0;
      break;

      case 'group':
        this.paginatorGroup.pageIndex = 0;
      break;

      case 'operator':
        this.paginatorOperator.pageIndex = 0;
      break;

      case 'unittype':
        this.paginatorUnitType.pageIndex = 0;
      break;

      case 'serviceplan':
        this.paginatorServicePlan.pageIndex = 0;
      break;

      case 'producttype':
        this.paginatorProductType.pageIndex = 0;
      break;

      case 'make':
        this.paginatorMake.pageIndex = 0;
      break;

      case 'model':
        this.paginatorModel.pageIndex = 0;
      break;

      case 'timezone':
        this.paginatorTimeZone.pageIndex = 0;
      break;
    }
  }

  showCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
    if (this.method_string == 'model' && !this.vehicleModel_flag) {
        alert("Please check first Make is selected!");
    } else {
      let selected_element_id = this.vehicleForm.get(`${this.method_string}`).value;

      console.log(methodString, this.vehicleDetailService.unit_clist_item[methodString], selected_element_id );

      let clist = this.vehicleDetailService.unit_clist_item[methodString];

      for (let i = 0; i< clist.length; i++) {
        if ( clist[i].id == selected_element_id ) {
          this.vehicleForm.get('filterstring').setValue(clist[i].name);
          this.filter_string = clist[i].name;
        }
      }
     
      this.managePageIndex(this.method_string);
      this.loadVehicleDetail(this.method_string);
    }
  }

  clearFilter() {
    console.log(this.filter_string);
    this.filter_string = '';
    this.vehicleForm.get('filterstring').setValue(this.filter_string);

    // if (this.method_string == 'model') {
    // }
    this.managePageIndex(this.method_string);
    this.loadVehicleDetail(this.method_string);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
     
      this.managePageIndex(this.method_string);
      this.loadVehicleDetail(this.method_string);
    }

    console.log(this.filter_string);
  }

  setValues() {
      this.vehicleForm.get('name').setValue(this.vehicle.name);
      this.vehicleForm.get('company').setValue(this.vehicle.companyid);
      this.vehicleForm.get('group').setValue(this.vehicle.groupid);
      this.vehicleForm.get('account').setValue(this.vehicle.accountid);
      this.vehicleForm.get('operator').setValue(this.vehicle.operatorid);
      this.vehicleForm.get('unittype').setValue(this.vehicle.unittypeid);
      this.vehicleForm.get('serviceplan').setValue(this.vehicle.serviceplanid);
      this.vehicleForm.get('producttype').setValue(this.vehicle.producttypeid);
      this.vehicleForm.get('make').setValue(this.vehicle.makeid);
      this.vehicleForm.get('model').setValue(this.vehicle.modelid);
      this.vehicleForm.get('timezone').setValue(this.vehicle.timezoneid);

      let created          = this.vehicle? new Date(`${this.vehicle.created}`) : '';
      let deletedwhen      = this.vehicle? new Date(`${this.vehicle.deletedwhen}`) : '';
      let lastmodifieddate = this.vehicle? new Date(`${this.vehicle.lastmodifieddate}`) : '';

      this.vehicleForm.get('created').setValue(this.dateFormat(created));
      this.vehicleForm.get('createdbyname').setValue(this.vehicle.createdbyname);
      this.vehicleForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.vehicleForm.get('deletedbyname').setValue(this.vehicle.deletedbyname);
      this.vehicleForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.vehicleForm.get('lastmodifiedbyname').setValue(this.vehicle.lastmodifiedbyname);
      this.vehicleForm.get('filterstring').setValue(this.filter_string);
  }

  getValues(dateTime: any, mode: string) {
    this.vehicleDetail.name             = this.vehicleForm.get('name').value || '',
    this.vehicleDetail.companyid        = this.vehicleForm.get('company').value || 0;
    this.vehicleDetail.groupid          = this.vehicleForm.get('group').value || 0;
    this.vehicleDetail.accountid        = this.vehicleForm.get('account').value || 0;
    this.vehicleDetail.operatorid       = this.vehicleForm.get('operator').value || 0;
    this.vehicleDetail.unittypeid       = this.vehicleForm.get('unittype').value || 0;
    this.vehicleDetail.serviceplanid    = this.vehicleForm.get('serviceplan').value || 0;
    this.vehicleDetail.producttypeid    = this.vehicleForm.get('producttype').value || 0;
    this.vehicleDetail.makeid           = this.vehicleForm.get('make').value || 0;
    this.vehicleDetail.modelid          = this.vehicleForm.get('model').value || 0;
    this.vehicleDetail.timezoneid       = this.vehicleForm.get('timezone').value || 0;
 
    this.vehicleDetail.subgroup         = this.vehicle.subgroup || 0;
    this.vehicleDetail.isactive         = this.vehicle.isactive || true;
    this.vehicleDetail.deletedwhen      = this.vehicle.deletedwhen || '';
    this.vehicleDetail.deletedby        = this.vehicle.deletedby || 0;

    if( mode  == "save" ) {
      this.vehicleDetail.id               = this.vehicle.id;
      this.vehicleDetail.created          = this.vehicle.created;
      this.vehicleDetail.createdby        = this.vehicle.createdby;
      this.vehicleDetail.lastmodifieddate = dateTime;
      this.vehicleDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.vehicleDetail.id               = 0;
      this.vehicleDetail.created          = dateTime;
      this.vehicleDetail.createdby        = this.userID;
      this.vehicleDetail.lastmodifieddate = dateTime;
      this.vehicleDetail.lastmodifiedby   = this.userID;
    }
    
  }

  dateFormat(date: any) {
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

  saveVehicle(): void {
    console.log("saveVehicle");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(this.vehicleDetail);

    this.vehicleDetailService.saveVehicleDetail(this.userConncode, this.userID, this.vehicleDetail)
    .subscribe((result: any) => {
      console.log(result);
      if (result.responseCode == 200) {
        alert("Success!");
        this.router.navigate(['admin/vehicles/vehicles']);
      }
    });
  }

  addVehicle(): void {
    console.log("addVehicle");
    let today = new Date().toISOString();
    this.getValues(today, "add");
    console.log(this.vehicleDetail);

    this.vehicleDetailService.saveVehicleDetail(this.userConncode, this.userID, this.vehicleDetail)
    .subscribe((result: any) => {
      console.log(result);
      if (result.responseCode == 200) {
        alert("Success!");
        this.router.navigate(['admin/vehicles/vehicles']);
      }
    });
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       vehicle: "", flag: flag
    };

    dialogConfig.disableClose = false;

    const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
        if ( result )
        { 
            console.log(result);

        } else {
            console.log("FAIL:", result);
        }
    });

  }
  onMakeChange(event: any) {
    console.log(event);
    this.vehicleDetailService.current_makeID = this.vehicleForm.get('make').value;
    this.vehicleModel_flag = true;
    this.dataSourceModel.loadVehicleDetail(this.userConncode, this.userID, 0, 10, "", "model_clist");
    // this.paginatorModel.pageIndex = 0;

  }

  checkMakeIsSelected() {
    alert("Please check first Make is selected!");
  }

   // navigatePageEvent() {
  //   // console.log(this.index_number);
  //   // this.paginator.pageIndex = this.dataSource.page_index - 1;
  //   // this.dataSource.loadCompanies(this.userConncode, 1, this.paginator.pageIndex, this.paginator.pageSize, "company_clist");
  // }
}
