import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { CompanyDetail } from 'app/main/admin/companies/model/company.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import * as $ from 'jquery';

import { Subject, merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { CompanyDetailService } from 'app/main/admin/companies/services/company_detail.service';
import { CompanyDetailDataSource } from "app/main/admin/companies/services/company_detail.datasource";

import { locale as companiesEnglish } from 'app/main/admin/companies/i18n/en';
import { locale as companiesSpanish } from 'app/main/admin/companies/i18n/sp';
import { locale as companiesFrench } from 'app/main/admin/companies/i18n/fr';
import { locale as companiesPortuguese } from 'app/main/admin/companies/i18n/pt';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company_detail.component.html',
  styleUrls: ['./company_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class CompanyDetailComponent implements OnInit
{
  company_detail: any;
  public company: any;
  pageType: string;
  userConncode: string;
  userID: number;

  companyForm: FormGroup;
  companyDetail: CompanyDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: CompanyDetailDataSource;
  dataSourceAccount: CompanyDetailDataSource;
  dataSourceCompanyType: CompanyDetailDataSource;
  dataSourceUserProfile: CompanyDetailDataSource;

 
  filter_string: string = '';
  method_string: string = '';
  
  @ViewChild(MatPaginator, {static: true})
    paginatorCompany: MatPaginator;
  @ViewChild('paginatorAccount', {read: MatPaginator, static: true})
    paginatorAccount: MatPaginator;
  @ViewChild('paginatorCompanyType', {read: MatPaginator, static: true})
    paginatorCompanyType: MatPaginator;
    @ViewChild('paginatorUserProfile', {read: MatPaginator, static: true})
    paginatorUserProfile: MatPaginator;


  constructor(
    // private companiesService: CompaniesService,

    private companyDetailService: CompanyDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(companiesEnglish, companiesSpanish, companiesFrench, companiesPortuguese);

    // this.company = this.companyDetailService.company_detail;
    this.company = localStorage.getItem("company_detail")? JSON.parse(localStorage.getItem("company_detail")) : '';
    console.log(this.company);
      if ( this.company != '' )
      {
        // this.company = JSON.parse(localStorage.getItem("company_detail"));
        this.pageType = 'edit';
      }
      else
      {
        console.log(this.company);
        this.pageType = 'new';
      }
 
      this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
      this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

      this.filter_string = '';
  }

  ngOnInit(): void {
    console.log(this.company);
  
    this.dataSourceAccount        = new CompanyDetailDataSource(this.companyDetailService);
    this.dataSourceCompanyType       = new CompanyDetailDataSource(this.companyDetailService);
    this.dataSourceUserProfile       = new CompanyDetailDataSource(this.companyDetailService);

    this.dataSourceAccount.loadCompanyDetail(this.userConncode, this.userID, 0, 10, this.company.account, "account_clist");
    this.dataSourceCompanyType.loadCompanyDetail(this.userConncode, this.userID, 0, 10, this.company.companytype, "companytype_clist");
    this.dataSourceUserProfile.loadCompanyDetail(this.userConncode, this.userID, 0, 10, this.company.userprofile, "userprofile_clist");
    
    this.companyForm = this._formBuilder.group({
      name               : [null, Validators.required],
      account            : [null, Validators.required],
      address            : [null, Validators.required],
      logofile           : [null, Validators.required],
      country            : [null, Validators.required],
      contactname        : [null, Validators.required],
      phone              : [null, Validators.required],
      email              : [null, Validators.required],
      comments           : [null, Validators.required],
      orgno              : [null, Validators.required],
      companytype        : [null, Validators.required],
      isactive           : [null, Validators.required],
      webstartlat        : [null, Validators.required],
      webstartlong       : [null, Validators.required],
      userprofile        : [null, Validators.required],
      hasprivatelabel    : [null, Validators.required],
      emailserver        : [null, Validators.required],
      emailsender        : [null, Validators.required],
      emailuser          : [null, Validators.required],
      emailpassword      : [null, Validators.required],
      billingnote        : [null, Validators.required],
      created            : [null, Validators.required],
      createdbyname      : [null, Validators.required],
      deletedwhen        : [null, Validators.required],
      deletedbyname      : [null, Validators.required],
      lastmodifieddate   : [null, Validators.required],
      lastmodifiedbyname : [null, Validators.required],
      filterstring       : [null, Validators.required],
  });

  this.setValues();
}

  ngAfterViewInit() {
    console.log("ngAfterViewInit:");
        
    merge(this.paginatorAccount.page)
    .pipe(
      tap(() => {
        this.loadCompanyDetail("account")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorCompanyType.page)
    .pipe(
      tap(() => {
        this.loadCompanyDetail("companytype")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorUserProfile.page)
    .pipe(
      tap(() => {
        this.loadCompanyDetail("userprofile")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

  }

  loadCompanyDetail(method_string: string) {
    if (method_string == 'account') {
        this.dataSourceAccount.loadCompanyDetail(this.userConncode, this.userID, this.paginatorAccount.pageIndex, this.paginatorAccount.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'companytype') {
        this.dataSourceCompanyType.loadCompanyDetail(this.userConncode, this.userID, this.paginatorCompanyType.pageIndex, this.paginatorCompanyType.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'userprofile') {
        this.dataSourceUserProfile.loadCompanyDetail(this.userConncode, this.userID, this.paginatorUserProfile.pageIndex, this.paginatorUserProfile.pageSize, this.filter_string, `${method_string}_clist`)
    }
  }

  managePageIndex(method_string: string) {
    switch(method_string) {
      case 'account':
        this.paginatorAccount.pageIndex = 0;
      break;

      case 'companytype':
        this.paginatorCompanyType.pageIndex = 0;
      break;

      case 'userprofile':
        this.paginatorUserProfile.pageIndex = 0;
      break;     
    }
  }

  showCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
    let selected_element_id = this.companyForm.get(`${this.method_string}`).value;

    console.log(methodString, this.companyDetailService.company_clist_item[methodString], selected_element_id );

    let clist = this.companyDetailService.company_clist_item[methodString];

    for (let i = 0; i< clist.length; i++) {
      if ( clist[i].id == selected_element_id ) {
        this.companyForm.get('filterstring').setValue(clist[i].name);
        this.filter_string = clist[i].name;
      }
    }

    this.managePageIndex(this.method_string);
    this.loadCompanyDetail(this.method_string);
  }

  clearFilter() {
    console.log(this.filter_string);
    this.filter_string = '';
    this.companyForm.get('filterstring').setValue(this.filter_string);
      // this.paginatorCompany.pageIndex = 0;
      this.managePageIndex(this.method_string);
      this.loadCompanyDetail(this.method_string);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
      this.managePageIndex(this.method_string);
      this.loadCompanyDetail(this.method_string);
    }

    console.log(this.filter_string);
  }

  setValues() {
      this.companyForm.get('name').setValue(this.company.name);
      this.companyForm.get('orgno').setValue(this.company.orgno);
      this.companyForm.get('account').setValue(this.company.accountid);
      this.companyForm.get('companytype').setValue(this.company.companytypeid);
      this.companyForm.get('userprofile').setValue(this.company.userprofileid);

      let created          = this.company? new Date(`${this.company.created}`) : '';
      let deletedwhen      = this.company? new Date(`${this.company.deletedwhen}`) : '';
      let lastmodifieddate = this.company? new Date(`${this.company.lastmodifieddate}`) : '';

      this.companyForm.get('created').setValue(this.dateFormat(created));
      this.companyForm.get('createdbyname').setValue(this.company.createdbyname);
      this.companyForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.companyForm.get('deletedbyname').setValue(this.company.deletedbyname);
      this.companyForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.companyForm.get('lastmodifiedbyname').setValue(this.company.lastmodifiedbyname);

      this.companyForm.get('emailserver').setValue(this.company.emailserver)
      this.companyForm.get('emailsender').setValue(this.company.emailsender)
      this.companyForm.get('emailuser').setValue(this.company.emailuser)
      this.companyForm.get('emailpassword').setValue(this.company.emailpassword)            
      this.companyForm.get('logofile').setValue(this.company.logofile)
      this.companyForm.get('address').setValue(this.company.address)
      this.companyForm.get('country').setValue(this.company.country)
      this.companyForm.get('contactname').setValue(this.company.contactname)
      this.companyForm.get('phone').setValue(this.company.phone)
      this.companyForm.get('email').setValue(this.company.email)
      this.companyForm.get('comments').setValue(this.company.comments)
      this.companyForm.get('billingnote').setValue(this.company.billingnote)
      this.companyForm.get('webstartlat').setValue(this.company.webstartlat)
      this.companyForm.get('webstartlong').setValue(this.company.webstartlong)
      this.companyForm.get('hasprivatelabel').setValue(this.company.hasprivatelabel)

      this.companyForm.get('filterstring').setValue(this.filter_string);

  }

  getValues(dateTime: any, mode: string) {
    this.companyDetail.name                 = this.companyForm.get('name').value || '';
    this.companyDetail.orgno                = this.companyForm.get('orgno').value || '';
    this.companyDetail.accountid            = this.companyForm.get('account').value || 0;
    this.companyDetail.companytypeid        = this.companyForm.get('companytype').value || 0;
    this.companyDetail.userprofileid        = this.companyForm.get('userprofile').value || 0;
    this.companyDetail.emailserver = this.companyForm.get('emailserver').value || '';
    this.companyDetail.emailsender = this.companyForm.get('emailsender').value || '';
    this.companyDetail.emailuser = this.companyForm.get('emailuser').value || '';
    this.companyDetail.emailpassword = this.companyForm.get('emailpassword').value || '';            
    this.companyDetail.logofile = this.companyForm.get('logofile').value || '';
    this.companyDetail.address = this.companyForm.get('address').value || '';
    this.companyDetail.country = this.companyForm.get('country').value || '';
    this.companyDetail.contactname = this.companyForm.get('contactname').value || '';
    this.companyDetail.phone = this.companyForm.get('phone').value || '';
    this.companyDetail.email = this.companyForm.get('email').value || '';
    this.companyDetail.comments = this.companyForm.get('comments').value || '';
    this.companyDetail.billingnote = this.companyForm.get('billingnote').value || '';
    this.companyDetail.webstartlat = this.companyForm.get('webstartlat').value || 0;
    this.companyDetail.webstartlong = this.companyForm.get('webstartlong').value || 0;
    this.companyDetail.hasprivatelabel = this.companyForm.get('hasprivatelabel').value || false;



 
    this.companyDetail.isactive         = this.company.isactive || true;
    this.companyDetail.deletedwhen      = this.company.deletedwhen || '';
    this.companyDetail.deletedby        = this.company.deletedby || 0;

    if( mode  == "save" ) {
      this.companyDetail.id               = this.company.id;
      this.companyDetail.created          = this.company.created;
      this.companyDetail.createdby        = this.company.createdby;
      this.companyDetail.lastmodifieddate = dateTime;
      this.companyDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.companyDetail.id               = 0;
      this.companyDetail.created          = dateTime;
      this.companyDetail.createdby        = this.userID;
      this.companyDetail.lastmodifieddate = dateTime;
      this.companyDetail.lastmodifiedby   = this.userID;
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

  saveCompany(): void {
    console.log("saveCompany");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(this.companyDetail);

    this.companyDetailService.saveCompanyDetail(this.userConncode, this.userID, this.companyDetail)
    .subscribe((result: any) => {
      console.log(result);
      if ((result.responseCode == 200)||(result.responseCode == 100)) {
        alert("Success!");
        this.router.navigate(['admin/companies/companies']);
      }
    });
  }

  addCompany(): void {
    console.log("addCompany");
    let today = new Date().toISOString();
    this.getValues(today, "add");
    console.log(this.companyDetail);

    this.companyDetailService.saveCompanyDetail(this.userConncode, this.userID, this.companyDetail)
    .subscribe((result: any) => {
      console.log(result);
      if ((result.responseCode == 200)||(result.responseCode == 100)) {
        alert("Success!");
        this.router.navigate(['admin/companies/companies']);
      }
    });
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       company: "", flag: flag
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

   // navigatePageEvent() {
  //   // console.log(this.index_number);
  //   // this.paginator.pageIndex = this.dataSource.page_index - 1;
  //   // this.dataSource.loadCompanies(this.user_conncode, 1, this.paginator.pageIndex, this.paginator.pageSize, "company_clist");
  // }
}
