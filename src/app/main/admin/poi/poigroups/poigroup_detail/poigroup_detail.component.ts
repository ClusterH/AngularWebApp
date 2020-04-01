import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { PoigroupDetail } from 'app/main/admin/poi/poigroups/model/poigroup.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import { merge, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { PoigroupDetailService } from 'app/main/admin/poi/poigroups/services/poigroup_detail.service';
import { PoigroupDetailDataSource } from "app/main/admin/poi/poigroups/services/poigroup_detail.datasource";
import { POIListService } from 'app/main/admin/poi/poigroups/services/poilist.service';

import { locale as poigroupsEnglish } from 'app/main/admin/poi/poigroups/i18n/en';
import { locale as poigroupsSpanish } from 'app/main/admin/poi/poigroups/i18n/sp';
import { locale as poigroupsFrench } from 'app/main/admin/poi/poigroups/i18n/fr';
import { locale as poigroupsPortuguese } from 'app/main/admin/poi/poigroups/i18n/pt';

@Component({
  selector: 'app-poigroup-detail',
  templateUrl: './poigroup_detail.component.html',
  styleUrls: ['./poigroup_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class PoigroupDetailComponent implements OnInit, OnDestroy
{
  poigroup_detail: any;
  public poigroup: any;
  pageType: string;
  userConncode: string;
  userID: number;

  poigroupModel_flag: boolean;

  poigroupForm: FormGroup;
  poigroupDetail: PoigroupDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: PoigroupDetailDataSource;

  dataSourceCompany:     PoigroupDetailDataSource;
  dataSourceGroup:       PoigroupDetailDataSource;
  dataSourcePoint:     PoigroupDetailDataSource;
  dataSourcePointType:    PoigroupDetailDataSource;
 
  filter_string: string = '';
  method_string: string = '';

  hasSelectedContacts: boolean;
  private _unsubscribeAll: Subject<any>;
  
  @ViewChild(MatPaginator, {static: true})
    paginatorCompany: MatPaginator;
  
  constructor(
    public poigroupDetailService: PoigroupDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,

    private _poiListService: POIListService,
    private _fuseSidebarService: FuseSidebarService,

  ) {
    this._fuseTranslationLoaderService.loadTranslations(poigroupsEnglish, poigroupsSpanish, poigroupsFrench, poigroupsPortuguese);

    this.poigroup = localStorage.getItem("poigroup_detail")? JSON.parse(localStorage.getItem("poigroup_detail")) : '';
    console.log(this.poigroup);
    
    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.poigroup != '' )
    {
      this.pageType = 'edit';
    }
    else
    {
      console.log(this.poigroup);

      this.pageType = 'new';
    }

    this.filter_string = '';

     // Set the private defaults
     this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
  
    this.dataSourceCompany   = new PoigroupDetailDataSource(this.poigroupDetailService);
   
    this.dataSourceCompany  .loadPoigroupDetail(this.userConncode, this.userID, 0, 10, this.poigroup.company, "company_clist");
  
    this.poigroupForm = this._formBuilder.group({
      name               : [null, Validators.required],
      company            : [null, Validators.required],
     
      isactive           : [null, Validators.required],
      created            : [{value: '', disabled: true}, Validators.required],
      createdbyname      : [{value: '', disabled: true}, Validators.required],
      deletedwhen        : [{value: '', disabled: true}, Validators.required],
      deletedbyname      : [{value: '', disabled: true}, Validators.required],
      lastmodifieddate   : [{value: '', disabled: true}, Validators.required],
      lastmodifiedbyname : [{value: '', disabled: true}, Validators.required],
      filterstring       : [null, Validators.required],
  });

  this.setValues();

  this._poiListService.onSelectedContactsChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(selectedContacts => {
        this.hasSelectedContacts = selectedContacts.length > 0;
    });
  }

/**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

   /**
     * Toggle the sidebar
     *
     * @param name
     */
  toggleSidebar(name): void
  {
      this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit:");
    
    merge(this.paginatorCompany.page)
    .pipe(
      tap(() => {
        this.loadPoigroupDetail("company")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });
  }

  loadPoigroupDetail(method_string: string) {
    if (method_string == 'company') {
      this.dataSourceCompany.loadPoigroupDetail(this.userConncode, this.userID, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
    } 
  }

  managePageIndex(method_string: string) {
    switch(method_string) {
      case 'company':
        this.paginatorCompany.pageIndex = 0;
      break;
    }
  }

  showCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
    let selected_element_id = this.poigroupForm.get(`${this.method_string}`).value;

    console.log(methodString, this.poigroupDetailService.unit_clist_item[methodString], selected_element_id );

    let clist = this.poigroupDetailService.unit_clist_item[methodString];

    for (let i = 0; i< clist.length; i++) {
      if ( clist[i].id == selected_element_id ) {
        this.poigroupForm.get('filterstring').setValue(clist[i].name);
        this.filter_string = clist[i].name;
      }
    }
    
    this.managePageIndex(this.method_string);
    this.loadPoigroupDetail(this.method_string);
  }

  clearFilter() {
    console.log(this.filter_string);
    this.filter_string = '';
    this.poigroupForm.get('filterstring').setValue(this.filter_string);
   
    this.managePageIndex(this.method_string);
    this.loadPoigroupDetail(this.method_string);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
     
      this.managePageIndex(this.method_string);
      this.loadPoigroupDetail(this.method_string);
    }

    console.log(this.filter_string);
  }

  setValues() {
      this.poigroupForm.get('name').setValue(this.poigroup.name);
      this.poigroupForm.get('company').setValue(this.poigroup.companyid);

      let created          = this.poigroup.created? new Date(`${this.poigroup.created}`) : '';
      let deletedwhen      = this.poigroup.deletedwhen? new Date(`${this.poigroup.deletedwhen}`) : '';
      let lastmodifieddate = this.poigroup.lastmodifieddate? new Date(`${this.poigroup.lastmodifieddate}`) : '';

      this.poigroupForm.get('created').setValue(this.dateFormat(created));
      this.poigroupForm.get('createdbyname').setValue(this.poigroup.createdbyname);
      this.poigroupForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.poigroupForm.get('deletedbyname').setValue(this.poigroup.deletedbyname);
      this.poigroupForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.poigroupForm.get('lastmodifiedbyname').setValue(this.poigroup.lastmodifiedbyname);
      this.poigroupForm.get('filterstring').setValue(this.filter_string);
  }

  getValues(dateTime: any, mode: string) {
    this.poigroupDetail.name        = this.poigroupForm.get('name').value || '',
    this.poigroupDetail.companyid   = this.poigroupForm.get('company').value || 0;
   
    this.poigroupDetail.isactive         = this.poigroup.isactive || true;
    this.poigroupDetail.deletedwhen      = this.poigroup.deletedwhen || '';
    this.poigroupDetail.deletedby        = this.poigroup.deletedby || 0;

    if( mode  == "save" ) {
      this.poigroupDetail.id               = this.poigroup.id;
      this.poigroupDetail.created          = this.poigroup.created;
      this.poigroupDetail.createdby        = this.poigroup.createdby;
      this.poigroupDetail.lastmodifieddate = dateTime;
      this.poigroupDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.poigroupDetail.id               = 0;
      this.poigroupDetail.created          = dateTime;
      this.poigroupDetail.createdby        = this.userID;
      this.poigroupDetail.lastmodifieddate = dateTime;
      this.poigroupDetail.lastmodifiedby   = this.userID;
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

  savePoigroup(): void {
    console.log("savePoigroup");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(this.poigroupDetail);

    this.poigroupDetailService.savePoigroupDetail(this.userConncode, this.userID, this.poigroupDetail)
    .subscribe((result: any) => {
      console.log(result);
      if (result.responseCode == 200) {
        alert("Success!");
        this.router.navigate(['admin/poi/poigroups/poigroups']);
      }
    });
  }

  addPoigroup(): void {
    let today = new Date().toISOString();
    this.getValues(today, "add");

    this.poigroupDetailService.savePoigroupDetail(this.userConncode, this.userID, this.poigroupDetail)
    .subscribe((result: any) => {
      if (result.responseCode == 200) {
        alert("Success!");
        this.router.navigate(['admin/poi/poigroups/poigroups']);
      }
    });
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       poigroup: "", flag: flag
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
