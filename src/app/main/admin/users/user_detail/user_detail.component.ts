import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { UserDetail } from 'app/main/admin/users/model/user.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import * as $ from 'jquery';

import { Subject, merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { UserDetailService } from 'app/main/admin/users/services/user_detail.service';
import { UserDetailDataSource } from "app/main/admin/users/services/user_detail.datasource";
import { AuthService } from 'app/authentication/services/authentication.service';

import { locale as usersEnglish } from 'app/main/admin/users/i18n/en';
import { locale as usersSpanish } from 'app/main/admin/users/i18n/sp';
import { locale as usersFrench } from 'app/main/admin/users/i18n/fr';
import { locale as usersPortuguese } from 'app/main/admin/users/i18n/pt';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user_detail.component.html',
  styleUrls: ['./user_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class UserDetailComponent implements OnInit
{
  user_detail: any;
  public user: any;
  pageType: string;
  userConncode: string;
  userID: number;

  userModel_flag: boolean;

  userForm: FormGroup;
  userDetail: UserDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: UserDetailDataSource;

  dataSourceCompany:     UserDetailDataSource;
  dataSourceGroup:       UserDetailDataSource;
  dataSourceAccount:     UserDetailDataSource;
  dataSourceOperator:    UserDetailDataSource;
  dataSourceUnitType:    UserDetailDataSource;
  dataSourceServicePlan: UserDetailDataSource;
  dataSourceProductType: UserDetailDataSource;
  dataSourceMake:        UserDetailDataSource;
  dataSourceModel:       UserDetailDataSource;
  dataSourceTimeZone:    UserDetailDataSource;
 
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
  @ViewChild('paginatorModel', {read: MatPaginator})
    paginatorModel: MatPaginator;
  @ViewChild('paginatorTimeZone', {read: MatPaginator, static: true})
    paginatorTimeZone: MatPaginator;

  constructor(
    public userDetailService: UserDetailService,
    private authService: AuthService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(usersEnglish, usersSpanish, usersFrench, usersPortuguese);

    this.user = sessionStorage.getItem("user_detail")? JSON.parse(sessionStorage.getItem("user_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.user != '' )
    {
      this.userDetailService.current_makeID = this.user.makeid;
      this.userModel_flag = true;
      console.log("makeid: ", this.userDetailService.current_makeID);
      this.pageType = 'edit';
    }
    else
    {
      console.log(this.user);
      this.userDetailService.current_makeID = 0;
      this.userModel_flag = false;

      this.pageType = 'new';
    }

    this.filter_string = '';
  }

  ngOnInit(): void {
    console.log(this.user);
  
    this.dataSourceCompany        = new UserDetailDataSource(this.userDetailService);
    this.dataSourceGroup          = new UserDetailDataSource(this.userDetailService);
    this.dataSourceAccount        = new UserDetailDataSource(this.userDetailService);
    this.dataSourceOperator       = new UserDetailDataSource(this.userDetailService);
    this.dataSourceUnitType       = new UserDetailDataSource(this.userDetailService);
    this.dataSourceServicePlan    = new UserDetailDataSource(this.userDetailService);
    this.dataSourceProductType    = new UserDetailDataSource(this.userDetailService);
    this.dataSourceMake           = new UserDetailDataSource(this.userDetailService);
    this.dataSourceModel          = new UserDetailDataSource(this.userDetailService);
    this.dataSourceTimeZone       = new UserDetailDataSource(this.userDetailService);

    this.dataSourceCompany      .loadUserDetail(this.userConncode, this.userID, 0, 10, this.user.company, "company_clist");
    this.dataSourceGroup        .loadUserDetail(this.userConncode, this.userID, 0, 10, this.user.group, "group_clist");
    this.dataSourceAccount      .loadUserDetail(this.userConncode, this.userID, 0, 10, this.user.account, "account_clist");
    this.dataSourceOperator     .loadUserDetail(this.userConncode, this.userID, 0, 10, this.user.operator, "operator_clist");
    this.dataSourceUnitType     .loadUserDetail(this.userConncode, this.userID, 0, 10, this.user.unittype, "unittype_clist");
    this.dataSourceServicePlan  .loadUserDetail(this.userConncode, this.userID, 0, 10, this.user.serviceplan, "serviceplan_clist");
    this.dataSourceProductType  .loadUserDetail(this.userConncode, this.userID, 0, 10, '', "producttype_clist");
    this.dataSourceMake         .loadUserDetail(this.userConncode, this.userID, 0, 10, this.user.make, "make_clist");
    if(this.userModel_flag) {
      this.dataSourceModel      .loadUserDetail(this.userConncode, this.userID, 0, 10, this.user.model, "model_clist");
    }
    this.dataSourceTimeZone     .loadUserDetail(this.userConncode, this.userID, 0, 10, this.user.timezone, "timezone_clist");

    this.userForm = this._formBuilder.group({
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
    
    merge(this.paginatorCompany.page)
    .pipe(
      tap(() => {
        this.loadUserDetail("company")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorGroup.page)
    .pipe(
      tap(() => {
        this.loadUserDetail("group")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorAccount.page)
    .pipe(
      tap(() => {
        this.loadUserDetail("account")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorOperator.page)
    .pipe(
      tap(() => {
        this.loadUserDetail("operator")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorUnitType.page)
    .pipe(
      tap(() => {
        this.loadUserDetail("unittype")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorServicePlan.page)
    .pipe(
      tap(() => {
        this.loadUserDetail("serviceplan")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorProductType.page)
    .pipe(
      tap(() => {
        this.loadUserDetail("producttype")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorMake.page)
    .pipe(
      tap(() => {
        this.loadUserDetail("make")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    if(this.userModel_flag) {
      merge(this.paginatorModel.page)
      .pipe(
        tap(() => {
          // this.userDetailService.current_makeID = this.userForm.get('make').value;

          console.log("makeid: ", this.userDetailService.current_makeID);
          this.paginatorModel.pageIndex = 0
  
          this.loadUserDetail('model')
        })
      )
      .subscribe( (res: any) => {
          console.log(res);
      });
    }

    merge(this.paginatorTimeZone.page)
    .pipe(
      tap(() => {
        this.loadUserDetail("timezone")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });
  }

  loadUserDetail(method_string: string) {
    if (method_string == 'company') {
      this.dataSourceCompany.loadUserDetail(this.userConncode, this.userID, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'group') {
        this.dataSourceGroup.loadUserDetail(this.userConncode, this.userID, this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'active') {
        this.dataSourceAccount.loadUserDetail(this.userConncode, this.userID, this.paginatorAccount.pageIndex, this.paginatorAccount.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'operator') {
        this.dataSourceOperator.loadUserDetail(this.userConncode, this.userID, this.paginatorOperator.pageIndex, this.paginatorOperator.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'unittype') {
        this.dataSourceUnitType.loadUserDetail(this.userConncode, this.userID, this.paginatorUnitType.pageIndex, this.paginatorUnitType.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'serviceplan') {
        this.dataSourceServicePlan.loadUserDetail(this.userConncode, this.userID, this.paginatorServicePlan.pageIndex, this.paginatorServicePlan.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'producttype') {
        this.dataSourceProductType.loadUserDetail(this.userConncode, this.userID, this.paginatorProductType.pageIndex, this.paginatorProductType.pageSize, "", `${method_string}_clist`)
    } else if (method_string == 'make') {
        this.dataSourceMake.loadUserDetail(this.userConncode, this.userID, this.paginatorMake.pageIndex, this.paginatorMake.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'model') {
        this.dataSourceModel.loadUserDetail(this.userConncode, this.userID, this.paginatorModel.pageIndex, this.paginatorModel.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'timezone') {
        this.dataSourceTimeZone.loadUserDetail(this.userConncode, this.userID, this.paginatorTimeZone.pageIndex, this.paginatorTimeZone.pageSize, this.filter_string, `${method_string}_clist`)
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
    if (this.method_string == 'model' && !this.userModel_flag) {
        alert("Please check first Make is selected!");
    } else {
      let selected_element_id = this.userForm.get(`${this.method_string}`).value;

      console.log(methodString, this.userDetailService.unit_clist_item[methodString], selected_element_id );

      let clist = this.userDetailService.unit_clist_item[methodString];

      for (let i = 0; i< clist.length; i++) {
        if ( clist[i].id == selected_element_id ) {
          this.userForm.get('filterstring').setValue(clist[i].name);
          this.filter_string = clist[i].name;
        }
      }
     
      this.managePageIndex(this.method_string);
      this.loadUserDetail(this.method_string);
    }
  }

  clearFilter() {
    console.log(this.filter_string);
    this.filter_string = '';
    this.userForm.get('filterstring').setValue(this.filter_string);

    // if (this.method_string == 'model') {
    // }
    this.managePageIndex(this.method_string);
    this.loadUserDetail(this.method_string);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
     
      this.managePageIndex(this.method_string);
      this.loadUserDetail(this.method_string);
    }

    console.log(this.filter_string);
  }

  setValues() {
      this.userForm.get('name').setValue(this.user.name);
      this.userForm.get('company').setValue(this.user.companyid);
      this.userForm.get('group').setValue(this.user.groupid);
      this.userForm.get('account').setValue(this.user.accountid);
      this.userForm.get('operator').setValue(this.user.operatorid);
      this.userForm.get('unittype').setValue(this.user.unittypeid);
      this.userForm.get('serviceplan').setValue(this.user.serviceplanid);
      this.userForm.get('producttype').setValue(this.user.producttypeid);
      this.userForm.get('make').setValue(this.user.makeid);
      this.userForm.get('model').setValue(this.user.modelid);
      this.userForm.get('timezone').setValue(this.user.timezoneid);

      let created          = this.user? new Date(`${this.user.created}`) : '';
      let deletedwhen      = this.user? new Date(`${this.user.deletedwhen}`) : '';
      let lastmodifieddate = this.user? new Date(`${this.user.lastmodifieddate}`) : '';

      this.userForm.get('created').setValue(this.dateFormat(created));
      this.userForm.get('createdbyname').setValue(this.user.createdbyname);
      this.userForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.userForm.get('deletedbyname').setValue(this.user.deletedbyname);
      this.userForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.userForm.get('lastmodifiedbyname').setValue(this.user.lastmodifiedbyname);
      this.userForm.get('filterstring').setValue(this.filter_string);
  }

  getValues(dateTime: any, mode: string) {
    this.userDetail.name             = this.userForm.get('name').value || '',
    this.userDetail.companyid        = this.userForm.get('company').value || 0;
    this.userDetail.groupid          = this.userForm.get('group').value || 0;
    this.userDetail.accountid        = this.userForm.get('account').value || 0;
    this.userDetail.operatorid       = this.userForm.get('operator').value || 0;
    this.userDetail.unittypeid       = this.userForm.get('unittype').value || 0;
    this.userDetail.serviceplanid    = this.userForm.get('serviceplan').value || 0;
    this.userDetail.producttypeid    = this.userForm.get('producttype').value || 0;
    this.userDetail.makeid           = this.userForm.get('make').value || 0;
    this.userDetail.modelid          = this.userForm.get('model').value || 0;
    this.userDetail.timezoneid       = this.userForm.get('timezone').value || 0;
 
    this.userDetail.subgroup         = this.user.subgroup || 0;
    this.userDetail.isactive         = this.user.isactive || true;
    this.userDetail.deletedwhen      = this.user.deletedwhen || '';
    this.userDetail.deletedby        = this.user.deletedby || 0;

    if( mode  == "save" ) {
      this.userDetail.id               = this.user.id;
      this.userDetail.created          = this.user.created;
      this.userDetail.createdby        = this.user.createdby;
      this.userDetail.lastmodifieddate = dateTime;
      this.userDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.userDetail.id               = 0;
      this.userDetail.created          = dateTime;
      this.userDetail.createdby        = this.userID;
      this.userDetail.lastmodifieddate = dateTime;
      this.userDetail.lastmodifiedby   = this.userID;
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

  saveUser(): void {
    console.log("saveUser");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(this.userDetail);

    this.userDetailService.saveUserDetail(this.userConncode, this.userID, this.userDetail)
    .subscribe((result: any) => {
      console.log(result);
      if (result.responseCode == 200) {
        alert("Success!");
        this.router.navigate(['admin/users/users']);
      }
    });
  }

  addUser(): void {
    console.log("addUser");
    let today = new Date().toISOString();
    this.getValues(today, "add");
    console.log(this.userDetail);

    this.userDetailService.saveUserDetail(this.userConncode, this.userID, this.userDetail)
    .subscribe((result: any) => {
      console.log(result);
      if (result.responseCode == 200) {
        alert("Success!");
        this.router.navigate(['admin/users/users']);
      }
    });
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       user: "", flag: flag
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
  onMakeChange(event: any) {
    console.log(event);
    this.userDetailService.current_makeID = this.userForm.get('make').value;
    this.userModel_flag = true;
    this.dataSourceModel.loadUserDetail(this.userConncode, this.userID, 0, 10, "", "model_clist");
    // this.paginatorModel.pageIndex = 0;

  }

  checkMakeIsSelected() {
    alert("Please check first Make is selected!");
  }

   // navigatePageEvent() {
  //   // console.log(this.index_number);
  //   // this.paginator.pageIndex = this.dataSource.page_index - 1;
  //   // this.dataSource.loadCompanies(this.userConncode, 1, this.paginator.pageIndex, this.paginator.pageSize, "company_clist");
  // }
}
