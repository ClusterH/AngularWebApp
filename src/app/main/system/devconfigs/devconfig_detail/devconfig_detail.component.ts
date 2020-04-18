import { Component, OnInit, ViewEncapsulation,  } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { DevConfigDetail } from 'app/main/system/devconfigs/model/devconfig.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { DevConfigDetailService } from 'app/main/system/devconfigs/services/devconfig_detail.service';

import { locale as devconfigsEnglish } from 'app/main/system/devconfigs/i18n/en';
import { locale as devconfigsSpanish } from 'app/main/system/devconfigs/i18n/sp';
import { locale as devconfigsFrench } from 'app/main/system/devconfigs/i18n/fr';
import { locale as devconfigsPortuguese } from 'app/main/system/devconfigs/i18n/pt';

@Component({
  selector: 'app-devconfig-detail',
  templateUrl: './devconfig_detail.component.html',
  styleUrls: ['./devconfig_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class DevConfigDetailComponent implements OnInit
{
  devconfig_detail: any;
  public devconfig: any;
  pageType: string;
  userConncode: string;
  userID: number;

  devconfigForm: FormGroup;
  devconfigDetail: DevConfigDetail = {};

  displayedColumns: string[] = ['name'];
 
  filter_string: string = '';
  method_string: string = '';
  
  constructor(
    public devconfigDetailService: DevConfigDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(devconfigsEnglish, devconfigsSpanish, devconfigsFrench, devconfigsPortuguese);

    this.devconfig = localStorage.getItem("devconfig_detail")? JSON.parse(localStorage.getItem("devconfig_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.devconfig != '' )
    {
      this.pageType = 'edit';
    }
    else
    {
      console.log(this.devconfig);
      this.pageType = 'new';
    }

    this.filter_string = '';
  }

  ngOnInit(): void {
    console.log(this.devconfig);
  
    this.devconfigForm = this._formBuilder.group({
      name               : [null, Validators.required],
      isactive           : [null, Validators.required],
      created            : [{value: '', disabled: true}, Validators.required],
      createdbyname      : [{value: '', disabled: true}, Validators.required],
      lastmodifieddate   : [{value: '', disabled: true}, Validators.required],
      lastmodifiedbyname : [{value: '', disabled: true}, Validators.required],
  });

  this.setValues();
  }

  setValues() {
      this.devconfigForm.get('name').setValue(this.devconfig.name);

      let created          = this.devconfig.createdwhen? new Date(`${this.devconfig.createdwhen}`) : '';
      let lastmodifieddate = this.devconfig.lastmodifieddate? new Date(`${this.devconfig.lastmodifieddate}`) : '';

      this.devconfigForm.get('created').setValue(this.dateFormat(created));
      this.devconfigForm.get('createdbyname').setValue(this.devconfig.createdbyname);
      this.devconfigForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.devconfigForm.get('lastmodifiedbyname').setValue(this.devconfig.lastmodifiedbyname);
  }

  getValues(dateTime: any, mode: string) {
    this.devconfigDetail.name             = this.devconfigForm.get('name').value || '',
    this.devconfigDetail.isactive         = this.devconfig.isactive || true;
    // this.devconfigDetail.deletedwhen      = this.devconfig.deletedwhen || '';
    // this.devconfigDetail.deletedby        = this.devconfig.deletedby || 0;

    if( mode  == "save" ) {
      this.devconfigDetail.id               = this.devconfig.id;
      this.devconfigDetail.createdwhen      = this.devconfig.createdwhen;
      this.devconfigDetail.createdby        = this.devconfig.createdby;
      this.devconfigDetail.lastmodifieddate = dateTime;
      this.devconfigDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.devconfigDetail.id               = 0;
      this.devconfigDetail.createdwhen      = dateTime;
      this.devconfigDetail.createdby        = this.userID;
      this.devconfigDetail.lastmodifieddate = dateTime;
      this.devconfigDetail.lastmodifiedby   = this.userID;
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

  saveDevConfig(): void {
    console.log("saveDevConfig");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(this.devconfigDetail);

    this.devconfigDetailService.saveDevConfigDetail(this.userConncode, this.userID, this.devconfigDetail)
    .subscribe((result: any) => {
      console.log(result);
      if (result.responseCode == 200) {
        alert("Success!");
        this.router.navigate(['system/devconfigs/devconfigs']);
      }
    });
  }

  addDevConfig(): void {
    console.log("addDevConfig");
    let today = new Date().toISOString();
    this.getValues(today, "add");
    console.log(this.devconfigDetail);

    this.devconfigDetailService.saveDevConfigDetail(this.userConncode, this.userID, this.devconfigDetail)
    .subscribe((result: any) => {
      console.log(result);
      if (result.responseCode == 200) {
        alert("Success!");
        this.router.navigate(['system/devconfigs/devconfigs']);
      }
    });
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       devconfig: "", flag: flag
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
