import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { GroupDetail } from 'app/main/admin/groups/model/group.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import * as _ from 'lodash';

import { Subject, merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { GroupDetailService } from 'app/main/admin/groups/services/group_detail.service';
import { GroupDetailDataSource } from "app/main/admin/groups/services/group_detail.datasource";
import { AuthService } from 'app/authentication/services/authentication.service';

import { locale as groupsEnglish } from 'app/main/admin/groups/i18n/en';
import { locale as groupsSpanish } from 'app/main/admin/groups/i18n/sp';
import { locale as groupsFrench } from 'app/main/admin/groups/i18n/fr';
import { locale as groupsPortuguese } from 'app/main/admin/groups/i18n/pt';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group_detail.component.html',
  styleUrls: ['./group_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class GroupDetailComponent implements OnInit
{
  group_detail: any;
  public group: any;
  pageType: string;
  userConncode: string;
  userID: number;
  
  groupForm: FormGroup;
  groupDetail: GroupDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: GroupDetailDataSource;

  dataSourceCompany: GroupDetailDataSource;
  dataSourceAccount: GroupDetailDataSource;

  filter_string: string = '';
  method_string: string = '';
  
  @ViewChild(MatPaginator, {static: true})
    paginatorCompany: MatPaginator;
  @ViewChild('paginatorAccount', {read: MatPaginator, static: true})
    paginatorAccount: MatPaginator;
 
  constructor(
    public groupDetailService: GroupDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(groupsEnglish, groupsSpanish, groupsFrench, groupsPortuguese);

    this.group = localStorage.getItem("group_detail")? JSON.parse(localStorage.getItem("group_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.group != '' )
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
    
  
    this.dataSourceCompany = new GroupDetailDataSource(this.groupDetailService);
    this.dataSourceAccount = new GroupDetailDataSource(this.groupDetailService);

    this.dataSourceCompany.loadGroupDetail(this.userConncode, this.userID, 0, 10, this.group.company, "company_clist");
    this.dataSourceAccount.loadGroupDetail(this.userConncode, this.userID, 0, 10, this.group.account, "account_clist");

    this.groupForm = this._formBuilder.group({
      name              : [null, Validators.required],
      email             : [null, Validators.required],
      contactname       : [null, Validators.required],
      contactphone      : [null, Validators.required],
      address           : [null, Validators.required],
      isactive          : [null, Validators.required],
      company           : [null, Validators.required],
      account           : [null, Validators.required],
      created           : [{value: '', disabled: true}, Validators.required],
      createdbyname     : [{value: '', disabled: true}, Validators.required],
      deletedwhen       : [{value: '', disabled: true}, Validators.required],
      deletedbyname     : [{value: '', disabled: true}, Validators.required],
      lastmodifieddate  : [{value: '', disabled: true}, Validators.required],
      lastmodifiedbyname: [{value: '', disabled: true}, Validators.required],
    
      filterstring      : [null, Validators.required],
  });

  this.setValues();
}

  ngAfterViewInit() {
    
    
    merge(this.paginatorCompany.page)
    .pipe(
      tap(() => {
        this.loadGroupDetail("company")
      })
    )
    .subscribe( (res: any) => {
        
    });

    merge(this.paginatorAccount.page)
    .pipe(
      tap(() => {
        this.loadGroupDetail("account")
      })
    )
    .subscribe( (res: any) => {
        
    });
  }

  loadGroupDetail(method_string: string) {
    if (method_string == 'company') {
      this.dataSourceCompany.loadGroupDetail(this.userConncode, this.userID, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'account') {
        this.dataSourceAccount.loadGroupDetail(this.userConncode, this.userID, this.paginatorAccount.pageIndex, this.paginatorAccount.pageSize, this.filter_string, `${method_string}_clist`)
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
    }
  }

  showCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
   
    let selected_element_id = this.groupForm.get(`${this.method_string}`).value;

    

    let clist = this.groupDetailService.unit_clist_item[methodString];

    for (let i = 0; i< clist.length; i++) {
      if ( clist[i].id == selected_element_id ) {
        this.groupForm.get('filterstring').setValue(clist[i].name);
        this.filter_string = clist[i].name;
      }
    }
     
    this.managePageIndex(this.method_string);
    this.loadGroupDetail(this.method_string);
  }

  clearFilter() {
    
    this.filter_string = '';
    this.groupForm.get('filterstring').setValue(this.filter_string);

    this.managePageIndex(this.method_string);
    this.loadGroupDetail(this.method_string);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
     
      this.managePageIndex(this.method_string);
      this.loadGroupDetail(this.method_string);
    }

    
  }

  setValues() {
      this.groupForm.get('name').setValue(this.group.name);
      this.groupForm.get('email').setValue(this.group.email);
      this.groupForm.get('contactname').setValue(this.group.contactname);
      this.groupForm.get('contactphone').setValue(this.group.contactphone);
      this.groupForm.get('address').setValue(this.group.address);
      this.groupForm.get('company').setValue(this.group.companyid);
      this.groupForm.get('account').setValue(this.group.accountid);

      let created                = this.group.created? new Date(`${this.group.created}`) : '';
      let deletedwhen            = this.group.deletedwhen? new Date(`${this.group.deletedwhen}`) : '';
      let lastmodifieddate       = this.group.lastmodifieddate? new Date(`${this.group.lastmodifieddate}`) : '';

      this.groupForm.get('created').setValue(this.dateFormat(created));
      this.groupForm.get('createdbyname').setValue(this.group.createdbyname);
      this.groupForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.groupForm.get('deletedbyname').setValue(this.group.deletedbyname);
      this.groupForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.groupForm.get('lastmodifiedbyname').setValue(this.group.lastmodifiedbyname);

      this.groupForm.get('filterstring').setValue(this.filter_string);
  }

  getValues(dateTime: any, mode: string) {
    this.groupDetail.name         = this.groupForm.get('name').value || '',
    this.groupDetail.email        = this.groupForm.get('email').value || '';
    this.groupDetail.contactname  = this.groupForm.get('contactname').value || '';
    this.groupDetail.contactphone = this.groupForm.get('contactphone').value || '';
    this.groupDetail.address      = this.groupForm.get('address').value || '';
    this.groupDetail.companyid    = this.groupForm.get('company').value || 0;
    this.groupDetail.accountid    = this.groupForm.get('account').value || 0;
 
    this.groupDetail.isactive     = this.group.isactive || true;
    this.groupDetail.deletedwhen  = this.group.deletedwhen || '';
    this.groupDetail.deletedby    = this.group.deletedby || 0;

    if( mode  == "save" ) {
      this.groupDetail.id               = this.group.id;
      this.groupDetail.created          = this.group.created;
      this.groupDetail.createdby        = this.group.createdby;
      this.groupDetail.lastmodifieddate = dateTime;
      this.groupDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.groupDetail.id               = 0;
      this.groupDetail.created          = dateTime;
      this.groupDetail.createdby        = this.userID;
      this.groupDetail.lastmodifieddate = dateTime;
      this.groupDetail.lastmodifiedby   = this.userID;
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

  setDatePicker(date) {
    let str = new Date(date).toISOString().substring(0, 10);
    
    return str;
  }

  saveGroup(): void {
    
    let today = new Date().toISOString();
    this.getValues(today, "save");

    if (this.groupDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.groupDetailService.saveGroupDetail(this.userConncode, this.userID, this.groupDetail)
      .subscribe((result: any) => {
        
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['admin/groups/groups']);
        }
      });
    }
  }

  addGroup(): void {
    
    let today = new Date().toISOString();
    this.getValues(today, "add");
    

    if (this.groupDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.groupDetailService.saveGroupDetail(this.userConncode, this.userID, this.groupDetail)
      .subscribe((result: any) => {
        
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['admin/groups/groups']);
        }
      });
    }
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       group: "", flag: flag
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
