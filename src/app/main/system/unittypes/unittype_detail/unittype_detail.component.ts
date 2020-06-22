import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { UnittypeDetail } from 'app/main/system/unittypes/model/unittype.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import { Subject, merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { UnittypeDetailService } from 'app/main/system/unittypes/services/unittype_detail.service';
import { UnittypeDetailDataSource } from "app/main/system/unittypes/services/unittype_detail.datasource";
import { AuthService } from 'app/authentication/services/authentication.service';

import { locale as unittypesEnglish } from 'app/main/system/unittypes/i18n/en';
import { locale as unittypesSpanish } from 'app/main/system/unittypes/i18n/sp';
import { locale as unittypesFrench } from 'app/main/system/unittypes/i18n/fr';
import { locale as unittypesPortuguese } from 'app/main/system/unittypes/i18n/pt';

@Component({
  selector: 'app-unittype-detail',
  templateUrl: './unittype_detail.component.html',
  styleUrls: ['./unittype_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class UnittypeDetailComponent implements OnInit
{
  unittype_detail: any;
  public unittype: any;
  pageType: string;
  userConncode: string;
  userID: number;

  unittypeModel_flag: boolean;

  unittypeForm: FormGroup;
  unittypeDetail: UnittypeDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: UnittypeDetailDataSource;
  
  dataSourceProductType: UnittypeDetailDataSource;
 
  filter_string: string = '';
  method_string: string = '';
  
  @ViewChild(MatPaginator, {static: true})
  paginatorProductType: MatPaginator;

  constructor(
    public unittypeDetailService: UnittypeDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(unittypesEnglish, unittypesSpanish, unittypesFrench, unittypesPortuguese);

    this.unittype = localStorage.getItem("unittype_detail")? JSON.parse(localStorage.getItem("unittype_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.unittype != '' )
    {
      this.unittypeDetailService.current_makeID = this.unittype.makeid;
      this.unittypeModel_flag = true;
      
      this.pageType = 'edit';
    }
    else
    {
      
      this.unittypeDetailService.current_makeID = 0;
      this.unittypeModel_flag = false;

      this.pageType = 'new';
    }

    this.filter_string = '';
  }

  ngOnInit(): void {
    
    
    this.dataSourceProductType    = new UnittypeDetailDataSource(this.unittypeDetailService);

    this.dataSourceProductType  .loadUnittypeDetail(this.userConncode, this.userID, 0, 10, '', "producttype_clist");

    this.unittypeForm = this._formBuilder.group({
      name               : [null, Validators.required],
      producttype        : [null, Validators.required],
     
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
    

    merge(this.paginatorProductType.page)
    .pipe(
      tap(() => {
        this.loadUnittypeDetail("producttype")
      })
    )
    .subscribe( (res: any) => {
        
    });
    
  }

  loadUnittypeDetail(method_string: string) {
    if (method_string == 'producttype') {
        this.dataSourceProductType.loadUnittypeDetail(this.userConncode, this.userID, this.paginatorProductType.pageIndex, this.paginatorProductType.pageSize, "", `${method_string}_clist`)
    }
  }

  managePageIndex(method_string: string) {
    switch(method_string) {
      
      case 'producttype':
        this.paginatorProductType.pageIndex = 0;
      break;
    }
  }

  showCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
   
    let selected_element_id = this.unittypeForm.get(`${this.method_string}`).value;

    

    let clist = this.unittypeDetailService.unit_clist_item[methodString];

    for (let i = 0; i< clist.length; i++) {
      if ( clist[i].id == selected_element_id ) {
        this.unittypeForm.get('filterstring').setValue(clist[i].name);
        this.filter_string = clist[i].name;
      }
    }
    
    this.managePageIndex(this.method_string);
    this.loadUnittypeDetail(this.method_string);
  }

  clearFilter() {
    
    this.filter_string = '';
    this.unittypeForm.get('filterstring').setValue(this.filter_string);
  
    this.managePageIndex(this.method_string);
    this.loadUnittypeDetail(this.method_string);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
     
      this.managePageIndex(this.method_string);
      this.loadUnittypeDetail(this.method_string);
    }

    
  }

  setValues() {
      this.unittypeForm.get('name').setValue(this.unittype.name);
      this.unittypeForm.get('producttype').setValue(this.unittype.producttypeid);
     
      let created          = this.unittype.created? new Date(`${this.unittype.created}`) : '';
      let deletedwhen      = this.unittype.deletedwhen? new Date(`${this.unittype.deletedwhen}`) : '';
      let lastmodifieddate = this.unittype.lastmodifieddate? new Date(`${this.unittype.lastmodifieddate}`) : '';

      this.unittypeForm.get('created').setValue(this.dateFormat(created));
      this.unittypeForm.get('createdbyname').setValue(this.unittype.createdbyname);
      this.unittypeForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.unittypeForm.get('deletedbyname').setValue(this.unittype.deletedbyname);
      this.unittypeForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.unittypeForm.get('lastmodifiedbyname').setValue(this.unittype.lastmodifiedbyname);
      this.unittypeForm.get('filterstring').setValue(this.filter_string);
  }

  getValues(dateTime: any, mode: string) {
    this.unittypeDetail.name             = this.unittypeForm.get('name').value || '',
    
    this.unittypeDetail.producttypeid    = this.unittypeForm.get('producttype').value || 0;
 
    this.unittypeDetail.isactive         = this.unittype.isactive || true;
    this.unittypeDetail.deletedwhen      = this.unittype.deletedwhen || '';
    this.unittypeDetail.deletedby        = this.unittype.deletedby || 0;

    if( mode  == "save" ) {
      this.unittypeDetail.id               = this.unittype.id;
      this.unittypeDetail.created          = this.unittype.created;
      this.unittypeDetail.createdby        = this.unittype.createdby;
      this.unittypeDetail.lastmodifieddate = dateTime;
      this.unittypeDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.unittypeDetail.id               = 0;
      this.unittypeDetail.created          = dateTime;
      this.unittypeDetail.createdby        = this.userID;
      this.unittypeDetail.lastmodifieddate = dateTime;
      this.unittypeDetail.lastmodifiedby   = this.userID;
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

  saveUnittype(): void {
    
    let today = new Date().toISOString();
    this.getValues(today, "save");
    

    if (this.unittypeDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.unittypeDetailService.saveUnittypeDetail(this.userConncode, this.userID, this.unittypeDetail)
      .subscribe((result: any) => {
        
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['system/unittypes/unittypes']);
        }
      });
    }
  }

  addUnittype(): void {
    
    let today = new Date().toISOString();
    this.getValues(today, "add");
    

    if (this.unittypeDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.unittypeDetailService.saveUnittypeDetail(this.userConncode, this.userID, this.unittypeDetail)
      .subscribe((result: any) => {
        
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['system/unittypes/unittypes']);
        }
      });
    }
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       unittype: "", flag: flag
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
