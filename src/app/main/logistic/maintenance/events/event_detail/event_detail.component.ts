import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { EventDetail } from 'app/main/logistic/maintenance/events/model/event.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import * as $ from 'jquery';

import { Subject, merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { EventDetailService } from 'app/main/logistic/maintenance/events/services/event_detail.service';
import { EventDetailDataSource } from "app/main/logistic/maintenance//events/services/event_detail.datasource";

import { locale as eventsEnglish } from 'app/main/logistic/maintenance/events/i18n/en';
import { locale as eventsSpanish } from 'app/main/logistic/maintenance/events/i18n/sp';
import { locale as eventsFrench } from 'app/main/logistic/maintenance/events/i18n/fr';
import { locale as eventsPortuguese } from 'app/main/logistic/maintenance/events/i18n/pt';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event_detail.component.html',
  styleUrls: ['./event_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class EventDetailComponent implements OnInit
{
  event_detail: any;
  public event: any;
  pageType: string;
  userConncode: string;
  userID: number;

  eventModel_flag: boolean;

  eventForm: FormGroup;
  eventDetail: EventDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: EventDetailDataSource;

  dataSourceCompany:     EventDetailDataSource;
  dataSourceGroup:       EventDetailDataSource;
  dataSourceTimeZone:    EventDetailDataSource;
  dataSourceLengthUnit:  EventDetailDataSource;
  dataSourceFuelUnit:    EventDetailDataSource;
  dataSourceWeightUnit:  EventDetailDataSource;
  dataSourceTempUnit:    EventDetailDataSource;
  dataSourceLanguage:    EventDetailDataSource;
 
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
    public eventDetailService: EventDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(eventsEnglish, eventsSpanish, eventsFrench, eventsPortuguese);

    this.event = localStorage.getItem("event_detail")? JSON.parse(localStorage.getItem("event_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.event != '' )
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
    console.log(this.event);
  
    this.dataSourceCompany    = new EventDetailDataSource(this.eventDetailService);
    this.dataSourceGroup      = new EventDetailDataSource(this.eventDetailService);
    this.dataSourceTimeZone   = new EventDetailDataSource(this.eventDetailService);
    this.dataSourceLengthUnit = new EventDetailDataSource(this.eventDetailService);
    this.dataSourceFuelUnit   = new EventDetailDataSource(this.eventDetailService);
    this.dataSourceWeightUnit = new EventDetailDataSource(this.eventDetailService);
    this.dataSourceTempUnit   = new EventDetailDataSource(this.eventDetailService);
    this.dataSourceLanguage   = new EventDetailDataSource(this.eventDetailService);

    this.dataSourceCompany   .loadEventDetail(this.userConncode, this.userID, 0, 10, this.event.company, "company_clist");
    this.dataSourceGroup     .loadEventDetail(this.userConncode, this.userID, 0, 10, this.event.group, "group_clist");
    this.dataSourceTimeZone  .loadEventDetail(this.userConncode, this.userID, 0, 10, this.event.timezone, "timezone_clist");
    this.dataSourceLengthUnit.loadEventDetail(this.userConncode, this.userID, 0, 10, '', "lengthunit_clist");
    this.dataSourceFuelUnit  .loadEventDetail(this.userConncode, this.userID, 0, 10, '', "fuelunit_clist");
    this.dataSourceWeightUnit.loadEventDetail(this.userConncode, this.userID, 0, 10, '', "weightunit_clist");
    this.dataSourceTempUnit  .loadEventDetail(this.userConncode, this.userID, 0, 10, '', "tempunit_clist");
    this.dataSourceLanguage  .loadEventDetail(this.userConncode, this.userID, 0, 10, '', "language_clist");

    this.eventForm = this._formBuilder.group({
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
        this.loadEventDetail("company")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorGroup.page)
    .pipe(
      tap(() => {
        this.loadEventDetail("group")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorLengthUnit.page)
    .pipe(
      tap(() => {
        this.loadEventDetail("lengthunit")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorFuelUnit.page)
    .pipe(
      tap(() => {
        this.loadEventDetail("fuelunit")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorWeightUnit.page)
    .pipe(
      tap(() => {
        this.loadEventDetail("weightunit")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorTempUnit.page)
    .pipe(
      tap(() => {
        this.loadEventDetail("tempunit")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorLanguage.page)
    .pipe(
      tap(() => {
        this.loadEventDetail("language")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorTimeZone.page)
    .pipe(
      tap(() => {
        this.loadEventDetail("timezone")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });
  }

  loadEventDetail(method_string: string) {
    if (method_string == 'company') {
      this.dataSourceCompany.loadEventDetail(this.userConncode, this.userID, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'group') {
        this.dataSourceGroup.loadEventDetail(this.userConncode, this.userID, this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'lengthunit') {
        this.dataSourceLengthUnit.loadEventDetail(this.userConncode, this.userID, this.paginatorLengthUnit.pageIndex, this.paginatorLengthUnit.pageSize, '', `${method_string}_clist`)
    } else if (method_string == 'fuelunit') {
        this.dataSourceFuelUnit.loadEventDetail(this.userConncode, this.userID, this.paginatorFuelUnit.pageIndex, this.paginatorFuelUnit.pageSize, '', `${method_string}_clist`)
    } else if (method_string == 'weightunit') {
        this.dataSourceWeightUnit.loadEventDetail(this.userConncode, this.userID, this.paginatorWeightUnit.pageIndex, this.paginatorWeightUnit.pageSize, '', `${method_string}_clist`)
    } else if (method_string == 'tempunit') {
        this.dataSourceTempUnit.loadEventDetail(this.userConncode, this.userID, this.paginatorTempUnit.pageIndex, this.paginatorTempUnit.pageSize, '', `${method_string}_clist`)
    } else if (method_string == 'language') {
        this.dataSourceLanguage.loadEventDetail(this.userConncode, this.userID, this.paginatorLanguage.pageIndex, this.paginatorLanguage.pageSize, '', `${method_string}_clist`)
    } else if (method_string == 'timezone') {
        this.dataSourceTimeZone.loadEventDetail(this.userConncode, this.userID, this.paginatorTimeZone.pageIndex, this.paginatorTimeZone.pageSize, this.filter_string, `${method_string}_clist`)
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
   
    let selected_element_id = this.eventForm.get(`${this.method_string}`).value;

    console.log(methodString, this.eventDetailService.unit_clist_item[methodString], selected_element_id );

    let clist = this.eventDetailService.unit_clist_item[methodString];

    for (let i = 0; i< clist.length; i++) {
      if ( clist[i].id == selected_element_id ) {
        this.eventForm.get('filterstring').setValue(clist[i].name);
        this.filter_string = clist[i].name;
      }
     
      this.managePageIndex(this.method_string);
      this.loadEventDetail(this.method_string);
    }
  }

  clearFilter() {
    console.log(this.filter_string);
    this.filter_string = '';
    this.eventForm.get('filterstring').setValue(this.filter_string);
   
    this.managePageIndex(this.method_string);
    this.loadEventDetail(this.method_string);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
     
      this.managePageIndex(this.method_string);
      this.loadEventDetail(this.method_string);
    }

    console.log(this.filter_string);
  }

  setValues() {
      this.eventForm.get('name').setValue(this.event.name);
      this.eventForm.get('company').setValue(this.event.companyid);
      this.eventForm.get('group').setValue(this.event.groupid);
      this.eventForm.get('email').setValue(this.event.email);
      this.eventForm.get('password').setValue(this.event.password);
      this.eventForm.get('lengthunit').setValue(this.event.lengthunitid);
      this.eventForm.get('fuelunit').setValue(this.event.fuelunitid);
      this.eventForm.get('weightunit').setValue(this.event.weightunitid);
      this.eventForm.get('tempunit').setValue(this.event.tempunitid);
      this.eventForm.get('language').setValue(this.event.languageid);
      this.eventForm.get('timezone').setValue(this.event.timezoneid);

      let created          = this.event.created? new Date(`${this.event.created}`) : '';
      let deletedwhen      = this.event.deletedwhen? new Date(`${this.event.deletedwhen}`) : '';
      let lastmodifieddate = this.event.lastmodifieddate? new Date(`${this.event.lastmodifieddate}`) : '';

      this.eventForm.get('created').setValue(this.dateFormat(created));
      this.eventForm.get('createdbyname').setValue(this.event.createdbyname);
      this.eventForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.eventForm.get('deletedbyname').setValue(this.event.deletedbyname);
      this.eventForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.eventForm.get('lastmodifiedbyname').setValue(this.event.lastmodifiedbyname);
      this.eventForm.get('filterstring').setValue(this.filter_string);
  }

  getValues(dateTime: any, mode: string) {
    this.eventDetail.name          = this.eventForm.get('name').value || '',
    this.eventDetail.email         = this.eventForm.get('email').value || '';
    this.eventDetail.password      = this.eventForm.get('password').value || '';
    this.eventDetail.timezoneid    = this.eventForm.get('timezone').value || 0;
    this.eventDetail.lengthunitid  = this.eventForm.get('lengthunit').value || 0;
    this.eventDetail.fuelunitid    = this.eventForm.get('fuelunit').value || 0;
    this.eventDetail.weightunitid  = this.eventForm.get('weightunit').value || 0;
    this.eventDetail.tempunitid    = this.eventForm.get('tempunit').value || 0;
    this.eventDetail.companyid     = this.eventForm.get('company').value || 0;
    this.eventDetail.groupid       = this.eventForm.get('group').value || 0;
    this.eventDetail.languageid    = this.eventForm.get('language').value || 0;
 
    this.eventDetail.eventprofileid = this.event.eventprofileid || 0;
    this.eventDetail.subgroup      = this.event.subgroup || 0;
    this.eventDetail.isactive      = this.event.isactive || true;
    this.eventDetail.deletedwhen   = this.event.deletedwhen || '';
    this.eventDetail.deletedby     = this.event.deletedby || 0;

    if( mode  == "save" ) {
      this.eventDetail.id               = this.event.id;
      this.eventDetail.created          = this.event.created;
      this.eventDetail.createdby        = this.event.createdby;
      this.eventDetail.lastmodifieddate = dateTime;
      this.eventDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.eventDetail.id               = 0;
      this.eventDetail.created          = dateTime;
      this.eventDetail.createdby        = this.userID;
      this.eventDetail.lastmodifieddate = dateTime;
      this.eventDetail.lastmodifiedby   = this.userID;
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

  saveEvent(): void {
    console.log("saveEvent");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(this.eventDetail);

    if (this.eventDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.eventDetailService.saveEventDetail(this.userConncode, this.userID, this.eventDetail)
      .subscribe((result: any) => {
        console.log(result);
        if (result.responseCode == 100) {
          alert("Success!");
          this.router.navigate(['admin/events/events']);
        }
      });
    }
  }

  addEvent(): void {
    console.log("addEvent");
    let today = new Date().toISOString();
    this.getValues(today, "add");
    console.log(this.eventDetail);

    if (this.eventDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.eventDetailService.saveEventDetail(this.userConncode, this.userID, this.eventDetail)
      .subscribe((result: any) => {
        console.log(result);
        if (result.responseCode == 100) {
          alert("Success!");
          this.router.navigate(['admin/events/events']);
        }
      });
    }
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       event: "", flag: flag
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
