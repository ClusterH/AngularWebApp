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
  user_conncode: string;
  user_id: number;

  companyForm: FormGroup;
  companyDetail: CompanyDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: CompanyDetailDataSource;

  dataSourceCompany: CompanyDetailDataSource;
  dataSourceGroup: CompanyDetailDataSource;
  dataSourceAccount: CompanyDetailDataSource;
  dataSourceOperator: CompanyDetailDataSource;
  dataSourceUnitType: CompanyDetailDataSource;
  dataSourceServicePlan: CompanyDetailDataSource;
  dataSourceProductType: CompanyDetailDataSource;
  dataSourceMake: CompanyDetailDataSource;
  dataSourceModel: CompanyDetailDataSource;
  dataSourceTimeZone: CompanyDetailDataSource;
 
  filter_string: string = '';
  method_string: string = '';
  
  @ViewChild(MatPaginator, {static: true})
    paginatorCompany: MatPaginator;
  @ViewChild('paginatorGroup', {read: MatPaginator, static: true})
    paginatorGroup: MatPaginator;
  @ViewChild('paginatorAccount', {read: MatPaginator, static: true})
    paginatorAccount: MatPaginator;
  @ViewChild('paginatorOperator', {read: MatPaginator, static: true})
    paginatorOperator: MatPaginator;
  @ViewChild('paginatorUnitType', {read: MatPaginator, static: true})
    paginatorUnitType: MatPaginator;
  @ViewChild('paginatorServicePlan', {read: MatPaginator, static: true})
    paginatorServicePlan: MatPaginator;
  @ViewChild('paginatorProductType', {read: MatPaginator, static: true})
    paginatorProductType: MatPaginator;
  @ViewChild('paginatorMake', {read: MatPaginator, static: true})
    paginatorMake: MatPaginator;
  @ViewChild('paginatorModel', {read: MatPaginator, static: true})
    paginatorModel: MatPaginator;
  @ViewChild('paginatorTimeZone', {read: MatPaginator, static: true})
    paginatorTimeZone: MatPaginator;

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

      this.user_conncode = "PolarixUSA";
      this.user_id = 2;

      this.filter_string = '';
  }

  ngOnInit(): void {
    console.log(this.company);
  
    this.dataSourceCompany        = new CompanyDetailDataSource(this.companyDetailService);
    this.dataSourceGroup          = new CompanyDetailDataSource(this.companyDetailService);
    this.dataSourceAccount        = new CompanyDetailDataSource(this.companyDetailService);
    this.dataSourceOperator       = new CompanyDetailDataSource(this.companyDetailService);
    this.dataSourceUnitType       = new CompanyDetailDataSource(this.companyDetailService);
    this.dataSourceServicePlan    = new CompanyDetailDataSource(this.companyDetailService);
    this.dataSourceProductType    = new CompanyDetailDataSource(this.companyDetailService);
    this.dataSourceMake           = new CompanyDetailDataSource(this.companyDetailService);
    this.dataSourceModel          = new CompanyDetailDataSource(this.companyDetailService);
    this.dataSourceTimeZone       = new CompanyDetailDataSource(this.companyDetailService);

    this.dataSourceCompany      .loadCompanyDetail(this.user_conncode, this.user_id, 0, 10, this.company.company, "company_clist");
    this.dataSourceGroup        .loadCompanyDetail(this.user_conncode, this.user_id, 0, 10, this.company.group, "group_clist");
    this.dataSourceAccount      .loadCompanyDetail(this.user_conncode, this.user_id, 0, 10, this.company.account, "account_clist");
    this.dataSourceOperator     .loadCompanyDetail(this.user_conncode, this.user_id, 0, 10, this.company.operator, "operator_clist");
    this.dataSourceUnitType     .loadCompanyDetail(this.user_conncode, this.user_id, 0, 10, this.company.unittype, "unittype_clist");
    this.dataSourceServicePlan  .loadCompanyDetail(this.user_conncode, this.user_id, 0, 10, this.company.serviceplan, "serviceplan_clist");
    this.dataSourceProductType  .loadCompanyDetail(this.user_conncode, this.user_id, 0, 10, this.company.producttype, "producttype_clist");
    this.dataSourceMake         .loadCompanyDetail(this.user_conncode, this.user_id, 0, 10, this.company.make, "make_clist");
    this.dataSourceModel        .loadCompanyDetail(this.user_conncode, this.user_id, 0, 10, this.company.model, "model_clist");
    this.dataSourceTimeZone     .loadCompanyDetail(this.user_conncode, this.user_id, 0, 10, this.company.timezone, "timezone_clist");

    this.companyForm = this._formBuilder.group({
      name               : [null, Validators.required],
      company            : [null, Validators.required],
      group              : [null, Validators.required],
      subgroup           : [null, Validators.required],
      account            : [null, Validators.required],
      operator           : [null, Validators.required],
      unittype           : [null, Validators.required],
      serviceplan        : [null, Validators.required],
      producttype        : [null, Validators.required],
      make               : [null, Validators.required],
      model              : [null, Validators.required],
      isactive           : [null, Validators.required],
      timezone           : [null, Validators.required],
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
    
    merge(this.paginatorCompany.page)
    .pipe(
      tap(() => {
        this.loadCompanyDetail("company")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorGroup.page)
    .pipe(
      tap(() => {
        this.loadCompanyDetail("group")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorAccount.page)
    .pipe(
      tap(() => {
        this.loadCompanyDetail("account")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorOperator.page)
    .pipe(
      tap(() => {
        this.loadCompanyDetail("operator")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorUnitType.page)
    .pipe(
      tap(() => {
        this.loadCompanyDetail("unittype")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorServicePlan.page)
    .pipe(
      tap(() => {
        this.loadCompanyDetail("serviceplan")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorProductType.page)
    .pipe(
      tap(() => {
        this.loadCompanyDetail("producttype")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorMake.page)
    .pipe(
      tap(() => {
        this.loadCompanyDetail("make")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorModel.page)
    .pipe(
      tap(() => {
        this.loadCompanyDetail("model")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorTimeZone.page)
    .pipe(
      tap(() => {
        this.loadCompanyDetail("timezone")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });
  }

  loadCompanyDetail(method_string: string) {
    if (method_string == 'company') {
      this.dataSourceCompany.loadCompanyDetail(this.user_conncode, this.user_id, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'group') {
        this.dataSourceGroup.loadCompanyDetail(this.user_conncode, this.user_id, this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'active') {
        this.dataSourceAccount.loadCompanyDetail(this.user_conncode, this.user_id, this.paginatorAccount.pageIndex, this.paginatorAccount.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'operator') {
        this.dataSourceOperator.loadCompanyDetail(this.user_conncode, this.user_id, this.paginatorOperator.pageIndex, this.paginatorOperator.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'unittype') {
        this.dataSourceUnitType.loadCompanyDetail(this.user_conncode, this.user_id, this.paginatorUnitType.pageIndex, this.paginatorUnitType.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'serviceplan') {
        this.dataSourceServicePlan.loadCompanyDetail(this.user_conncode, this.user_id, this.paginatorServicePlan.pageIndex, this.paginatorServicePlan.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'producttype') {
        this.dataSourceProductType.loadCompanyDetail(this.user_conncode, this.user_id, this.paginatorProductType.pageIndex, this.paginatorProductType.pageSize, "", `${method_string}_clist`)
    } else if (method_string == 'make') {
        this.dataSourceMake.loadCompanyDetail(this.user_conncode, this.user_id, this.paginatorMake.pageIndex, this.paginatorMake.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'model') {
        this.dataSourceModel.loadCompanyDetail(this.user_conncode, this.user_id, this.paginatorModel.pageIndex, this.paginatorModel.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'timezone') {
        this.dataSourceTimeZone.loadCompanyDetail(this.user_conncode, this.user_id, this.paginatorTimeZone.pageIndex, this.paginatorTimeZone.pageSize, this.filter_string, `${method_string}_clist`)
    }
  }

  managePageIndex(method_string: string) {
    switch(method_string) {
      case 'company':
        this.paginatorCompany.pageIndex = 0;
      break;

      case 'account':
        this.paginatorAccount.pageIndex = 0;
      break;

      case 'group':
        this.paginatorGroup.pageIndex = 0;
      break;

      case 'operator':
        this.paginatorOperator.pageIndex = 0;
      break;

      case 'unittype':
        this.paginatorUnitType.pageIndex = 0;
      break;

      case 'serviceplan':
        this.paginatorServicePlan.pageIndex = 0;
      break;

      case 'producttype':
        this.paginatorProductType.pageIndex = 0;
      break;

      case 'make':
        this.paginatorMake.pageIndex = 0;
      break;

      case 'model':
        this.paginatorModel.pageIndex = 0;
      break;

      case 'timezone':
        this.paginatorTimeZone.pageIndex = 0;
      break;
    }
  }

  showCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
    let selected_element_id = this.companyForm.get(`${this.method_string}`).value;

    console.log(methodString, this.companyDetailService.unit_clist_item[methodString], selected_element_id );

    let clist = this.companyDetailService.unit_clist_item[methodString];

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
      this.companyForm.get('company').setValue(this.company.companyid);
      this.companyForm.get('group').setValue(this.company.groupid);
      this.companyForm.get('account').setValue(this.company.accountid);
      this.companyForm.get('operator').setValue(this.company.operatorid);
      this.companyForm.get('unittype').setValue(this.company.unittypeid);
      this.companyForm.get('serviceplan').setValue(this.company.serviceplanid);
      this.companyForm.get('producttype').setValue(this.company.producttypeid);
      this.companyForm.get('make').setValue(this.company.makeid);
      this.companyForm.get('model').setValue(this.company.modelid);
      this.companyForm.get('timezone').setValue(this.company.timezoneid);

      let created          = this.company? new Date(`${this.company.created}`) : '';
      let deletedwhen      = this.company? new Date(`${this.company.deletedwhen}`) : '';
      let lastmodifieddate = this.company? new Date(`${this.company.lastmodifieddate}`) : '';

      this.companyForm.get('created').setValue(this.dateFormat(created));
      this.companyForm.get('createdbyname').setValue(this.company.createdbyname);
      this.companyForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.companyForm.get('deletedbyname').setValue(this.company.deletedbyname);
      this.companyForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.companyForm.get('lastmodifiedbyname').setValue(this.company.lastmodifiedbyname);
      this.companyForm.get('filterstring').setValue(this.filter_string);
  }

  getValues(dateTime: any, mode: string) {
    this.companyDetail.name             = this.companyForm.get('name').value || '',
    this.companyDetail.companyid        = this.companyForm.get('company').value || 0;
    this.companyDetail.groupid          = this.companyForm.get('group').value || 0;
    this.companyDetail.accountid        = this.companyForm.get('account').value || 0;
    this.companyDetail.operatorid       = this.companyForm.get('operator').value || 0;
    this.companyDetail.unittypeid       = this.companyForm.get('unittype').value || 0;
    this.companyDetail.serviceplanid    = this.companyForm.get('serviceplan').value || 0;
    this.companyDetail.producttypeid    = this.companyForm.get('producttype').value || 0;
    this.companyDetail.makeid           = this.companyForm.get('make').value || 0;
    this.companyDetail.modelid          = this.companyForm.get('model').value || 0;
    this.companyDetail.timezoneid       = this.companyForm.get('timezone').value || 0;
 
    this.companyDetail.subgroup         = this.company.subgroup || 0;
    this.companyDetail.isactive         = this.company.isactive || true;
    this.companyDetail.deletedwhen      = this.company.deletedwhen || '';
    this.companyDetail.deletedby        = this.company.deletedby || 0;

    if( mode  == "save" ) {
      this.companyDetail.id               = this.company.id;
      this.companyDetail.created          = this.company.created;
      this.companyDetail.createdby        = this.company.createdby;
      this.companyDetail.lastmodifieddate = dateTime;
      this.companyDetail.lastmodifiedby   = this.user_id;
    } else if ( mode == "add" ) {
      this.companyDetail.id               = 0;
      this.companyDetail.created          = dateTime;
      this.companyDetail.createdby        = this.user_id;
      this.companyDetail.lastmodifieddate = dateTime;
      this.companyDetail.lastmodifiedby   = this.user_id;
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

    this.companyDetailService.saveCompanyDetail(this.user_conncode, this.user_id, this.companyDetail)
    .subscribe((result: any) => {
      console.log(result);
      if (result.responseCode == 200) {
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

    this.companyDetailService.saveCompanyDetail(this.user_conncode, this.user_id, this.companyDetail)
    .subscribe((result: any) => {
      console.log(result);
      if (result.responseCode == 200) {
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
