import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { DeviceDetail } from 'app/main/system/devices/model/device.model';
import { CourseDialogComponent } from "../dialog/dialog.component";

import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { DeviceDetailService } from 'app/main/system/devices/services/device_detail.service';
import { DeviceDetailDataSource } from "app/main/system/devices/services/device_detail.datasource";

import { locale as devicesEnglish } from 'app/main/system/devices/i18n/en';
import { locale as devicesSpanish } from 'app/main/system/devices/i18n/sp';
import { locale as devicesFrench } from 'app/main/system/devices/i18n/fr';
import { locale as devicesPortuguese } from 'app/main/system/devices/i18n/pt';

@Component({
  selector: 'app-device-detail',
  templateUrl: './device_detail.component.html',
  styleUrls: ['./device_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class DeviceDetailComponent implements OnInit
{
  device_detail: any;
  public device: any;
  pageType: string;
  userConncode: string;
  userID: number;

  deviceModel_flag: boolean;

  deviceForm: FormGroup;
  deviceDetail: DeviceDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: DeviceDetailDataSource;

  dataSourceSimcard:     DeviceDetailDataSource;
  dataSourceDeviceType:       DeviceDetailDataSource;
  dataSourceConnIn:     DeviceDetailDataSource;
  dataSourceConnOut:    DeviceDetailDataSource;
  dataSourceConnSMS:    DeviceDetailDataSource;
 
  filter_string: string = '';
  method_string: string = '';
  
  @ViewChild(MatPaginator, {static: true})
    paginatorSimcard: MatPaginator;
  @ViewChild('paginatorDeviceType', {read: MatPaginator, static: true})
    paginatorDeviceType: MatPaginator;
  @ViewChild('paginatorConnIn', {read: MatPaginator, static: true})
    paginatorConnIn: MatPaginator;
  @ViewChild('paginatorConnOut', {read: MatPaginator, static: true})
    paginatorConnOut: MatPaginator;
  @ViewChild('paginatorConnSMS', {read: MatPaginator, static: true})
    paginatorConnSMS: MatPaginator;

  constructor(
    public deviceDetailService: DeviceDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(devicesEnglish, devicesSpanish, devicesFrench, devicesPortuguese);

    this.device = localStorage.getItem("device_detail")? JSON.parse(localStorage.getItem("device_detail")) : '';
    console.log(this.device);
    
    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.device != '' )
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
    console.log(this.device);
  
    this.dataSourceSimcard    = new DeviceDetailDataSource(this.deviceDetailService);
    this.dataSourceDeviceType = new DeviceDetailDataSource(this.deviceDetailService);
    this.dataSourceConnIn     = new DeviceDetailDataSource(this.deviceDetailService);
    this.dataSourceConnOut    = new DeviceDetailDataSource(this.deviceDetailService);
    this.dataSourceConnSMS    = new DeviceDetailDataSource(this.deviceDetailService);

    this.dataSourceSimcard   .loadDeviceDetail(this.userConncode, this.userID, 0, 10, this.device.simcard, "simcard_clist");
    this.dataSourceDeviceType.loadDeviceDetail(this.userConncode, this.userID, 0, 10, this.device.devicetype, "devicetype_clist");
    this.dataSourceConnIn    .loadDeviceDetail(this.userConncode, this.userID, 0, 10, this.device.connin, "connin_clist");
    this.dataSourceConnOut   .loadDeviceDetail(this.userConncode, this.userID, 0, 10, this.device.connout, "connout_clist");
    this.dataSourceConnSMS   .loadDeviceDetail(this.userConncode, this.userID, 0, 10, this.device.connsms, "connsms_clist");

    this.deviceForm = this._formBuilder.group({
      name               : [null, Validators.required],
      simcard            : [null, Validators.required],
      devicetype         : [null, Validators.required],
      connin             : [null, Validators.required],
      connout            : [null, Validators.required],
      connsms            : [null, Validators.required],
      imei               : [null, Validators.required],
      serialnumber       : [null, Validators.required],
      activationcode     : [null, Validators.required],
      
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
    
    merge(this.paginatorSimcard.page)
    .pipe(
      tap(() => {
        this.loadDeviceDetail("simcard")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorDeviceType.page)
    .pipe(
      tap(() => {
        this.loadDeviceDetail("devicetype")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorConnIn.page)
    .pipe(
      tap(() => {
        this.loadDeviceDetail("connin")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorConnOut.page)
    .pipe(
      tap(() => {
        this.loadDeviceDetail("connout")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorConnSMS.page)
    .pipe(
      tap(() => {
        this.loadDeviceDetail("connsms")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });
  }

  loadDeviceDetail(method_string: string) {
    if (method_string == 'simcard') {
      this.dataSourceSimcard.loadDeviceDetail(this.userConncode, this.userID, this.paginatorSimcard.pageIndex, this.paginatorSimcard.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'devicetype') {
        this.dataSourceDeviceType.loadDeviceDetail(this.userConncode, this.userID, this.paginatorDeviceType.pageIndex, this.paginatorDeviceType.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'connin') {
        this.dataSourceConnIn.loadDeviceDetail(this.userConncode, this.userID, this.paginatorConnIn.pageIndex, this.paginatorConnIn.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'connout') {
        this.dataSourceConnOut.loadDeviceDetail(this.userConncode, this.userID, this.paginatorConnOut.pageIndex, this.paginatorConnOut.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'connsms') {
        this.dataSourceConnSMS.loadDeviceDetail(this.userConncode, this.userID, this.paginatorConnSMS.pageIndex, this.paginatorConnSMS.pageSize, this.filter_string, `${method_string}_clist`)
    }
  }

  managePageIndex(method_string: string) {
    switch(method_string) {
      case 'simcard':
        this.paginatorSimcard.pageIndex = 0;
      break;

      case 'devicetype':
        this.paginatorDeviceType.pageIndex = 0;
      break;

      case 'connin':
        this.paginatorConnIn.pageIndex = 0;
      break;

      case 'connout':
        this.paginatorConnOut.pageIndex = 0;
      break;

      case 'connsms':
        this.paginatorConnSMS.pageIndex = 0;
      break;
      
    }
  }

  showCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
   
    let selected_element_id = this.deviceForm.get(`${this.method_string}`).value;

    console.log(methodString, this.deviceDetailService.unit_clist_item[methodString], selected_element_id );

    let clist = this.deviceDetailService.unit_clist_item[methodString];

    for (let i = 0; i< clist.length; i++) {
      if ( clist[i].id == selected_element_id ) {
        this.deviceForm.get('filterstring').setValue(clist[i].name);
        this.filter_string = clist[i].name;
      }
    }
    
    this.managePageIndex(this.method_string);
    this.loadDeviceDetail(this.method_string);
  }

  clearFilter() {
    console.log(this.filter_string);
    this.filter_string = '';
    this.deviceForm.get('filterstring').setValue(this.filter_string);

    this.managePageIndex(this.method_string);
    this.loadDeviceDetail(this.method_string);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
     
      this.managePageIndex(this.method_string);
      this.loadDeviceDetail(this.method_string);
    }

    console.log(this.filter_string);
  }

  setValues() {
      this.deviceForm.get('name').setValue(this.device.name);
      this.deviceForm.get('simcard').setValue(this.device.simcardid);
      this.deviceForm.get('devicetype').setValue(this.device.devicetypeid);
      this.deviceForm.get('connin').setValue(this.device.conninid);
      this.deviceForm.get('connout').setValue(this.device.connoutid);
      this.deviceForm.get('connsms').setValue(this.device.connsmsid);
      this.deviceForm.get('imei').setValue(this.device.imei);
      this.deviceForm.get('serialnumber').setValue(this.device.serialnumber);
      this.deviceForm.get('activationcode').setValue(this.device.activationcode);
     
      let created          = this.device.created? new Date(`${this.device.created}`) : '';
      let deletedwhen      = this.device.deletedwhen? new Date(`${this.device.deletedwhen}`) : '';
      let lastmodifieddate = this.device.lastmodifieddate? new Date(`${this.device.lastmodifieddate}`) : '';

      this.deviceForm.get('created').setValue(this.dateFormat(created));
      this.deviceForm.get('createdbyname').setValue(this.device.createdbyname);
      this.deviceForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.deviceForm.get('deletedbyname').setValue(this.device.deletedbyname);
      this.deviceForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.deviceForm.get('lastmodifiedbyname').setValue(this.device.lastmodifiedbyname);
      this.deviceForm.get('filterstring').setValue(this.filter_string);
  }

  getValues(dateTime: any, mode: string) {
    this.deviceDetail.name           = this.deviceForm.get('name').value || '',
    this.deviceDetail.simcardid      = this.deviceForm.get('simcard').value || 0;
    this.deviceDetail.devicetypeid   = this.deviceForm.get('devicetype').value || 0;
    this.deviceDetail.conninid       = this.deviceForm.get('connin').value || 0;
    this.deviceDetail.connoutid      = this.deviceForm.get('connout').value || 0;
    this.deviceDetail.connsmsid      = this.deviceForm.get('connsms').value || 0;
    this.deviceDetail.imei           = this.deviceForm.get('imei').value || '';
    this.deviceDetail.serialnumber   = this.deviceForm.get('serialnumber').value || '';
    this.deviceDetail.activationcode = this.deviceForm.get('activationcode').value || '';
   
    this.deviceDetail.deletedwhen    = this.device.deletedwhen || '';
    this.deviceDetail.deletedby      = this.device.deletedby || 0;
    this.deviceDetail.isactive       = this.device.isactive || true;

    if( mode  == "save" ) {
      this.deviceDetail.id               = this.device.id;
      this.deviceDetail.created          = this.device.created;
      this.deviceDetail.createdby        = this.device.createdby;
      this.deviceDetail.lastmodifieddate = dateTime;
      this.deviceDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.deviceDetail.id               = 0;
      this.deviceDetail.created          = dateTime;
      this.deviceDetail.createdby        = this.userID;
      this.deviceDetail.lastmodifieddate = dateTime;
      this.deviceDetail.lastmodifiedby   = this.userID;
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

  saveDevice(): void {
    console.log("saveDevice");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(this.deviceDetail);

    if (this.deviceDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.deviceDetailService.saveDeviceDetail(this.userConncode, this.userID, this.deviceDetail)
      .subscribe((result: any) => {
        console.log(result);
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['system/devices/devices']);
        }
      });
    } 
  }

  addDevice(): void {
    let today = new Date().toISOString();
    this.getValues(today, "add");

    if (this.deviceDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.deviceDetailService.saveDeviceDetail(this.userConncode, this.userID, this.deviceDetail)
      .subscribe((result: any) => {
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['system/devices/devices']);
        }
      });
    }
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       device: "", flag: flag
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
