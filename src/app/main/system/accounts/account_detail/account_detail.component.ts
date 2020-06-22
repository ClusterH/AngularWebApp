import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { AccountDetail } from 'app/main/system/accounts/model/account.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import { Subject, merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AccountDetailService } from 'app/main/system/accounts/services/account_detail.service';
import { AccountDetailDataSource } from "app/main/system/accounts/services/account_detail.datasource";
import { AuthService } from 'app/authentication/services/authentication.service';

import { locale as accountsEnglish } from 'app/main/system/accounts/i18n/en';
import { locale as accountsSpanish } from 'app/main/system/accounts/i18n/sp';
import { locale as accountsFrench } from 'app/main/system/accounts/i18n/fr';
import { locale as accountsPortuguese } from 'app/main/system/accounts/i18n/pt';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account_detail.component.html',
  styleUrls: ['./account_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class AccountDetailComponent implements OnInit
{
  account_detail: any;
  public account: any;
  pageType: string;
  userConncode: string;
  userID: number;

  accountModel_flag: boolean;

  accountForm: FormGroup;
  accountDetail: AccountDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: AccountDetailDataSource;
  
  dataSourceBillingStatus: AccountDetailDataSource;
 
  filter_string: string = '';
  method_string: string = '';
  
  @ViewChild(MatPaginator, {static: true})
  paginatorBillingStatus: MatPaginator;

  constructor(
    public accountDetailService: AccountDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(accountsEnglish, accountsSpanish, accountsFrench, accountsPortuguese);

    this.account = localStorage.getItem("account_detail")? JSON.parse(localStorage.getItem("account_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.account != '' )
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
    
    
    this.dataSourceBillingStatus = new AccountDetailDataSource(this.accountDetailService);

    this.dataSourceBillingStatus.loadAccountDetail(this.userConncode, this.userID, 0, 10, '', "billingstatus_clist");

    this.accountForm = this._formBuilder.group({
      name               : [null, Validators.required],
      address            : [null, Validators.required],
      phonenumber        : [null, Validators.required],
      email              : [null, Validators.required],
      contactname        : [null, Validators.required],
      billingstatus      : [null, Validators.required],
      billingfrequency   : [null, Validators.required],
     
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
    

    merge(this.paginatorBillingStatus.page)
    .pipe(
      tap(() => {
        this.loadAccountDetail("billingstatus")
      })
    )
    .subscribe( (res: any) => {
        
    });
    
  }

  loadAccountDetail(method_string: string) {
    if (method_string == 'billingstatus') {
        this.dataSourceBillingStatus.loadAccountDetail(this.userConncode, this.userID, this.paginatorBillingStatus.pageIndex, this.paginatorBillingStatus.pageSize, "", `${method_string}_clist`)
    }
  }

  managePageIndex(method_string: string) {
    switch(method_string) {
      
      case 'billingstatus':
        this.paginatorBillingStatus.pageIndex = 0;
      break;
    }
  }

  showCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
   
    let selected_element_id = this.accountForm.get(`${this.method_string}`).value;

    

    let clist = this.accountDetailService.unit_clist_item[methodString];

    for (let i = 0; i< clist.length; i++) {
      if ( clist[i].id == selected_element_id ) {
        this.filter_string = clist[i].name;
      }
    }
    
    this.managePageIndex(this.method_string);
    this.loadAccountDetail(this.method_string);
  }

  setValues() {
    this.accountForm.get('name').setValue(this.account.name);
    this.accountForm.get('address').setValue(this.account.address);
    this.accountForm.get('phonenumber').setValue(this.account.phonenumber);
    this.accountForm.get('email').setValue(this.account.email);
    this.accountForm.get('contactname').setValue(this.account.contactname);
    this.accountForm.get('billingstatus').setValue(this.account.billingstatusid);
    this.accountForm.get('billingfrequency').setValue(this.account.billingfrequency);
     
      let created          = this.account.created? new Date(`${this.account.created}`) : '';
      let deletedwhen      = this.account.deletedwhen? new Date(`${this.account.deletedwhen}`) : '';
      let lastmodifieddate = this.account.lastmodifieddate? new Date(`${this.account.lastmodifieddate}`) : '';

      this.accountForm.get('created').setValue(this.dateFormat(created));
      this.accountForm.get('createdbyname').setValue(this.account.createdbyname);
      this.accountForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.accountForm.get('deletedbyname').setValue(this.account.deletedbyname);
      this.accountForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.accountForm.get('lastmodifiedbyname').setValue(this.account.lastmodifiedbyname);
  }

  getValues(dateTime: any, mode: string) {
    this.accountDetail.name             = this.accountForm.get('name').value || '',
    this.accountDetail.address          = this.accountForm.get('address').value || '',
    this.accountDetail.email            = this.accountForm.get('email').value || '',
    this.accountDetail.phonenumber      = this.accountForm.get('phonenumber').value || '',
    this.accountDetail.contactname      = this.accountForm.get('contactname').value || '',
    this.accountDetail.billingstatusid  = this.accountForm.get('billingstatus').value || 0,
    this.accountDetail.billingfrequency = this.accountForm.get('billingfrequency').value || 0;
 
    this.accountDetail.isactive         = this.account.isactive || true;
    this.accountDetail.deletedwhen      = this.account.deletedwhen || '';
    this.accountDetail.deletedby        = this.account.deletedby || 0;

    if( mode  == "save" ) {
      this.accountDetail.id               = this.account.id;
      this.accountDetail.created          = this.account.created;
      this.accountDetail.createdby        = this.account.createdby;
      this.accountDetail.lastmodifieddate = dateTime;
      this.accountDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.accountDetail.id               = 0;
      this.accountDetail.created          = dateTime;
      this.accountDetail.createdby        = this.userID;
      this.accountDetail.lastmodifieddate = dateTime;
      this.accountDetail.lastmodifiedby   = this.userID;
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

  saveAccount(): void {
    
    let today = new Date().toISOString();
    this.getValues(today, "save");
    

    if (this.accountDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.accountDetailService.saveAccountDetail(this.userConncode, this.userID, this.accountDetail)
      .subscribe((result: any) => {
        
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['system/accounts/accounts']);
        }
      });
    }
  }

  addAccount(): void {
    
    let today = new Date().toISOString();
    this.getValues(today, "add");
    

    if (this.accountDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.accountDetailService.saveAccountDetail(this.userConncode, this.userID, this.accountDetail)
      .subscribe((result: any) => {
        
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['system/accounts/accounts']);
        }
      });
    }
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       account: "", flag: flag
    };

    dialogConfig.disableClose = false;

    const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
        if ( result )
        { 
            

        } else {
            
        }
    });

  }
}
