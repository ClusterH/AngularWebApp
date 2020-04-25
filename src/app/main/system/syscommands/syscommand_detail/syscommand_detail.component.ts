import { Component, OnInit, ViewEncapsulation,  } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { SysCommandDetail } from 'app/main/system/syscommands/model/syscommand.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { SysCommandDetailService } from 'app/main/system/syscommands/services/syscommand_detail.service';

import { locale as syscommandsEnglish } from 'app/main/system/syscommands/i18n/en';
import { locale as syscommandsSpanish } from 'app/main/system/syscommands/i18n/sp';
import { locale as syscommandsFrench } from 'app/main/system/syscommands/i18n/fr';
import { locale as syscommandsPortuguese } from 'app/main/system/syscommands/i18n/pt';

@Component({
  selector: 'app-syscommand-detail',
  templateUrl: './syscommand_detail.component.html',
  styleUrls: ['./syscommand_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class SysCommandDetailComponent implements OnInit
{
  syscommand_detail: any;
  public syscommand: any;
  pageType: string;
  userConncode: string;
  userID: number;

  syscommandForm: FormGroup;
  syscommandDetail: SysCommandDetail = {};

  displayedColumns: string[] = ['name'];
 
  filter_string: string = '';
  method_string: string = '';
  
  constructor(
    public syscommandDetailService: SysCommandDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(syscommandsEnglish, syscommandsSpanish, syscommandsFrench, syscommandsPortuguese);

    this.syscommand = localStorage.getItem("syscommand_detail")? JSON.parse(localStorage.getItem("syscommand_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.syscommand != '' )
    {
      this.pageType = 'edit';
    }
    else
    {
      console.log(this.syscommand);
      this.pageType = 'new';
    }

    this.filter_string = '';
  }

  ngOnInit(): void {
    console.log(this.syscommand);
  
    this.syscommandForm = this._formBuilder.group({
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
      this.syscommandForm.get('name').setValue(this.syscommand.name);

      let created          = this.syscommand.createdwhen? new Date(`${this.syscommand.createdwhen}`) : '';
      let lastmodifieddate = this.syscommand.lastmodifieddate? new Date(`${this.syscommand.lastmodifieddate}`) : '';

      this.syscommandForm.get('created').setValue(this.dateFormat(created));
      this.syscommandForm.get('createdbyname').setValue(this.syscommand.createdbyname);
      this.syscommandForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.syscommandForm.get('lastmodifiedbyname').setValue(this.syscommand.lastmodifiedbyname);
  }

  getValues(dateTime: any, mode: string) {
    this.syscommandDetail.name             = this.syscommandForm.get('name').value || '',
    this.syscommandDetail.isactive         = this.syscommand.isactive || true;
    // this.syscommandDetail.deletedwhen      = this.syscommand.deletedwhen || '';
    // this.syscommandDetail.deletedby        = this.syscommand.deletedby || 0;

    if( mode  == "save" ) {
      this.syscommandDetail.id               = this.syscommand.id;
      this.syscommandDetail.createdwhen      = this.syscommand.createdwhen;
      this.syscommandDetail.createdby        = this.syscommand.createdby;
      this.syscommandDetail.lastmodifieddate = dateTime;
      this.syscommandDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.syscommandDetail.id               = 0;
      this.syscommandDetail.createdwhen      = dateTime;
      this.syscommandDetail.createdby        = this.userID;
      this.syscommandDetail.lastmodifieddate = dateTime;
      this.syscommandDetail.lastmodifiedby   = this.userID;
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

  saveSysCommand(): void {
    console.log("saveSysCommand");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(this.syscommandDetail);

    if (this.syscommandDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.syscommandDetailService.saveSysCommandDetail(this.userConncode, this.userID, this.syscommandDetail)
      .subscribe((result: any) => {
        console.log(result);
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['system/syscommands/syscommands']);
        }
      });
    }
  }

  addSysCommand(): void {
    console.log("addSysCommand");
    let today = new Date().toISOString();
    this.getValues(today, "add");
    console.log(this.syscommandDetail);

    if (this.syscommandDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.syscommandDetailService.saveSysCommandDetail(this.userConncode, this.userID, this.syscommandDetail)
      .subscribe((result: any) => {
        console.log(result);
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['system/syscommands/syscommands']);
        }
      });
    }
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       syscommand: "", flag: flag
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
