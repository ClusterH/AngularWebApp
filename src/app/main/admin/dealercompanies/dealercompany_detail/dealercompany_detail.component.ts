import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { DealerCompanyDetail } from 'app/main/admin/dealercompanies/model/dealercompany.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import * as $ from 'jquery';

import { Subject, merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { DealerCompanyDetailService } from 'app/main/admin/dealercompanies/services/dealercompany_detail.service';
import { DealerCompanyDetailDataSource } from "app/main/admin/dealercompanies/services/dealercompany_detail.datasource";

import { locale as companiesEnglish } from 'app/main/admin/dealercompanies/i18n/en';
import { locale as companiesSpanish } from 'app/main/admin/dealercompanies/i18n/sp';
import { locale as companiesFrench } from 'app/main/admin/dealercompanies/i18n/fr';
import { locale as companiesPortuguese } from 'app/main/admin/dealercompanies/i18n/pt';

@Component({
  selector: 'app-dealercompany-detail',
  templateUrl: './dealercompany_detail.component.html',
  styleUrls: ['./dealercompany_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class DealerCompanyDetailComponent implements OnInit
{
  dealercompany_detail: any;
  public dealercompany: any;
  pageType: string;

  dealercompanyForm: FormGroup;
  dealercompanyDetail: DealerCompanyDetail = {};

  displayedColumns: string[] = ['name'];
  
  userConncode: string;
  userID: number;

  dataSource: DealerCompanyDetailDataSource;
  dataSourceAccount: DealerCompanyDetailDataSource;
  dataSourceCompanyType: DealerCompanyDetailDataSource;
  dataSourceUserProfile: DealerCompanyDetailDataSource;

 
  filter_string: string = '';
  method_string: string = '';
  
  @ViewChild(MatPaginator, {static: true})
    paginatorDealerCompany: MatPaginator;
  @ViewChild('paginatorAccount', {read: MatPaginator, static: true})
    paginatorAccount: MatPaginator;
  @ViewChild('paginatorCompanyType', {read: MatPaginator, static: true})
    paginatorCompanyType: MatPaginator;
    @ViewChild('paginatorUserProfile', {read: MatPaginator, static: true})
    paginatorUserProfile: MatPaginator;


  constructor(
    // private companiesService: DealerCompaniesService,

    private dealercompanyDetailService: DealerCompanyDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(companiesEnglish, companiesSpanish, companiesFrench, companiesPortuguese);

    // this.dealercompany = this.dealercompanyDetailService.dealercompany_detail;
    this.dealercompany = localStorage.getItem("dealercompany_detail")? JSON.parse(localStorage.getItem("dealercompany_detail")) : '';
    console.log(this.dealercompany);
      if ( this.dealercompany != '' )
      {
        // this.dealercompany = JSON.parse(localStorage.getItem("dealercompany_detail"));
        this.pageType = 'edit';
      }
      else
      {
        console.log(this.dealercompany);
        this.pageType = 'new';
      }

      this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
      this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

      this.filter_string = '';
  }

  ngOnInit(): void {
    console.log(this.dealercompany);
  
    this.dataSourceAccount        = new DealerCompanyDetailDataSource(this.dealercompanyDetailService);
    this.dataSourceCompanyType       = new DealerCompanyDetailDataSource(this.dealercompanyDetailService);
    this.dataSourceUserProfile       = new DealerCompanyDetailDataSource(this.dealercompanyDetailService);

    this.dataSourceAccount.loadDealerCompanyDetail(this.userConncode, this.userID, 0, 10, this.dealercompany.account, "account_clist");
    this.dataSourceCompanyType.loadDealerCompanyDetail(this.userConncode, this.userID, 0, 10, this.dealercompany.companytype, "companytype_clist");
    this.dataSourceUserProfile.loadDealerCompanyDetail(this.userConncode, this.userID, 0, 10, this.dealercompany.userprofile, "userprofile_clist");
    
    this.dealercompanyForm = this._formBuilder.group({
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
        this.loadDealerCompanyDetail("account")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorCompanyType.page)
    .pipe(
      tap(() => {
        this.loadDealerCompanyDetail("companytype")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorUserProfile.page)
    .pipe(
      tap(() => {
        this.loadDealerCompanyDetail("userprofile")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

  }

  loadDealerCompanyDetail(method_string: string) {
    if (method_string == 'account') {
        this.dataSourceAccount.loadDealerCompanyDetail(this.userConncode, this.userID, this.paginatorAccount.pageIndex, this.paginatorAccount.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'companytype') {
        this.dataSourceCompanyType.loadDealerCompanyDetail(this.userConncode, this.userID, this.paginatorCompanyType.pageIndex, this.paginatorCompanyType.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'userprofile') {
        this.dataSourceUserProfile.loadDealerCompanyDetail(this.userConncode, this.userID, this.paginatorUserProfile.pageIndex, this.paginatorUserProfile.pageSize, this.filter_string, `${method_string}_clist`)
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

  showDealerCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
    let selected_element_id = this.dealercompanyForm.get(`${this.method_string}`).value;

    console.log(methodString, this.dealercompanyDetailService.dealercompany_clist_item[methodString], selected_element_id );

    let clist = this.dealercompanyDetailService.dealercompany_clist_item[methodString];

    for (let i = 0; i< clist.length; i++) {
      if ( clist[i].id == selected_element_id ) {
        this.dealercompanyForm.get('filterstring').setValue(clist[i].name);
        this.filter_string = clist[i].name;
      }
    }

    this.managePageIndex(this.method_string);
    this.loadDealerCompanyDetail(this.method_string);
  }

  clearFilter() {
    console.log(this.filter_string);
    this.filter_string = '';
    this.dealercompanyForm.get('filterstring').setValue(this.filter_string);
      // this.paginatorDealerCompany.pageIndex = 0;
      this.managePageIndex(this.method_string);
      this.loadDealerCompanyDetail(this.method_string);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
      this.managePageIndex(this.method_string);
      this.loadDealerCompanyDetail(this.method_string);
    }

    console.log(this.filter_string);
  }

  setValues() {
      this.dealercompanyForm.get('name').setValue(this.dealercompany.name);
      this.dealercompanyForm.get('orgno').setValue(this.dealercompany.orgno);
      this.dealercompanyForm.get('account').setValue(this.dealercompany.accountid);
      this.dealercompanyForm.get('companytype').setValue(this.dealercompany.companytypeid);
      this.dealercompanyForm.get('userprofile').setValue(this.dealercompany.userprofileid);

      let created          = this.dealercompany? new Date(`${this.dealercompany.created}`) : '';
      let deletedwhen      = this.dealercompany? new Date(`${this.dealercompany.deletedwhen}`) : '';
      let lastmodifieddate = this.dealercompany? new Date(`${this.dealercompany.lastmodifieddate}`) : '';

      this.dealercompanyForm.get('created').setValue(this.dateFormat(created));
      this.dealercompanyForm.get('createdbyname').setValue(this.dealercompany.createdbyname);
      this.dealercompanyForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.dealercompanyForm.get('deletedbyname').setValue(this.dealercompany.deletedbyname);
      this.dealercompanyForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.dealercompanyForm.get('lastmodifiedbyname').setValue(this.dealercompany.lastmodifiedbyname);

      this.dealercompanyForm.get('emailserver').setValue(this.dealercompany.emailserver)
      this.dealercompanyForm.get('emailsender').setValue(this.dealercompany.emailsender)
      this.dealercompanyForm.get('emailuser').setValue(this.dealercompany.emailuser)
      this.dealercompanyForm.get('emailpassword').setValue(this.dealercompany.emailpassword)            
      this.dealercompanyForm.get('logofile').setValue(this.dealercompany.logofile)
      this.dealercompanyForm.get('address').setValue(this.dealercompany.address)
      this.dealercompanyForm.get('country').setValue(this.dealercompany.country)
      this.dealercompanyForm.get('contactname').setValue(this.dealercompany.contactname)
      this.dealercompanyForm.get('phone').setValue(this.dealercompany.phone)
      this.dealercompanyForm.get('email').setValue(this.dealercompany.email)
      this.dealercompanyForm.get('comments').setValue(this.dealercompany.comments)
      this.dealercompanyForm.get('billingnote').setValue(this.dealercompany.billingnote)
      this.dealercompanyForm.get('webstartlat').setValue(this.dealercompany.webstartlat)
      this.dealercompanyForm.get('webstartlong').setValue(this.dealercompany.webstartlong)
      this.dealercompanyForm.get('hasprivatelabel').setValue(this.dealercompany.hasprivatelabel)

      this.dealercompanyForm.get('filterstring').setValue(this.filter_string);

  }

  getValues(dateTime: any, mode: string) {
    this.dealercompanyDetail.name                 = this.dealercompanyForm.get('name').value || '';
    this.dealercompanyDetail.orgno                = this.dealercompanyForm.get('orgno').value || '';
    this.dealercompanyDetail.accountid            = this.dealercompanyForm.get('account').value || 0;
    this.dealercompanyDetail.companytypeid        = this.dealercompanyForm.get('companytype').value || 0;
    this.dealercompanyDetail.userprofileid        = this.dealercompanyForm.get('userprofile').value || 0;
    this.dealercompanyDetail.emailserver = this.dealercompanyForm.get('emailserver').value || '';
    this.dealercompanyDetail.emailsender = this.dealercompanyForm.get('emailsender').value || '';
    this.dealercompanyDetail.emailuser = this.dealercompanyForm.get('emailuser').value || '';
    this.dealercompanyDetail.emailpassword = this.dealercompanyForm.get('emailpassword').value || '';            
    this.dealercompanyDetail.logofile = this.dealercompanyForm.get('logofile').value || '';
    this.dealercompanyDetail.address = this.dealercompanyForm.get('address').value || '';
    this.dealercompanyDetail.country = this.dealercompanyForm.get('country').value || '';
    this.dealercompanyDetail.contactname = this.dealercompanyForm.get('contactname').value || '';
    this.dealercompanyDetail.phone = this.dealercompanyForm.get('phone').value || '';
    this.dealercompanyDetail.email = this.dealercompanyForm.get('email').value || '';
    this.dealercompanyDetail.comments = this.dealercompanyForm.get('comments').value || '';
    this.dealercompanyDetail.billingnote = this.dealercompanyForm.get('billingnote').value || '';
    this.dealercompanyDetail.webstartlat = this.dealercompanyForm.get('webstartlat').value || 0;
    this.dealercompanyDetail.webstartlong = this.dealercompanyForm.get('webstartlong').value || 0;
    this.dealercompanyDetail.hasprivatelabel = this.dealercompanyForm.get('hasprivatelabel').value || false;
 
    this.dealercompanyDetail.isactive         = this.dealercompany.isactive || true;
    this.dealercompanyDetail.deletedwhen      = this.dealercompany.deletedwhen || '';
    this.dealercompanyDetail.deletedby        = this.dealercompany.deletedby || 0;

    if( mode  == "save" ) {
      this.dealercompanyDetail.id               = this.dealercompany.id;
      this.dealercompanyDetail.created          = this.dealercompany.created;
      this.dealercompanyDetail.createdby        = this.dealercompany.createdby;
      this.dealercompanyDetail.lastmodifieddate = dateTime;
      this.dealercompanyDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.dealercompanyDetail.id               = 0;
      this.dealercompanyDetail.created          = dateTime;
      this.dealercompanyDetail.createdby        = this.userID;
      this.dealercompanyDetail.lastmodifieddate = dateTime;
      this.dealercompanyDetail.lastmodifiedby   = this.userID;
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

  saveDealerCompany(): void {
    console.log("saveDealerCompany");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(this.dealercompanyDetail);
    if (this.dealercompanyDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.dealercompanyDetailService.saveDealerCompanyDetail(this.userConncode, this.userID, this.dealercompanyDetail)
      .subscribe((result: any) => {
        console.log(result);
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['admin/dealercompanies/dealercompanies']);
        }
      });
    }
  }

  addDealerCompany(): void {
    console.log("addDealerCompany");
    let today = new Date().toISOString();
    this.getValues(today, "add");
    console.log(this.dealercompanyDetail);
    if (this.dealercompanyDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.dealercompanyDetailService.saveDealerCompanyDetail(this.userConncode, this.userID, this.dealercompanyDetail)
      .subscribe((result: any) => {
        console.log(result);
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['admin/dealercompanies/dealercompanies']);
        }
      });
    }
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       dealercompany: "", flag: flag
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
  //   // this.dataSource.loadDealerCompanies(this.userConncode, 1, this.paginator.pageIndex, this.paginator.pageSize, "dealercompany_clist");
  // }
}
