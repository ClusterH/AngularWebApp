import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { CarrierDetail } from 'app/main/system/carriers/model/carrier.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import { Subject, merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { CarrierDetailService } from 'app/main/system/carriers/services/carrier_detail.service';

import { locale as carriersEnglish } from 'app/main/system/carriers/i18n/en';
import { locale as carriersSpanish } from 'app/main/system/carriers/i18n/sp';
import { locale as carriersFrench } from 'app/main/system/carriers/i18n/fr';
import { locale as carriersPortuguese } from 'app/main/system/carriers/i18n/pt';

@Component({
  selector: 'app-carrier-detail',
  templateUrl: './carrier_detail.component.html',
  styleUrls: ['./carrier_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class CarrierDetailComponent implements OnInit
{
  carrier_detail: any;
  public carrier: any;
  pageType: string;
  userConncode: string;
  userID: number;

  carrierModel_flag: boolean;

  carrierForm: FormGroup;
  carrierDetail: CarrierDetail = {};

  displayedColumns: string[] = ['name'];
  
  filter_string: string = '';
  method_string: string = '';
  
  constructor(
    public carrierDetailService: CarrierDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(carriersEnglish, carriersSpanish, carriersFrench, carriersPortuguese);

    this.carrier = localStorage.getItem("carrier_detail")? JSON.parse(localStorage.getItem("carrier_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.carrier != '' )
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
    console.log(this.carrier);

    this.carrierForm = this._formBuilder.group({
      name               : [null, Validators.required],
     
      created            : [{value: '', disabled: true}, Validators.required],
      createdbyname      : [{value: '', disabled: true}, Validators.required],
      deletedwhen        : [{value: '', disabled: true}, Validators.required],
      deletedbyname      : [{value: '', disabled: true}, Validators.required],
      lastmodifieddate   : [{value: '', disabled: true}, Validators.required],
      lastmodifiedbyname : [{value: '', disabled: true}, Validators.required],
  });

  this.setValues();
}

  ngAfterViewInit() {
    console.log("ngAfterViewInit:");
  }

  setValues() {
      this.carrierForm.get('name').setValue(this.carrier.name);
     
      let created          = this.carrier.created? new Date(`${this.carrier.created}`) : '';
      let deletedwhen      = this.carrier.deletedwhen? new Date(`${this.carrier.deletedwhen}`) : '';
      let lastmodifieddate = this.carrier.lastmodifieddate? new Date(`${this.carrier.lastmodifieddate}`) : '';

      this.carrierForm.get('created').setValue(this.dateFormat(created));
      this.carrierForm.get('createdbyname').setValue(this.carrier.createdbyname);
      this.carrierForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.carrierForm.get('deletedbyname').setValue(this.carrier.deletedbyname);
      this.carrierForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.carrierForm.get('lastmodifiedbyname').setValue(this.carrier.lastmodifiedbyname);
  }

  getValues(dateTime: any, mode: string) {
    this.carrierDetail.name             = this.carrierForm.get('name').value || '',
 
    this.carrierDetail.isactive         = this.carrier.isactive || true;
    this.carrierDetail.deletedwhen      = this.carrier.deletedwhen || '';
    this.carrierDetail.deletedby        = this.carrier.deletedby || 0;

    if( mode  == "save" ) {
      this.carrierDetail.id               = this.carrier.id;
      this.carrierDetail.created          = this.carrier.created;
      this.carrierDetail.createdby        = this.carrier.createdby;
      this.carrierDetail.lastmodifieddate = dateTime;
      this.carrierDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.carrierDetail.id               = 0;
      this.carrierDetail.created          = dateTime;
      this.carrierDetail.createdby        = this.userID;
      this.carrierDetail.lastmodifieddate = dateTime;
      this.carrierDetail.lastmodifiedby   = this.userID;
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

  saveCarrier(): void {
    console.log("saveCarrier");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(this.carrierDetail);

    if (this.carrierDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.carrierDetailService.saveCarrierDetail(this.userConncode, this.userID, this.carrierDetail)
      .subscribe((result: any) => {
        console.log(result);
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['system/carriers/carriers']);
        }
      });
    }
  }

  addCarrier(): void {
    console.log("addCarrier");
    let today = new Date().toISOString();
    this.getValues(today, "add");
    console.log(this.carrierDetail);

    if (this.carrierDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.carrierDetailService.saveCarrierDetail(this.userConncode, this.userID, this.carrierDetail)
      .subscribe((result: any) => {
        console.log(result);
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['system/carriers/carriers']);
        }
      });
    }
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       carrier: "", flag: flag
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
