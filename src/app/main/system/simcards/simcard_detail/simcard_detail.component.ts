import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { SimcardDetail } from 'app/main/system/simcards/model/simcard.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import { Subject, merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { SimcardDetailService } from 'app/main/system/simcards/services/simcard_detail.service';
import { SimcardDetailDataSource } from "app/main/system/simcards/services/simcard_detail.datasource";

import { locale as simcardsEnglish } from 'app/main/system/simcards/i18n/en';
import { locale as simcardsSpanish } from 'app/main/system/simcards/i18n/sp';
import { locale as simcardsFrench } from 'app/main/system/simcards/i18n/fr';
import { locale as simcardsPortuguese } from 'app/main/system/simcards/i18n/pt';

@Component({
  selector: 'app-simcard-detail',
  templateUrl: './simcard_detail.component.html',
  styleUrls: ['./simcard_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class SimcardDetailComponent implements OnInit
{
  simcard_detail: any;
  public simcard: any;
  pageType: string;
  userConncode: string;
  userID: number;

  simcardModel_flag: boolean;

  simcardForm: FormGroup;
  simcardDetail: SimcardDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: SimcardDetailDataSource;
  
  dataSourceCarrier: SimcardDetailDataSource;
 
  filter_string: string = '';
  method_string: string = '';
  
  @ViewChild(MatPaginator, {static: true})
  paginatorCarrier: MatPaginator;

  constructor(
    public simcardDetailService: SimcardDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(simcardsEnglish, simcardsSpanish, simcardsFrench, simcardsPortuguese);

    this.simcard = localStorage.getItem("simcard_detail")? JSON.parse(localStorage.getItem("simcard_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.simcard != '' )
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
    console.log(this.simcard);
    
    this.dataSourceCarrier    = new SimcardDetailDataSource(this.simcardDetailService);

    this.dataSourceCarrier  .loadSimcardDetail(this.userConncode, this.userID, 0, 10, '', "carrier_clist");

    this.simcardForm = this._formBuilder.group({
      name               : [null, Validators.required],
      phonenumber        : [null, Validators.required],
      carrier            : [null, Validators.required],
     
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

    merge(this.paginatorCarrier.page)
    .pipe(
      tap(() => {
        this.loadSimcardDetail("carrier")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });
    
  }

  loadSimcardDetail(method_string: string) {
    if (method_string == 'produccarrierttype') {
        this.dataSourceCarrier.loadSimcardDetail(this.userConncode, this.userID, this.paginatorCarrier.pageIndex, this.paginatorCarrier.pageSize, "", `${method_string}_clist`)
    }
  }

  managePageIndex(method_string: string) {
    switch(method_string) {
      
      case 'carrier':
        this.paginatorCarrier.pageIndex = 0;
      break;
    }
  }

  showCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
   
    let selected_element_id = this.simcardForm.get(`${this.method_string}`).value;

    console.log(methodString, this.simcardDetailService.unit_clist_item[methodString], selected_element_id );

    let clist = this.simcardDetailService.unit_clist_item[methodString];

    for (let i = 0; i< clist.length; i++) {
      if ( clist[i].id == selected_element_id ) {
        this.simcardForm.get('filterstring').setValue(clist[i].name);
        this.filter_string = clist[i].name;
      }
    }
    
    this.managePageIndex(this.method_string);
    this.loadSimcardDetail(this.method_string);
  }

  clearFilter() {
    console.log(this.filter_string);
    this.filter_string = '';
    this.simcardForm.get('filterstring').setValue(this.filter_string);
  
    this.managePageIndex(this.method_string);
    this.loadSimcardDetail(this.method_string);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
     
      this.managePageIndex(this.method_string);
      this.loadSimcardDetail(this.method_string);
    }

    console.log(this.filter_string);
  }

  setValues() {
    this.simcardForm.get('name').setValue(this.simcard.name);
    this.simcardForm.get('phonenumber').setValue(this.simcard.phonenumber);
    this.simcardForm.get('carrier').setValue(this.simcard.carrierid);
     
      let created          = this.simcard.created? new Date(`${this.simcard.created}`) : '';
      let deletedwhen      = this.simcard.deletedwhen? new Date(`${this.simcard.deletedwhen}`) : '';
      let lastmodifieddate = this.simcard.lastmodifieddate? new Date(`${this.simcard.lastmodifieddate}`) : '';

      this.simcardForm.get('created').setValue(this.dateFormat(created));
      this.simcardForm.get('createdbyname').setValue(this.simcard.createdbyname);
      this.simcardForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.simcardForm.get('deletedbyname').setValue(this.simcard.deletedbyname);
      this.simcardForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.simcardForm.get('lastmodifiedbyname').setValue(this.simcard.lastmodifiedbyname);
      this.simcardForm.get('filterstring').setValue(this.filter_string);
  }

  getValues(dateTime: any, mode: string) {
    this.simcardDetail.name             = this.simcardForm.get('name').value || '',
    this.simcardDetail.phonenumber      = this.simcardForm.get('phonenumber').value || '',
    
    this.simcardDetail.carrierid        = this.simcardForm.get('carrier').value || 0;
 
    this.simcardDetail.isactive         = this.simcard.isactive || true;
    this.simcardDetail.deletedwhen      = this.simcard.deletedwhen || '';
    this.simcardDetail.deletedby        = this.simcard.deletedby || 0;

    if( mode  == "save" ) {
      this.simcardDetail.id               = this.simcard.id;
      this.simcardDetail.created          = this.simcard.created;
      this.simcardDetail.createdby        = this.simcard.createdby;
      this.simcardDetail.lastmodifieddate = dateTime;
      this.simcardDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.simcardDetail.id               = 0;
      this.simcardDetail.created          = dateTime;
      this.simcardDetail.createdby        = this.userID;
      this.simcardDetail.lastmodifieddate = dateTime;
      this.simcardDetail.lastmodifiedby   = this.userID;
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

  saveSimcard(): void {
    console.log("saveSimcard");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(this.simcardDetail);

    if (this.simcardDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.simcardDetailService.saveSimcardDetail(this.userConncode, this.userID, this.simcardDetail)
      .subscribe((result: any) => {
        console.log(result);
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['system/simcards/simcards']);
        }
      });
    }
  }

  addSimcard(): void {
    console.log("addSimcard");
    let today = new Date().toISOString();
    this.getValues(today, "add");
    console.log(this.simcardDetail);

    if (this.simcardDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.simcardDetailService.saveSimcardDetail(this.userConncode, this.userID, this.simcardDetail)
      .subscribe((result: any) => {
        console.log(result);
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['system/simcards/simcards']);
        }
      });
    }
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       simcard: "", flag: flag
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
