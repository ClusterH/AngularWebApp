import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { ServiceitemDetail } from 'app/main/logistic/maintenance/serviceitems/model/serviceitem.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import * as $ from 'jquery';

import { Subject, merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { ServiceitemDetailService } from 'app/main/logistic/maintenance/serviceitems/services/serviceitem_detail.service';
import { ServiceitemDetailDataSource } from "app/main/logistic/maintenance//serviceitems/services/serviceitem_detail.datasource";

import { locale as serviceitemsEnglish } from 'app/main/logistic/maintenance/serviceitems/i18n/en';
import { locale as serviceitemsSpanish } from 'app/main/logistic/maintenance/serviceitems/i18n/sp';
import { locale as serviceitemsFrench } from 'app/main/logistic/maintenance/serviceitems/i18n/fr';
import { locale as serviceitemsPortuguese } from 'app/main/logistic/maintenance/serviceitems/i18n/pt';

@Component({
  selector: 'app-serviceitem-detail',
  templateUrl: './serviceitem_detail.component.html',
  styleUrls: ['./serviceitem_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class ServiceitemDetailComponent implements OnInit
{
  serviceitem_detail: any;
  public serviceitem: any;
  pageType: string;
  userConncode: string;
  userID: number;

  serviceitemModel_flag: boolean;

  serviceitemForm: FormGroup;
  serviceitemDetail: ServiceitemDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: ServiceitemDetailDataSource;

  dataSourceCompany:     ServiceitemDetailDataSource;
  dataSourceGroup:       ServiceitemDetailDataSource;
  dataSourceTimeZone:    ServiceitemDetailDataSource;
  dataSourceLengthUnit:  ServiceitemDetailDataSource;
  dataSourceFuelUnit:    ServiceitemDetailDataSource;
  dataSourceWeightUnit:  ServiceitemDetailDataSource;
  dataSourceTempUnit:    ServiceitemDetailDataSource;
  dataSourceLanguage:    ServiceitemDetailDataSource;
 
  filter_string: string = '';
  method_string: string = '';
  
  @ViewChild(MatPaginator, {static: true})
    paginatorCompany: MatPaginator;
  @ViewChild('paginatorGroup', {read: MatPaginator, static: true})
    paginatorGroup: MatPaginator;
  @ViewChild('paginatorTimeZone', {read: MatPaginator, static: true})
    paginatorTimeZone: MatPaginator;
  @ViewChild('paginatorLengthUnit', {read: MatPaginator, static: true})
    paginatorLengthUnit: MatPaginator;
  @ViewChild('paginatorFuelUnit', {read: MatPaginator, static: true})
    paginatorFuelUnit: MatPaginator;
  @ViewChild('paginatorWeightUnit', {read: MatPaginator, static: true})
    paginatorWeightUnit: MatPaginator;
    @ViewChild('paginatorTempUnit', {read: MatPaginator, static: true})
    paginatorTempUnit: MatPaginator;
  @ViewChild('paginatorLanguage', {read: MatPaginator, static: true})
    paginatorLanguage: MatPaginator;
 
  constructor(
    public serviceitemDetailService: ServiceitemDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(serviceitemsEnglish, serviceitemsSpanish, serviceitemsFrench, serviceitemsPortuguese);

    this.serviceitem = localStorage.getItem("serviceitem_detail")? JSON.parse(localStorage.getItem("serviceitem_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.serviceitem != '' )
    {
      this.pageType = 'edit';
    }
    else
    {
      this.pageType = 'new';
    }

    this.filter_string = '';
  }

  ngOnInit(): void {
    console.log(this.serviceitem);
  
    this.dataSourceCompany    = new ServiceitemDetailDataSource(this.serviceitemDetailService);
    this.dataSourceGroup      = new ServiceitemDetailDataSource(this.serviceitemDetailService);
    this.dataSourceTimeZone   = new ServiceitemDetailDataSource(this.serviceitemDetailService);
    this.dataSourceLengthUnit = new ServiceitemDetailDataSource(this.serviceitemDetailService);
    this.dataSourceFuelUnit   = new ServiceitemDetailDataSource(this.serviceitemDetailService);
    this.dataSourceWeightUnit = new ServiceitemDetailDataSource(this.serviceitemDetailService);
    this.dataSourceTempUnit   = new ServiceitemDetailDataSource(this.serviceitemDetailService);
    this.dataSourceLanguage   = new ServiceitemDetailDataSource(this.serviceitemDetailService);

    this.dataSourceCompany   .loadServiceitemDetail(this.userConncode, this.userID, 0, 10, this.serviceitem.company, "company_clist");
    this.dataSourceGroup     .loadServiceitemDetail(this.userConncode, this.userID, 0, 10, this.serviceitem.group, "group_clist");
    this.dataSourceTimeZone  .loadServiceitemDetail(this.userConncode, this.userID, 0, 10, this.serviceitem.timezone, "timezone_clist");
    this.dataSourceLengthUnit.loadServiceitemDetail(this.userConncode, this.userID, 0, 10, '', "lengthunit_clist");
    this.dataSourceFuelUnit  .loadServiceitemDetail(this.userConncode, this.userID, 0, 10, '', "fuelunit_clist");
    this.dataSourceWeightUnit.loadServiceitemDetail(this.userConncode, this.userID, 0, 10, '', "weightunit_clist");
    this.dataSourceTempUnit  .loadServiceitemDetail(this.userConncode, this.userID, 0, 10, '', "tempunit_clist");
    this.dataSourceLanguage  .loadServiceitemDetail(this.userConncode, this.userID, 0, 10, '', "language_clist");

    this.serviceitemForm = this._formBuilder.group({
      name               : [null, Validators.required],
      email              : [null, Validators.required],
      password           : [null, Validators.required],
      timezone           : [null, Validators.required],
      lengthunit         : [null, Validators.required],
      fuelunit           : [null, Validators.required],
      weightunit         : [null, Validators.required],
      tempunit           : [null, Validators.required],
      isactive           : [null, Validators.required],
      company            : [null, Validators.required],
      group              : [null, Validators.required],
      subgroup           : [null, Validators.required],
      created            : [{value: '', disabled: true}, Validators.required],
      createdbyname      : [{value: '', disabled: true}, Validators.required],
      deletedwhen        : [{value: '', disabled: true}, Validators.required],
      deletedbyname      : [{value: '', disabled: true}, Validators.required],
      lastmodifieddate   : [{value: '', disabled: true}, Validators.required],
      lastmodifiedbyname : [{value: '', disabled: true}, Validators.required],
      language           : [null, Validators.required],
      filterstring       : [null, Validators.required],
  });

  this.setValues();
}

  ngAfterViewInit() {
    console.log("ngAfterViewInit:");
    
    merge(this.paginatorCompany.page)
    .pipe(
      tap(() => {
        this.loadServiceitemDetail("company")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorGroup.page)
    .pipe(
      tap(() => {
        this.loadServiceitemDetail("group")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorLengthUnit.page)
    .pipe(
      tap(() => {
        this.loadServiceitemDetail("lengthunit")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorFuelUnit.page)
    .pipe(
      tap(() => {
        this.loadServiceitemDetail("fuelunit")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorWeightUnit.page)
    .pipe(
      tap(() => {
        this.loadServiceitemDetail("weightunit")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorTempUnit.page)
    .pipe(
      tap(() => {
        this.loadServiceitemDetail("tempunit")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorLanguage.page)
    .pipe(
      tap(() => {
        this.loadServiceitemDetail("language")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorTimeZone.page)
    .pipe(
      tap(() => {
        this.loadServiceitemDetail("timezone")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });
  }

  loadServiceitemDetail(method_string: string) {
    if (method_string == 'company') {
      this.dataSourceCompany.loadServiceitemDetail(this.userConncode, this.userID, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'group') {
        this.dataSourceGroup.loadServiceitemDetail(this.userConncode, this.userID, this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'lengthunit') {
        this.dataSourceLengthUnit.loadServiceitemDetail(this.userConncode, this.userID, this.paginatorLengthUnit.pageIndex, this.paginatorLengthUnit.pageSize, '', `${method_string}_clist`)
    } else if (method_string == 'fuelunit') {
        this.dataSourceFuelUnit.loadServiceitemDetail(this.userConncode, this.userID, this.paginatorFuelUnit.pageIndex, this.paginatorFuelUnit.pageSize, '', `${method_string}_clist`)
    } else if (method_string == 'weightunit') {
        this.dataSourceWeightUnit.loadServiceitemDetail(this.userConncode, this.userID, this.paginatorWeightUnit.pageIndex, this.paginatorWeightUnit.pageSize, '', `${method_string}_clist`)
    } else if (method_string == 'tempunit') {
        this.dataSourceTempUnit.loadServiceitemDetail(this.userConncode, this.userID, this.paginatorTempUnit.pageIndex, this.paginatorTempUnit.pageSize, '', `${method_string}_clist`)
    } else if (method_string == 'language') {
        this.dataSourceLanguage.loadServiceitemDetail(this.userConncode, this.userID, this.paginatorLanguage.pageIndex, this.paginatorLanguage.pageSize, '', `${method_string}_clist`)
    } else if (method_string == 'timezone') {
        this.dataSourceTimeZone.loadServiceitemDetail(this.userConncode, this.userID, this.paginatorTimeZone.pageIndex, this.paginatorTimeZone.pageSize, this.filter_string, `${method_string}_clist`)
    }
  }

  managePageIndex(method_string: string) {
    switch(method_string) {
      case 'company':
        this.paginatorCompany.pageIndex = 0;
      break;
     
      case 'group':
        this.paginatorGroup.pageIndex = 0;
      break;

      case 'lengthunit':
        this.paginatorLengthUnit.pageIndex = 0;
      break;

      case 'fuelunit':
        this.paginatorFuelUnit.pageIndex = 0;
      break;

      case 'weightunit':
        this.paginatorWeightUnit.pageIndex = 0;
      break;

      case 'tempunit':
        this.paginatorTempUnit.pageIndex = 0;
      break;

      case 'language':
        this.paginatorLanguage.pageIndex = 0;
      break;

      case 'timezone':
        this.paginatorTimeZone.pageIndex = 0;
      break;
    }
  }

  showCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
   
    let selected_element_id = this.serviceitemForm.get(`${this.method_string}`).value;

    console.log(methodString, this.serviceitemDetailService.unit_clist_item[methodString], selected_element_id );

    let clist = this.serviceitemDetailService.unit_clist_item[methodString];

    for (let i = 0; i< clist.length; i++) {
      if ( clist[i].id == selected_element_id ) {
        this.serviceitemForm.get('filterstring').setValue(clist[i].name);
        this.filter_string = clist[i].name;
      }
     
      this.managePageIndex(this.method_string);
      this.loadServiceitemDetail(this.method_string);
    }
  }

  clearFilter() {
    console.log(this.filter_string);
    this.filter_string = '';
    this.serviceitemForm.get('filterstring').setValue(this.filter_string);
   
    this.managePageIndex(this.method_string);
    this.loadServiceitemDetail(this.method_string);
  }

  onKey(serviceitem: any) {
    this.filter_string = serviceitem.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
     
      this.managePageIndex(this.method_string);
      this.loadServiceitemDetail(this.method_string);
    }

    console.log(this.filter_string);
  }

  setValues() {
      this.serviceitemForm.get('name').setValue(this.serviceitem.name);
      this.serviceitemForm.get('company').setValue(this.serviceitem.companyid);
      this.serviceitemForm.get('group').setValue(this.serviceitem.groupid);
      this.serviceitemForm.get('email').setValue(this.serviceitem.email);
      this.serviceitemForm.get('password').setValue(this.serviceitem.password);
      this.serviceitemForm.get('lengthunit').setValue(this.serviceitem.lengthunitid);
      this.serviceitemForm.get('fuelunit').setValue(this.serviceitem.fuelunitid);
      this.serviceitemForm.get('weightunit').setValue(this.serviceitem.weightunitid);
      this.serviceitemForm.get('tempunit').setValue(this.serviceitem.tempunitid);
      this.serviceitemForm.get('language').setValue(this.serviceitem.languageid);
      this.serviceitemForm.get('timezone').setValue(this.serviceitem.timezoneid);

      let created          = this.serviceitem.created? new Date(`${this.serviceitem.created}`) : '';
      let deletedwhen      = this.serviceitem.deletedwhen? new Date(`${this.serviceitem.deletedwhen}`) : '';
      let lastmodifieddate = this.serviceitem.lastmodifieddate? new Date(`${this.serviceitem.lastmodifieddate}`) : '';

      this.serviceitemForm.get('created').setValue(this.dateFormat(created));
      this.serviceitemForm.get('createdbyname').setValue(this.serviceitem.createdbyname);
      this.serviceitemForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.serviceitemForm.get('deletedbyname').setValue(this.serviceitem.deletedbyname);
      this.serviceitemForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.serviceitemForm.get('lastmodifiedbyname').setValue(this.serviceitem.lastmodifiedbyname);
      this.serviceitemForm.get('filterstring').setValue(this.filter_string);
  }

  getValues(dateTime: any, mode: string) {
    this.serviceitemDetail.name          = this.serviceitemForm.get('name').value || '',
    this.serviceitemDetail.email         = this.serviceitemForm.get('email').value || '';
    this.serviceitemDetail.password      = this.serviceitemForm.get('password').value || '';
    this.serviceitemDetail.timezoneid    = this.serviceitemForm.get('timezone').value || 0;
    this.serviceitemDetail.lengthunitid  = this.serviceitemForm.get('lengthunit').value || 0;
    this.serviceitemDetail.fuelunitid    = this.serviceitemForm.get('fuelunit').value || 0;
    this.serviceitemDetail.weightunitid  = this.serviceitemForm.get('weightunit').value || 0;
    this.serviceitemDetail.tempunitid    = this.serviceitemForm.get('tempunit').value || 0;
    this.serviceitemDetail.companyid     = this.serviceitemForm.get('company').value || 0;
    this.serviceitemDetail.groupid       = this.serviceitemForm.get('group').value || 0;
    this.serviceitemDetail.languageid    = this.serviceitemForm.get('language').value || 0;
 
    this.serviceitemDetail.serviceitemprofileid = this.serviceitem.serviceitemprofileid || 0;
    this.serviceitemDetail.subgroup      = this.serviceitem.subgroup || 0;
    this.serviceitemDetail.isactive      = this.serviceitem.isactive || true;
    this.serviceitemDetail.deletedwhen   = this.serviceitem.deletedwhen || '';
    this.serviceitemDetail.deletedby     = this.serviceitem.deletedby || 0;

    if( mode  == "save" ) {
      this.serviceitemDetail.id               = this.serviceitem.id;
      this.serviceitemDetail.created          = this.serviceitem.created;
      this.serviceitemDetail.createdby        = this.serviceitem.createdby;
      this.serviceitemDetail.lastmodifieddate = dateTime;
      this.serviceitemDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.serviceitemDetail.id               = 0;
      this.serviceitemDetail.created          = dateTime;
      this.serviceitemDetail.createdby        = this.userID;
      this.serviceitemDetail.lastmodifieddate = dateTime;
      this.serviceitemDetail.lastmodifiedby   = this.userID;
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

  saveServiceitem(): void {
    console.log("saveServiceitem");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(this.serviceitemDetail);

    if (this.serviceitemDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.serviceitemDetailService.saveServiceitemDetail(this.userConncode, this.userID, this.serviceitemDetail)
      .subscribe((result: any) => {
        console.log(result);
        if (result.responseCode == 100) {
          alert("Success!");
          this.router.navigate(['admin/serviceitems/serviceitems']);
        }
      });
    }
  }

  addServiceitem(): void {
    console.log("addServiceitem");
    let today = new Date().toISOString();
    this.getValues(today, "add");
    console.log(this.serviceitemDetail);

    if (this.serviceitemDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.serviceitemDetailService.saveServiceitemDetail(this.userConncode, this.userID, this.serviceitemDetail)
      .subscribe((result: any) => {
        console.log(result);
        if (result.responseCode == 100) {
          alert("Success!");
          this.router.navigate(['admin/serviceitems/serviceitems']);
        }
      });
    }
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       serviceitem: "", flag: flag
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
}
