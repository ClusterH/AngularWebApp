import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { ZoneDetail } from 'app/main/admin/geofences/zones/model/zone.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { ZoneDetailService } from 'app/main/admin/geofences/zones/services/zone_detail.service';
import { ZoneDetailDataSource } from "app/main/admin/geofences/zones/services/zone_detail.datasource";

import { locale as zonesEnglish } from 'app/main/admin/geofences/zones/i18n/en';
import { locale as zonesSpanish } from 'app/main/admin/geofences/zones/i18n/sp';
import { locale as zonesFrench } from 'app/main/admin/geofences/zones/i18n/fr';
import { locale as zonesPortuguese } from 'app/main/admin/geofences/zones/i18n/pt';

@Component({
  selector: 'app-zone-detail',
  templateUrl: './zone_detail.component.html',
  styleUrls: ['./zone_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class ZoneDetailComponent implements OnInit
{
  zone_detail: any;
  public zone: any;
  pageType: string;
  userConncode: string;
  userID: number;

  zoneModel_flag: boolean;

  zoneForm: FormGroup;
  zoneDetail: ZoneDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: ZoneDetailDataSource;

  dataSourceCompany:     ZoneDetailDataSource;
 
  filter_string: string = '';
  method_string: string = '';
  
  @ViewChild(MatPaginator, {static: true})
    paginatorCompany: MatPaginator;
  
  constructor(
    public zoneDetailService: ZoneDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(zonesEnglish, zonesSpanish, zonesFrench, zonesPortuguese);

    this.zone = localStorage.getItem("zone_detail")? JSON.parse(localStorage.getItem("zone_detail")) : '';
    console.log(this.zone);
    
    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.zone != '' )
    {
      this.pageType = 'edit';
    }
    else
    {
      console.log(this.zone);

      this.pageType = 'new';
    }

    this.filter_string = '';
  }

  ngOnInit(): void {
  
    this.dataSourceCompany   = new ZoneDetailDataSource(this.zoneDetailService);

    this.dataSourceCompany  .loadZoneDetail(this.userConncode, this.userID, 0, 10, this.zone.company, "company_clist");
   
    this.zoneForm = this._formBuilder.group({
      name               : [null, Validators.required],
      company            : [null, Validators.required],
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
    
    merge(this.paginatorCompany.page)
    .pipe(
      tap(() => {
        this.loadZoneDetail("company")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });
  }

  loadZoneDetail(method_string: string) {
    if (method_string == 'company') {
      this.dataSourceCompany.loadZoneDetail(this.userConncode, this.userID, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
    }
  }

  managePageIndex(method_string: string) {
    switch(method_string) {
      case 'company':
        this.paginatorCompany.pageIndex = 0;
      break;
    }
  }

  showCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
    let selected_element_id = this.zoneForm.get(`${this.method_string}`).value;

    console.log(methodString, this.zoneDetailService.unit_clist_item[methodString], selected_element_id );

    let clist = this.zoneDetailService.unit_clist_item[methodString];

    for (let i = 0; i< clist.length; i++) {
      if ( clist[i].id == selected_element_id ) {
        this.zoneForm.get('filterstring').setValue(clist[i].name);
        this.filter_string = clist[i].name;
      }
    }
    
    this.managePageIndex(this.method_string);
    this.loadZoneDetail(this.method_string);
  }

  clearFilter() {
    console.log(this.filter_string);
    this.filter_string = '';
    this.zoneForm.get('filterstring').setValue(this.filter_string);
   
    this.managePageIndex(this.method_string);
    this.loadZoneDetail(this.method_string);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
     
      this.managePageIndex(this.method_string);
      this.loadZoneDetail(this.method_string);
    }

    console.log(this.filter_string);
  }

  setValues() {
      this.zoneForm.get('name').setValue(this.zone.name);
      this.zoneForm.get('company').setValue(this.zone.companyid);

      let created          = this.zone.created? new Date(`${this.zone.created}`) : '';
      let deletedwhen      = this.zone.deletedwhen? new Date(`${this.zone.deletedwhen}`) : '';
      let lastmodifieddate = this.zone.lastmodifieddate? new Date(`${this.zone.lastmodifieddate}`) : '';

      this.zoneForm.get('created').setValue(this.dateFormat(created));
      this.zoneForm.get('createdbyname').setValue(this.zone.createdbyname);
      this.zoneForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.zoneForm.get('deletedbyname').setValue(this.zone.deletedbyname);
      this.zoneForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.zoneForm.get('lastmodifiedbyname').setValue(this.zone.lastmodifiedbyname);
      this.zoneForm.get('filterstring').setValue(this.filter_string);
  }

  getValues(dateTime: any, mode: string) {
    this.zoneDetail.name        = this.zoneForm.get('name').value || '',
    this.zoneDetail.companyid   = this.zoneForm.get('company').value || 0;
 
    this.zoneDetail.isactive         = this.zone.isactive || true;
    this.zoneDetail.deletedwhen      = this.zone.deletedwhen || '';
    this.zoneDetail.deletedby        = this.zone.deletedby || 0;

    if( mode  == "save" ) {
      this.zoneDetail.id               = this.zone.id;
      this.zoneDetail.created          = this.zone.created;
      this.zoneDetail.createdby        = this.zone.createdby;
      this.zoneDetail.lastmodifieddate = dateTime;
      this.zoneDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.zoneDetail.id               = 0;
      this.zoneDetail.created          = dateTime;
      this.zoneDetail.createdby        = this.userID;
      this.zoneDetail.lastmodifieddate = dateTime;
      this.zoneDetail.lastmodifiedby   = this.userID;
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

  saveZone(): void {
    console.log("saveZone");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(this.zoneDetail);

    if (this.zoneDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.zoneDetailService.saveZoneDetail(this.userConncode, this.userID, this.zoneDetail)
      .subscribe((result: any) => {
        console.log(result);
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['admin/geofences/zones/zones']);
        }
      });
    }
  }

  addZone(): void {
    let today = new Date().toISOString();
    this.getValues(today, "add");

    if (this.zoneDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.zoneDetailService.saveZoneDetail(this.userConncode, this.userID, this.zoneDetail)
      .subscribe((result: any) => {
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['admin/geofences/zones/zones']);
        }
      });
    }
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       zone: "", flag: flag
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
