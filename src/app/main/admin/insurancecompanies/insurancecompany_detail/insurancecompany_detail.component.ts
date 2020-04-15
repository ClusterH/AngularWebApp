import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { InsuranceCompanyDetail } from 'app/main/admin/insurancecompanies/model/insurancecompany.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import * as $ from 'jquery';

import { Subject, merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { InsuranceCompanyDetailService } from 'app/main/admin/insurancecompanies/services/insurancecompany_detail.service';
import { InsuranceCompanyDetailDataSource } from "app/main/admin/insurancecompanies/services/insurancecompany_detail.datasource";

import { locale as companiesEnglish } from 'app/main/admin/insurancecompanies/i18n/en';
import { locale as companiesSpanish } from 'app/main/admin/insurancecompanies/i18n/sp';
import { locale as companiesFrench } from 'app/main/admin/insurancecompanies/i18n/fr';
import { locale as companiesPortuguese } from 'app/main/admin/insurancecompanies/i18n/pt';

@Component({
  selector: 'app-insurancecompany-detail',
  templateUrl: './insurancecompany_detail.component.html',
  styleUrls: ['./insurancecompany_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class InsuranceCompanyDetailComponent implements OnInit
{
  insurancecompany_detail: any;
  public insurancecompany: any;
  pageType: string;
  
  userConncode: string;
  userID: number;

  insurancecompanyForm: FormGroup;
  insurancecompanyDetail: InsuranceCompanyDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: InsuranceCompanyDetailDataSource;
  dataSourceAccount: InsuranceCompanyDetailDataSource;
  dataSourceCompanyType: InsuranceCompanyDetailDataSource;
  dataSourceUserProfile: InsuranceCompanyDetailDataSource;

 
  filter_string: string = '';
  method_string: string = '';
  
  @ViewChild(MatPaginator, {static: true})
    paginatorInsuranceCompany: MatPaginator;
  @ViewChild('paginatorAccount', {read: MatPaginator, static: true})
    paginatorAccount: MatPaginator;
  @ViewChild('paginatorCompanyType', {read: MatPaginator, static: true})
    paginatorCompanyType: MatPaginator;
    @ViewChild('paginatorUserProfile', {read: MatPaginator, static: true})
    paginatorUserProfile: MatPaginator;


  constructor(
    // private companiesService: InsuranceCompaniesService,

    private insurancecompanyDetailService: InsuranceCompanyDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(companiesEnglish, companiesSpanish, companiesFrench, companiesPortuguese);

    // this.insurancecompany = this.insurancecompanyDetailService.insurancecompany_detail;
    this.insurancecompany = localStorage.getItem("insurancecompany_detail")? JSON.parse(localStorage.getItem("insurancecompany_detail")) : '';
    console.log(this.insurancecompany);
      if ( this.insurancecompany != '' )
      {
        // this.insurancecompany = JSON.parse(localStorage.getItem("insurancecompany_detail"));
        this.pageType = 'edit';
      }
      else
      {
        console.log(this.insurancecompany);
        this.pageType = 'new';
      }
     
      this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
      this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

      this.filter_string = '';
  }

  ngOnInit(): void {
    console.log(this.insurancecompany);
  
    this.dataSourceAccount        = new InsuranceCompanyDetailDataSource(this.insurancecompanyDetailService);
    this.dataSourceCompanyType       = new InsuranceCompanyDetailDataSource(this.insurancecompanyDetailService);
    this.dataSourceUserProfile       = new InsuranceCompanyDetailDataSource(this.insurancecompanyDetailService);

    this.dataSourceAccount.loadInsuranceCompanyDetail(this.userConncode, this.userID, 0, 10, this.insurancecompany.account, "account_clist");
    this.dataSourceCompanyType.loadInsuranceCompanyDetail(this.userConncode, this.userID, 0, 10, this.insurancecompany.companytype, "companytype_clist");
    this.dataSourceUserProfile.loadInsuranceCompanyDetail(this.userConncode, this.userID, 0, 10, this.insurancecompany.userprofile, "userprofile_clist");
    
    this.insurancecompanyForm = this._formBuilder.group({
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
        this.loadInsuranceCompanyDetail("account")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorCompanyType.page)
    .pipe(
      tap(() => {
        this.loadInsuranceCompanyDetail("companytype")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorUserProfile.page)
    .pipe(
      tap(() => {
        this.loadInsuranceCompanyDetail("userprofile")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

  }

  loadInsuranceCompanyDetail(method_string: string) {
    if (method_string == 'account') {
        this.dataSourceAccount.loadInsuranceCompanyDetail(this.userConncode, this.userID, this.paginatorAccount.pageIndex, this.paginatorAccount.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'companytype') {
        this.dataSourceCompanyType.loadInsuranceCompanyDetail(this.userConncode, this.userID, this.paginatorCompanyType.pageIndex, this.paginatorCompanyType.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'userprofile') {
        this.dataSourceUserProfile.loadInsuranceCompanyDetail(this.userConncode, this.userID, this.paginatorUserProfile.pageIndex, this.paginatorUserProfile.pageSize, this.filter_string, `${method_string}_clist`)
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

  showInsuranceCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
    let selected_element_id = this.insurancecompanyForm.get(`${this.method_string}`).value;

    console.log(methodString, this.insurancecompanyDetailService.insurancecompany_clist_item[methodString], selected_element_id );

    let clist = this.insurancecompanyDetailService.insurancecompany_clist_item[methodString];

    for (let i = 0; i< clist.length; i++) {
      if ( clist[i].id == selected_element_id ) {
        this.insurancecompanyForm.get('filterstring').setValue(clist[i].name);
        this.filter_string = clist[i].name;
      }
    }

    this.managePageIndex(this.method_string);
    this.loadInsuranceCompanyDetail(this.method_string);
  }

  clearFilter() {
    console.log(this.filter_string);
    this.filter_string = '';
    this.insurancecompanyForm.get('filterstring').setValue(this.filter_string);
      // this.paginatorInsuranceCompany.pageIndex = 0;
      this.managePageIndex(this.method_string);
      this.loadInsuranceCompanyDetail(this.method_string);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
      this.managePageIndex(this.method_string);
      this.loadInsuranceCompanyDetail(this.method_string);
    }

    console.log(this.filter_string);
  }

  setValues() {
      this.insurancecompanyForm.get('name').setValue(this.insurancecompany.name);
      this.insurancecompanyForm.get('orgno').setValue(this.insurancecompany.orgno);
      this.insurancecompanyForm.get('account').setValue(this.insurancecompany.accountid);
      this.insurancecompanyForm.get('companytype').setValue(this.insurancecompany.companytypeid);
      this.insurancecompanyForm.get('userprofile').setValue(this.insurancecompany.userprofileid);

      let created          = this.insurancecompany? new Date(`${this.insurancecompany.created}`) : '';
      let deletedwhen      = this.insurancecompany? new Date(`${this.insurancecompany.deletedwhen}`) : '';
      let lastmodifieddate = this.insurancecompany? new Date(`${this.insurancecompany.lastmodifieddate}`) : '';

      this.insurancecompanyForm.get('created').setValue(this.dateFormat(created));
      this.insurancecompanyForm.get('createdbyname').setValue(this.insurancecompany.createdbyname);
      this.insurancecompanyForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.insurancecompanyForm.get('deletedbyname').setValue(this.insurancecompany.deletedbyname);
      this.insurancecompanyForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.insurancecompanyForm.get('lastmodifiedbyname').setValue(this.insurancecompany.lastmodifiedbyname);

      this.insurancecompanyForm.get('emailserver').setValue(this.insurancecompany.emailserver)
      this.insurancecompanyForm.get('emailsender').setValue(this.insurancecompany.emailsender)
      this.insurancecompanyForm.get('emailuser').setValue(this.insurancecompany.emailuser)
      this.insurancecompanyForm.get('emailpassword').setValue(this.insurancecompany.emailpassword)            
      this.insurancecompanyForm.get('logofile').setValue(this.insurancecompany.logofile)
      this.insurancecompanyForm.get('address').setValue(this.insurancecompany.address)
      this.insurancecompanyForm.get('country').setValue(this.insurancecompany.country)
      this.insurancecompanyForm.get('contactname').setValue(this.insurancecompany.contactname)
      this.insurancecompanyForm.get('phone').setValue(this.insurancecompany.phone)
      this.insurancecompanyForm.get('email').setValue(this.insurancecompany.email)
      this.insurancecompanyForm.get('comments').setValue(this.insurancecompany.comments)
      this.insurancecompanyForm.get('billingnote').setValue(this.insurancecompany.billingnote)
      this.insurancecompanyForm.get('webstartlat').setValue(this.insurancecompany.webstartlat)
      this.insurancecompanyForm.get('webstartlong').setValue(this.insurancecompany.webstartlong)
      this.insurancecompanyForm.get('hasprivatelabel').setValue(this.insurancecompany.hasprivatelabel)

      this.insurancecompanyForm.get('filterstring').setValue(this.filter_string);

  }

  getValues(dateTime: any, mode: string) {
    this.insurancecompanyDetail.name                 = this.insurancecompanyForm.get('name').value || '';
    this.insurancecompanyDetail.orgno                = this.insurancecompanyForm.get('orgno').value || '';
    this.insurancecompanyDetail.accountid            = this.insurancecompanyForm.get('account').value || 0;
    this.insurancecompanyDetail.companytypeid        = this.insurancecompanyForm.get('companytype').value || 0;
    this.insurancecompanyDetail.userprofileid        = this.insurancecompanyForm.get('userprofile').value || 0;
    this.insurancecompanyDetail.emailserver = this.insurancecompanyForm.get('emailserver').value || '';
    this.insurancecompanyDetail.emailsender = this.insurancecompanyForm.get('emailsender').value || '';
    this.insurancecompanyDetail.emailuser = this.insurancecompanyForm.get('emailuser').value || '';
    this.insurancecompanyDetail.emailpassword = this.insurancecompanyForm.get('emailpassword').value || '';            
    this.insurancecompanyDetail.logofile = this.insurancecompanyForm.get('logofile').value || '';
    this.insurancecompanyDetail.address = this.insurancecompanyForm.get('address').value || '';
    this.insurancecompanyDetail.country = this.insurancecompanyForm.get('country').value || '';
    this.insurancecompanyDetail.contactname = this.insurancecompanyForm.get('contactname').value || '';
    this.insurancecompanyDetail.phone = this.insurancecompanyForm.get('phone').value || '';
    this.insurancecompanyDetail.email = this.insurancecompanyForm.get('email').value || '';
    this.insurancecompanyDetail.comments = this.insurancecompanyForm.get('comments').value || '';
    this.insurancecompanyDetail.billingnote = this.insurancecompanyForm.get('billingnote').value || '';
    this.insurancecompanyDetail.webstartlat = this.insurancecompanyForm.get('webstartlat').value || 0;
    this.insurancecompanyDetail.webstartlong = this.insurancecompanyForm.get('webstartlong').value || 0;
    this.insurancecompanyDetail.hasprivatelabel = this.insurancecompanyForm.get('hasprivatelabel').value || false;



 
    this.insurancecompanyDetail.isactive         = this.insurancecompany.isactive || true;
    this.insurancecompanyDetail.deletedwhen      = this.insurancecompany.deletedwhen || '';
    this.insurancecompanyDetail.deletedby        = this.insurancecompany.deletedby || 0;

    if( mode  == "save" ) {
      this.insurancecompanyDetail.id               = this.insurancecompany.id;
      this.insurancecompanyDetail.created          = this.insurancecompany.created;
      this.insurancecompanyDetail.createdby        = this.insurancecompany.createdby;
      this.insurancecompanyDetail.lastmodifieddate = dateTime;
      this.insurancecompanyDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.insurancecompanyDetail.id               = 0;
      this.insurancecompanyDetail.created          = dateTime;
      this.insurancecompanyDetail.createdby        = this.userID;
      this.insurancecompanyDetail.lastmodifieddate = dateTime;
      this.insurancecompanyDetail.lastmodifiedby   = this.userID;
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

  saveInsuranceCompany(): void {
    console.log("saveInsuranceCompany");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(this.insurancecompanyDetail);

    this.insurancecompanyDetailService.saveInsuranceCompanyDetail(this.userConncode, this.userID, this.insurancecompanyDetail)
    .subscribe((result: any) => {
      console.log(result);
      if (result.responseCode == 200) {
        alert("Success!");
        this.router.navigate(['admin/insurancecompanies/insurancecompanies']);
      }
    });
  }

  addInsuranceCompany(): void {
    console.log("addInsuranceCompany");
    let today = new Date().toISOString();
    this.getValues(today, "add");
    console.log(this.insurancecompanyDetail);

    this.insurancecompanyDetailService.saveInsuranceCompanyDetail(this.userConncode, this.userID, this.insurancecompanyDetail)
    .subscribe((result: any) => {
      console.log(result);
      if (result.responseCode == 200) {
        alert("Success!");
        this.router.navigate(['admin/insurancecompanies/insurancecompanies']);
      }
    });
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       insurancecompany: "", flag: flag
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
  //   // this.dataSource.loadInsuranceCompanies(this.userconncode, 1, this.paginator.pageIndex, this.paginator.pageSize, "insurancecompany_clist");
  // }
}
