import { Component, OnInit, ViewEncapsulation,  } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { MakeDetail } from 'app/main/admin/makes/model/make.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { MakeDetailService } from 'app/main/admin/makes/services/make_detail.service';

import { locale as makesEnglish } from 'app/main/admin/makes/i18n/en';
import { locale as makesSpanish } from 'app/main/admin/makes/i18n/sp';
import { locale as makesFrench } from 'app/main/admin/makes/i18n/fr';
import { locale as makesPortuguese } from 'app/main/admin/makes/i18n/pt';

@Component({
  selector: 'app-make-detail',
  templateUrl: './make_detail.component.html',
  styleUrls: ['./make_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class MakeDetailComponent implements OnInit
{
  make_detail: any;
  public make: any;
  pageType: string;
  userConncode: string;
  userID: number;

  makeForm: FormGroup;
  makeDetail: MakeDetail = {};

  displayedColumns: string[] = ['name'];
 
  filter_string: string = '';
  method_string: string = '';
  
  constructor(
    public makeDetailService: MakeDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(makesEnglish, makesSpanish, makesFrench, makesPortuguese);

    this.make = localStorage.getItem("make_detail")? JSON.parse(localStorage.getItem("make_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.make != '' )
    {
      this.pageType = 'edit';
    }
    else
    {
      console.log(this.make);
      this.pageType = 'new';
    }

    this.filter_string = '';
  }

  ngOnInit(): void {
    console.log(this.make);
  
    this.makeForm = this._formBuilder.group({
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
      this.makeForm.get('name').setValue(this.make.name);

      let created          = this.make.createdwhen? new Date(`${this.make.createdwhen}`) : '';
      let lastmodifieddate = this.make.lastmodifieddate? new Date(`${this.make.lastmodifieddate}`) : '';

      this.makeForm.get('created').setValue(this.dateFormat(created));
      this.makeForm.get('createdbyname').setValue(this.make.createdbyname);
      this.makeForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.makeForm.get('lastmodifiedbyname').setValue(this.make.lastmodifiedbyname);
  }

  getValues(dateTime: any, mode: string) {
    this.makeDetail.name             = this.makeForm.get('name').value || '',
    this.makeDetail.isactive         = this.make.isactive || true;
    // this.makeDetail.deletedwhen      = this.make.deletedwhen || '';
    // this.makeDetail.deletedby        = this.make.deletedby || 0;

    if( mode  == "save" ) {
      this.makeDetail.id               = this.make.id;
      this.makeDetail.createdwhen      = this.make.createdwhen;
      this.makeDetail.createdby        = this.make.createdby;
      this.makeDetail.lastmodifieddate = dateTime;
      this.makeDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.makeDetail.id               = 0;
      this.makeDetail.createdwhen      = dateTime;
      this.makeDetail.createdby        = this.userID;
      this.makeDetail.lastmodifieddate = dateTime;
      this.makeDetail.lastmodifiedby   = this.userID;
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

  saveMake(): void {
    console.log("saveMake");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(this.makeDetail);

    this.makeDetailService.saveMakeDetail(this.userConncode, this.userID, this.makeDetail)
    .subscribe((result: any) => {
      console.log(result);
      if (result.responseCode == 200) {
        alert("Success!");
        this.router.navigate(['admin/makes/makes']);
      }
    });
  }

  addMake(): void {
    console.log("addMake");
    let today = new Date().toISOString();
    this.getValues(today, "add");
    console.log(this.makeDetail);

    this.makeDetailService.saveMakeDetail(this.userConncode, this.userID, this.makeDetail)
    .subscribe((result: any) => {
      console.log(result);
      if (result.responseCode == 200) {
        alert("Success!");
        this.router.navigate(['admin/makes/makes']);
      }
    });
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       make: "", flag: flag
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
