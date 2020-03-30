import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { PoiDetail } from 'app/main/admin/poi/pois/model/poi.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { PoiDetailService } from 'app/main/admin/poi/pois/services/poi_detail.service';
import { PoiDetailDataSource } from "app/main/admin/poi/pois/services/poi_detail.datasource";

import { locale as poisEnglish } from 'app/main/admin/poi/pois/i18n/en';
import { locale as poisSpanish } from 'app/main/admin/poi/pois/i18n/sp';
import { locale as poisFrench } from 'app/main/admin/poi/pois/i18n/fr';
import { locale as poisPortuguese } from 'app/main/admin/poi/pois/i18n/pt';

@Component({
  selector: 'app-poi-detail',
  templateUrl: './poi_detail.component.html',
  styleUrls: ['./poi_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class PoiDetailComponent implements OnInit
{
  poi_detail: any;
  public poi: any;
  pageType: string;
  userConncode: string;
  userID: number;

  poiModel_flag: boolean;

  poiForm: FormGroup;
  poiDetail: PoiDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: PoiDetailDataSource;

  dataSourceCompany:     PoiDetailDataSource;
  dataSourceGroup:       PoiDetailDataSource;
  dataSourcePoint:     PoiDetailDataSource;
  dataSourcePointType:    PoiDetailDataSource;
 
  filter_string: string = '';
  method_string: string = '';
  
  @ViewChild(MatPaginator, {static: true})
    paginatorCompany: MatPaginator;
  @ViewChild('paginatorGroup', {read: MatPaginator, static: true})
    paginatorGroup: MatPaginator;
  @ViewChild('paginatorPoint', {read: MatPaginator, static: true})
    paginatorPoint: MatPaginator;
  @ViewChild('paginatorPointType', {read: MatPaginator, static: true})
    paginatorPointType: MatPaginator;
  
  constructor(
    public poiDetailService: PoiDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(poisEnglish, poisSpanish, poisFrench, poisPortuguese);

    this.poi = localStorage.getItem("poi_detail")? JSON.parse(localStorage.getItem("poi_detail")) : '';
    console.log(this.poi);
    
    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.poi != '' )
    {
      this.pageType = 'edit';
    }
    else
    {
      console.log(this.poi);

      this.pageType = 'new';
    }

    this.filter_string = '';
  }

  ngOnInit(): void {
  
    this.dataSourceCompany   = new PoiDetailDataSource(this.poiDetailService);
    this.dataSourceGroup     = new PoiDetailDataSource(this.poiDetailService);
    this.dataSourcePoint     = new PoiDetailDataSource(this.poiDetailService);
    this.dataSourcePointType = new PoiDetailDataSource(this.poiDetailService);

    this.dataSourceCompany  .loadPoiDetail(this.userConncode, this.userID, 0, 10, this.poi.company, "company_clist");
    this.dataSourceGroup    .loadPoiDetail(this.userConncode, this.userID, 0, 10, this.poi.group, "group_clist");
    this.dataSourcePoint    .loadPoiDetail(this.userConncode, this.userID, 0, 10, this.poi.point, "point_clist");
    this.dataSourcePointType.loadPoiDetail(this.userConncode, this.userID, 0, 10, this.poi.pointtype, "pointtype_clist");

    this.poiForm = this._formBuilder.group({
      name               : [null, Validators.required],
      company            : [null, Validators.required],
      group              : [null, Validators.required],
      subgroup           : [null, Validators.required],
      point              : [null, Validators.required],
      pointtype          : [null, Validators.required],
      address            : [null, Validators.required],
      longitude          : [null, Validators.required],
      latitude           : [null, Validators.required],
      radius             : [null, Validators.required],
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
        this.loadPoiDetail("company")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorGroup.page)
    .pipe(
      tap(() => {
        this.loadPoiDetail("group")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorPoint.page)
    .pipe(
      tap(() => {
        this.loadPoiDetail("point")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorPointType.page)
    .pipe(
      tap(() => {
        this.loadPoiDetail("pointtype")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });
  }

  loadPoiDetail(method_string: string) {
    if (method_string == 'company') {
      this.dataSourceCompany.loadPoiDetail(this.userConncode, this.userID, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'group') {
        this.dataSourceGroup.loadPoiDetail(this.userConncode, this.userID, this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'point') {
        this.dataSourcePoint.loadPoiDetail(this.userConncode, this.userID, this.paginatorPoint.pageIndex, this.paginatorPoint.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'pointtype') {
        this.dataSourcePointType.loadPoiDetail(this.userConncode, this.userID, this.paginatorPointType.pageIndex, this.paginatorPointType.pageSize, this.filter_string, `${method_string}_clist`)
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

      case 'point':
        this.paginatorPoint.pageIndex = 0;
      break;

      case 'pointtype':
        this.paginatorPointType.pageIndex = 0;
      break;
    }
  }

  showCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
    let selected_element_id = this.poiForm.get(`${this.method_string}`).value;

    console.log(methodString, this.poiDetailService.unit_clist_item[methodString], selected_element_id );

    let clist = this.poiDetailService.unit_clist_item[methodString];

    for (let i = 0; i< clist.length; i++) {
      if ( clist[i].id == selected_element_id ) {
        this.poiForm.get('filterstring').setValue(clist[i].name);
        this.filter_string = clist[i].name;
      }
    }
    
    this.managePageIndex(this.method_string);
    this.loadPoiDetail(this.method_string);
  }

  clearFilter() {
    console.log(this.filter_string);
    this.filter_string = '';
    this.poiForm.get('filterstring').setValue(this.filter_string);
   
    this.managePageIndex(this.method_string);
    this.loadPoiDetail(this.method_string);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
     
      this.managePageIndex(this.method_string);
      this.loadPoiDetail(this.method_string);
    }

    console.log(this.filter_string);
  }

  setValues() {
      this.poiForm.get('name').setValue(this.poi.name);
      this.poiForm.get('company').setValue(this.poi.companyid);
      this.poiForm.get('group').setValue(this.poi.groupid);
      this.poiForm.get('radius').setValue(this.poi.accountid);
      this.poiForm.get('point').setValue(this.poi.point);
      this.poiForm.get('pointtype').setValue(this.poi.pointtype);
      this.poiForm.get('address').setValue(this.poi.address);
      this.poiForm.get('latitude').setValue(this.poi.latitude);
      this.poiForm.get('longitude').setValue(this.poi.longitude);

      let created          = this.poi.created? new Date(`${this.poi.created}`) : '';
      let deletedwhen      = this.poi.deletedwhen? new Date(`${this.poi.deletedwhen}`) : '';
      let lastmodifieddate = this.poi.lastmodifieddate? new Date(`${this.poi.lastmodifieddate}`) : '';

      this.poiForm.get('created').setValue(this.dateFormat(created));
      this.poiForm.get('createdbyname').setValue(this.poi.createdbyname);
      this.poiForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.poiForm.get('deletedbyname').setValue(this.poi.deletedbyname);
      this.poiForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.poiForm.get('lastmodifiedbyname').setValue(this.poi.lastmodifiedbyname);
      this.poiForm.get('filterstring').setValue(this.filter_string);
  }

  getValues(dateTime: any, mode: string) {
    this.poiDetail.name        = this.poiForm.get('name').value || '',
    this.poiDetail.companyid   = this.poiForm.get('company').value || 0;
    this.poiDetail.groupid     = this.poiForm.get('group').value || 0;
    this.poiDetail.pointid     = this.poiForm.get('point').value || 0;
    this.poiDetail.pointtypeid = this.poiForm.get('pointtype').value || 0;
    this.poiDetail.radius      = this.poiForm.get('radius').value || 0;
    this.poiDetail.address     = this.poiForm.get('address').value || '';
    this.poiDetail.latitude    = this.poiForm.get('latitude').value || 0;
    this.poiDetail.longitude   = this.poiForm.get('longitude').value || 0;
 
    this.poiDetail.subgroup         = this.poi.subgroup || 0;
    this.poiDetail.isactive         = this.poi.isactive || true;
    this.poiDetail.deletedwhen      = this.poi.deletedwhen || '';
    this.poiDetail.deletedby        = this.poi.deletedby || 0;

    if( mode  == "save" ) {
      this.poiDetail.id               = this.poi.id;
      this.poiDetail.created          = this.poi.created;
      this.poiDetail.createdby        = this.poi.createdby;
      this.poiDetail.lastmodifieddate = dateTime;
      this.poiDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.poiDetail.id               = 0;
      this.poiDetail.created          = dateTime;
      this.poiDetail.createdby        = this.userID;
      this.poiDetail.lastmodifieddate = dateTime;
      this.poiDetail.lastmodifiedby   = this.userID;
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

  savePoi(): void {
    console.log("savePoi");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(this.poiDetail);

    this.poiDetailService.savePoiDetail(this.userConncode, this.userID, this.poiDetail)
    .subscribe((result: any) => {
      console.log(result);
      if (result.responseCode == 200) {
        alert("Success!");
        this.router.navigate(['admin/poi/pois/pois']);
      }
    });
  }

  addPoi(): void {
    let today = new Date().toISOString();
    this.getValues(today, "add");

    this.poiDetailService.savePoiDetail(this.userConncode, this.userID, this.poiDetail)
    .subscribe((result: any) => {
      if (result.responseCode == 200) {
        alert("Success!");
        this.router.navigate(['admin/poi/pois/pois']);
      }
    });
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       poi: "", flag: flag
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
