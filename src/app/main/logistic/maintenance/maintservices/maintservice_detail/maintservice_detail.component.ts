import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { MaintserviceDetail } from 'app/main/logistic/maintenance/maintservices/model/maintservice.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import * as $ from 'jquery';

import { Subject, merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { MaintserviceDetailService } from 'app/main/logistic/maintenance/maintservices/services/maintservice_detail.service';
import { MaintserviceDetailDataSource } from "app/main/logistic/maintenance//maintservices/services/maintservice_detail.datasource";

import { locale as maintservicesEnglish } from 'app/main/logistic/maintenance/maintservices/i18n/en';
import { locale as maintservicesSpanish } from 'app/main/logistic/maintenance/maintservices/i18n/sp';
import { locale as maintservicesFrench } from 'app/main/logistic/maintenance/maintservices/i18n/fr';
import { locale as maintservicesPortuguese } from 'app/main/logistic/maintenance/maintservices/i18n/pt';

@Component({
  selector: 'app-maintservice-detail',
  templateUrl: './maintservice_detail.component.html',
  styleUrls: ['./maintservice_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class MaintserviceDetailComponent implements OnInit
{
  maintservice_detail: any;
  public maintservice: any;
  pageType: string;
  userConncode: string;
  userID: number;

  maintserviceModel_flag: boolean;

  maintserviceForm: FormGroup;
  maintserviceDetail: MaintserviceDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: MaintserviceDetailDataSource;

  dataSourceCompany:     MaintserviceDetailDataSource;
  dataSourceGroup:       MaintserviceDetailDataSource;
  dataSourceTimeZone:    MaintserviceDetailDataSource;
  dataSourceLengthUnit:  MaintserviceDetailDataSource;
  dataSourceFuelUnit:    MaintserviceDetailDataSource;
  dataSourceWeightUnit:  MaintserviceDetailDataSource;
  dataSourceTempUnit:    MaintserviceDetailDataSource;
  dataSourceLanguage:    MaintserviceDetailDataSource;
 
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
    public maintserviceDetailService: MaintserviceDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(maintservicesEnglish, maintservicesSpanish, maintservicesFrench, maintservicesPortuguese);

    this.maintservice = localStorage.getItem("maintservice_detail")? JSON.parse(localStorage.getItem("maintservice_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.maintservice != '' )
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
    console.log(this.maintservice);
  
    this.dataSourceCompany    = new MaintserviceDetailDataSource(this.maintserviceDetailService);
    this.dataSourceGroup      = new MaintserviceDetailDataSource(this.maintserviceDetailService);
    this.dataSourceTimeZone   = new MaintserviceDetailDataSource(this.maintserviceDetailService);
    this.dataSourceLengthUnit = new MaintserviceDetailDataSource(this.maintserviceDetailService);
    this.dataSourceFuelUnit   = new MaintserviceDetailDataSource(this.maintserviceDetailService);
    this.dataSourceWeightUnit = new MaintserviceDetailDataSource(this.maintserviceDetailService);
    this.dataSourceTempUnit   = new MaintserviceDetailDataSource(this.maintserviceDetailService);
    this.dataSourceLanguage   = new MaintserviceDetailDataSource(this.maintserviceDetailService);

    this.dataSourceCompany   .loadMaintserviceDetail(this.userConncode, this.userID, 0, 10, this.maintservice.company, "company_clist");
    this.dataSourceGroup     .loadMaintserviceDetail(this.userConncode, this.userID, 0, 10, this.maintservice.group, "group_clist");
    this.dataSourceTimeZone  .loadMaintserviceDetail(this.userConncode, this.userID, 0, 10, this.maintservice.timezone, "timezone_clist");
    this.dataSourceLengthUnit.loadMaintserviceDetail(this.userConncode, this.userID, 0, 10, '', "lengthunit_clist");
    this.dataSourceFuelUnit  .loadMaintserviceDetail(this.userConncode, this.userID, 0, 10, '', "fuelunit_clist");
    this.dataSourceWeightUnit.loadMaintserviceDetail(this.userConncode, this.userID, 0, 10, '', "weightunit_clist");
    this.dataSourceTempUnit  .loadMaintserviceDetail(this.userConncode, this.userID, 0, 10, '', "tempunit_clist");
    this.dataSourceLanguage  .loadMaintserviceDetail(this.userConncode, this.userID, 0, 10, '', "language_clist");

    this.maintserviceForm = this._formBuilder.group({
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
        this.loadMaintserviceDetail("company")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorGroup.page)
    .pipe(
      tap(() => {
        this.loadMaintserviceDetail("group")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorLengthUnit.page)
    .pipe(
      tap(() => {
        this.loadMaintserviceDetail("lengthunit")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorFuelUnit.page)
    .pipe(
      tap(() => {
        this.loadMaintserviceDetail("fuelunit")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorWeightUnit.page)
    .pipe(
      tap(() => {
        this.loadMaintserviceDetail("weightunit")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorTempUnit.page)
    .pipe(
      tap(() => {
        this.loadMaintserviceDetail("tempunit")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorLanguage.page)
    .pipe(
      tap(() => {
        this.loadMaintserviceDetail("language")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorTimeZone.page)
    .pipe(
      tap(() => {
        this.loadMaintserviceDetail("timezone")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });
  }

  loadMaintserviceDetail(method_string: string) {
    if (method_string == 'company') {
      this.dataSourceCompany.loadMaintserviceDetail(this.userConncode, this.userID, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'group') {
        this.dataSourceGroup.loadMaintserviceDetail(this.userConncode, this.userID, this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'lengthunit') {
        this.dataSourceLengthUnit.loadMaintserviceDetail(this.userConncode, this.userID, this.paginatorLengthUnit.pageIndex, this.paginatorLengthUnit.pageSize, '', `${method_string}_clist`)
    } else if (method_string == 'fuelunit') {
        this.dataSourceFuelUnit.loadMaintserviceDetail(this.userConncode, this.userID, this.paginatorFuelUnit.pageIndex, this.paginatorFuelUnit.pageSize, '', `${method_string}_clist`)
    } else if (method_string == 'weightunit') {
        this.dataSourceWeightUnit.loadMaintserviceDetail(this.userConncode, this.userID, this.paginatorWeightUnit.pageIndex, this.paginatorWeightUnit.pageSize, '', `${method_string}_clist`)
    } else if (method_string == 'tempunit') {
        this.dataSourceTempUnit.loadMaintserviceDetail(this.userConncode, this.userID, this.paginatorTempUnit.pageIndex, this.paginatorTempUnit.pageSize, '', `${method_string}_clist`)
    } else if (method_string == 'language') {
        this.dataSourceLanguage.loadMaintserviceDetail(this.userConncode, this.userID, this.paginatorLanguage.pageIndex, this.paginatorLanguage.pageSize, '', `${method_string}_clist`)
    } else if (method_string == 'timezone') {
        this.dataSourceTimeZone.loadMaintserviceDetail(this.userConncode, this.userID, this.paginatorTimeZone.pageIndex, this.paginatorTimeZone.pageSize, this.filter_string, `${method_string}_clist`)
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
   
    let selected_element_id = this.maintserviceForm.get(`${this.method_string}`).value;

    console.log(methodString, this.maintserviceDetailService.unit_clist_item[methodString], selected_element_id );

    let clist = this.maintserviceDetailService.unit_clist_item[methodString];

    for (let i = 0; i< clist.length; i++) {
      if ( clist[i].id == selected_element_id ) {
        this.maintserviceForm.get('filterstring').setValue(clist[i].name);
        this.filter_string = clist[i].name;
      }
     
      this.managePageIndex(this.method_string);
      this.loadMaintserviceDetail(this.method_string);
    }
  }

  clearFilter() {
    console.log(this.filter_string);
    this.filter_string = '';
    this.maintserviceForm.get('filterstring').setValue(this.filter_string);
   
    this.managePageIndex(this.method_string);
    this.loadMaintserviceDetail(this.method_string);
  }

  onKey(maintservice: any) {
    this.filter_string = maintservice.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
     
      this.managePageIndex(this.method_string);
      this.loadMaintserviceDetail(this.method_string);
    }

    console.log(this.filter_string);
  }

  setValues() {
      this.maintserviceForm.get('name').setValue(this.maintservice.name);
      this.maintserviceForm.get('company').setValue(this.maintservice.companyid);
      this.maintserviceForm.get('group').setValue(this.maintservice.groupid);
      this.maintserviceForm.get('email').setValue(this.maintservice.email);
      this.maintserviceForm.get('password').setValue(this.maintservice.password);
      this.maintserviceForm.get('lengthunit').setValue(this.maintservice.lengthunitid);
      this.maintserviceForm.get('fuelunit').setValue(this.maintservice.fuelunitid);
      this.maintserviceForm.get('weightunit').setValue(this.maintservice.weightunitid);
      this.maintserviceForm.get('tempunit').setValue(this.maintservice.tempunitid);
      this.maintserviceForm.get('language').setValue(this.maintservice.languageid);
      this.maintserviceForm.get('timezone').setValue(this.maintservice.timezoneid);

      let created          = this.maintservice.created? new Date(`${this.maintservice.created}`) : '';
      let deletedwhen      = this.maintservice.deletedwhen? new Date(`${this.maintservice.deletedwhen}`) : '';
      let lastmodifieddate = this.maintservice.lastmodifieddate? new Date(`${this.maintservice.lastmodifieddate}`) : '';

      this.maintserviceForm.get('created').setValue(this.dateFormat(created));
      this.maintserviceForm.get('createdbyname').setValue(this.maintservice.createdbyname);
      this.maintserviceForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.maintserviceForm.get('deletedbyname').setValue(this.maintservice.deletedbyname);
      this.maintserviceForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.maintserviceForm.get('lastmodifiedbyname').setValue(this.maintservice.lastmodifiedbyname);
      this.maintserviceForm.get('filterstring').setValue(this.filter_string);
  }

  getValues(dateTime: any, mode: string) {
    this.maintserviceDetail.name          = this.maintserviceForm.get('name').value || '',
    this.maintserviceDetail.email         = this.maintserviceForm.get('email').value || '';
    this.maintserviceDetail.password      = this.maintserviceForm.get('password').value || '';
    this.maintserviceDetail.timezoneid    = this.maintserviceForm.get('timezone').value || 0;
    this.maintserviceDetail.lengthunitid  = this.maintserviceForm.get('lengthunit').value || 0;
    this.maintserviceDetail.fuelunitid    = this.maintserviceForm.get('fuelunit').value || 0;
    this.maintserviceDetail.weightunitid  = this.maintserviceForm.get('weightunit').value || 0;
    this.maintserviceDetail.tempunitid    = this.maintserviceForm.get('tempunit').value || 0;
    this.maintserviceDetail.companyid     = this.maintserviceForm.get('company').value || 0;
    this.maintserviceDetail.groupid       = this.maintserviceForm.get('group').value || 0;
    this.maintserviceDetail.languageid    = this.maintserviceForm.get('language').value || 0;
 
    this.maintserviceDetail.maintserviceprofileid = this.maintservice.maintserviceprofileid || 0;
    this.maintserviceDetail.subgroup      = this.maintservice.subgroup || 0;
    this.maintserviceDetail.isactive      = this.maintservice.isactive || true;
    this.maintserviceDetail.deletedwhen   = this.maintservice.deletedwhen || '';
    this.maintserviceDetail.deletedby     = this.maintservice.deletedby || 0;

    if( mode  == "save" ) {
      this.maintserviceDetail.id               = this.maintservice.id;
      this.maintserviceDetail.created          = this.maintservice.created;
      this.maintserviceDetail.createdby        = this.maintservice.createdby;
      this.maintserviceDetail.lastmodifieddate = dateTime;
      this.maintserviceDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.maintserviceDetail.id               = 0;
      this.maintserviceDetail.created          = dateTime;
      this.maintserviceDetail.createdby        = this.userID;
      this.maintserviceDetail.lastmodifieddate = dateTime;
      this.maintserviceDetail.lastmodifiedby   = this.userID;
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

  saveMaintservice(): void {
    console.log("saveMaintservice");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(this.maintserviceDetail);

    if (this.maintserviceDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.maintserviceDetailService.saveMaintserviceDetail(this.userConncode, this.userID, this.maintserviceDetail)
      .subscribe((result: any) => {
        console.log(result);
        if (result.responseCode == 100) {
          alert("Success!");
          this.router.navigate(['admin/maintservices/maintservices']);
        }
      });
    }
  }

  addMaintservice(): void {
    console.log("addMaintservice");
    let today = new Date().toISOString();
    this.getValues(today, "add");
    console.log(this.maintserviceDetail);

    if (this.maintserviceDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.maintserviceDetailService.saveMaintserviceDetail(this.userConncode, this.userID, this.maintserviceDetail)
      .subscribe((result: any) => {
        console.log(result);
        if (result.responseCode == 100) {
          alert("Success!");
          this.router.navigate(['admin/maintservices/maintservices']);
        }
      });
    }
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       maintservice: "", flag: flag
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
