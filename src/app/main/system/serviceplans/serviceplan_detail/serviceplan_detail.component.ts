import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { ServiceplanDetail } from 'app/main/system/serviceplans/model/serviceplan.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import { Subject, merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { ServiceplanDetailService } from 'app/main/system/serviceplans/services/serviceplan_detail.service';
import { ServiceplanDetailDataSource } from "app/main/system/serviceplans/services/serviceplan_detail.datasource";

import { locale as serviceplansEnglish } from 'app/main/system/serviceplans/i18n/en';
import { locale as serviceplansSpanish } from 'app/main/system/serviceplans/i18n/sp';
import { locale as serviceplansFrench } from 'app/main/system/serviceplans/i18n/fr';
import { locale as serviceplansPortuguese } from 'app/main/system/serviceplans/i18n/pt';

@Component({
  selector: 'app-serviceplan-detail',
  templateUrl: './serviceplan_detail.component.html',
  styleUrls: ['./serviceplan_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class ServiceplanDetailComponent implements OnInit
{
  serviceplan_detail: any;
  public serviceplan: any;
  pageType: string;
  userConncode: string;
  userID: number;

  serviceplanModel_flag: boolean;

  serviceplanForm: FormGroup;
  serviceplanDetail: ServiceplanDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: ServiceplanDetailDataSource;

  dataSourceCarrierPlan: ServiceplanDetailDataSource;
 
  filter_string: string = '';
  method_string: string = '';
  
  @ViewChild(MatPaginator, {static: true})
    paginatorCarrierPlan: MatPaginator;

  constructor(
    public serviceplanDetailService: ServiceplanDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(serviceplansEnglish, serviceplansSpanish, serviceplansFrench, serviceplansPortuguese);

    this.serviceplan = localStorage.getItem("serviceplan_detail")? JSON.parse(localStorage.getItem("serviceplan_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.serviceplan != '' )
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
    console.log(this.serviceplan);
  
    this.dataSourceCarrierPlan = new ServiceplanDetailDataSource(this.serviceplanDetailService);
   
    this.dataSourceCarrierPlan.loadServiceplanDetail(this.userConncode, this.userID, 0, 10, '', "carrierplan_clist");
    
    this.serviceplanForm = this._formBuilder.group({
      name               : [null, Validators.required],
      carrierplan        : [null, Validators.required],
      eventtypes         : [null, Validators.required],
      daysinhistory      : [null, Validators.required],
      includeignition    : [null, Validators.required],
      locatecommand      : [null, Validators.required],
      distance           : [null, Validators.required],
      isactive           : [null, Validators.required],
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
    
    merge(this.paginatorCarrierPlan.page)
    .pipe(
      tap(() => {
        this.loadServiceplanDetail("carrierplan")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });
   
  }

  loadServiceplanDetail(method_string: string) {
    if (method_string == 'carrierplan') {
      this.dataSourceCarrierPlan.loadServiceplanDetail(this.userConncode, this.userID, this.paginatorCarrierPlan.pageIndex, this.paginatorCarrierPlan.pageSize, this.filter_string, `${method_string}_clist`)
    }
  }

  managePageIndex(method_string: string) {
    switch(method_string) {
      case 'carrierplan':
        this.paginatorCarrierPlan.pageIndex = 0;
      break;
    }
  }

  showCarrierPlanList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
   
    let selected_element_id = this.serviceplanForm.get(`${this.method_string}`).value;

    console.log(methodString, this.serviceplanDetailService.unit_clist_item[methodString], selected_element_id );

    let clist = this.serviceplanDetailService.unit_clist_item[methodString];

    for (let i = 0; i< clist.length; i++) {
      if ( clist[i].id == selected_element_id ) {
        this.serviceplanForm.get('filterstring').setValue(clist[i].name);
        this.filter_string = clist[i].name;
      }
    }

    this.managePageIndex(this.method_string);
    this.loadServiceplanDetail(this.method_string);
  }
 
  setValues() {
      this.serviceplanForm.get('name').setValue(this.serviceplan.name);
      this.serviceplanForm.get('carrierplan').setValue(this.serviceplan.carrierplanid);
      this.serviceplanForm.get('eventtypes').setValue(this.serviceplan.eventtypes);
      this.serviceplanForm.get('daysinhistory').setValue(this.serviceplan.daysinhistory);
      this.serviceplanForm.get('includeignition').setValue(this.serviceplan.includeignition);
      this.serviceplanForm.get('locatecommand').setValue(this.serviceplan.locatecommand);
      this.serviceplanForm.get('distance').setValue(this.serviceplan.distance);

      let created          = this.serviceplan.created? new Date(`${this.serviceplan.created}`) : '';
      let deletedwhen      = this.serviceplan.deletedwhen? new Date(`${this.serviceplan.deletedwhen}`) : '';
      let lastmodifieddate = this.serviceplan.lastmodifieddate? new Date(`${this.serviceplan.lastmodifieddate}`) : '';

      this.serviceplanForm.get('created').setValue(this.dateFormat(created));
      this.serviceplanForm.get('createdbyname').setValue(this.serviceplan.createdbyname);
      this.serviceplanForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.serviceplanForm.get('deletedbyname').setValue(this.serviceplan.deletedbyname);
      this.serviceplanForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.serviceplanForm.get('lastmodifiedbyname').setValue(this.serviceplan.lastmodifiedbyname);
      this.serviceplanForm.get('filterstring').setValue(this.filter_string);
  }

  getValues(dateTime: any, mode: string) {
    this.serviceplanDetail.name            = this.serviceplanForm.get('name').value || '',
    this.serviceplanDetail.carrierplanid   = this.serviceplanForm.get('carrierplan').value || 0;
    this.serviceplanDetail.eventtypes      = this.serviceplanForm.get('eventtypes').value || 0;
    this.serviceplanDetail.daysinhistory   = this.serviceplanForm.get('daysinhistory').value || 0;
    this.serviceplanDetail.includeignition = this.serviceplanForm.get('includeignition').value || false;
    this.serviceplanDetail.locatecommand   = this.serviceplanForm.get('locatecommand').value || '';
    this.serviceplanDetail.distance        = this.serviceplanForm.get('distance').value || '';
 
    this.serviceplanDetail.isactive        = this.serviceplan.isactive || true;
    this.serviceplanDetail.hastrips        = this.serviceplan.hastrips || 0;
    this.serviceplanDetail.hasdistance     = this.serviceplan.hasdistance || '';
    this.serviceplanDetail.deletedwhen     = this.serviceplan.deletedwhen || '';
    this.serviceplanDetail.deletedby       = this.serviceplan.deletedby || 0;

    if( mode  == "save" ) {
      this.serviceplanDetail.id               = this.serviceplan.id;
      this.serviceplanDetail.created          = this.serviceplan.created;
      this.serviceplanDetail.createdby        = this.serviceplan.createdby;
      this.serviceplanDetail.lastmodifieddate = dateTime;
      this.serviceplanDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.serviceplanDetail.id               = 0;
      this.serviceplanDetail.created          = dateTime;
      this.serviceplanDetail.createdby        = this.userID;
      this.serviceplanDetail.lastmodifieddate = dateTime;
      this.serviceplanDetail.lastmodifiedby   = this.userID;
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

  saveServiceplan(): void {
    console.log("saveServiceplan");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(this.serviceplanDetail);

    this.serviceplanDetailService.saveServiceplanDetail(this.userConncode, this.userID, this.serviceplanDetail)
    .subscribe((result: any) => {
      console.log(result);
      if (result.responseCode == 200) {
        alert("Success!");
        this.router.navigate(['system/serviceplans/serviceplans']);
      }
    });
  }

  addServiceplan(): void {
    console.log("addServiceplan");
    let today = new Date().toISOString();
    this.getValues(today, "add");
    console.log(this.serviceplanDetail);

    this.serviceplanDetailService.saveServiceplanDetail(this.userConncode, this.userID, this.serviceplanDetail)
    .subscribe((result: any) => {
      console.log(result);
      if (result.responseCode == 200) {
        alert("Success!");
        this.router.navigate(['system/serviceplans/serviceplans']);
      }
    });
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       serviceplan: "", flag: flag
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
