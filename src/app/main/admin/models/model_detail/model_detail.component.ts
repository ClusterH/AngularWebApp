import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { ModelDetail } from 'app/main/admin/models/model_interface/model.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import { tap } from 'rxjs/operators';
import { merge } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { ModelDetailService } from 'app/main/admin/models/services/model_detail.service';
import { ModelDetailDataSource } from "app/main/admin/models/services/model_detail.datasource";

import { locale as modelsEnglish } from 'app/main/admin/models/i18n/en';
import { locale as modelsSpanish } from 'app/main/admin/models/i18n/sp';
import { locale as modelsFrench } from 'app/main/admin/models/i18n/fr';
import { locale as modelsPortuguese } from 'app/main/admin/models/i18n/pt';

@Component({
  selector: 'app-model-detail',
  templateUrl: './model_detail.component.html',
  styleUrls: ['./model_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class ModelDetailComponent implements OnInit
{
  model_detail: any;
  public model: any;
  pageType: string;
  userConncode: string;
  userID: number;

  modelForm: FormGroup;
  modelDetail: ModelDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: ModelDetailDataSource;
  
  dataSourceMake:             ModelDetailDataSource;
  dataSourceTireConfiguration: ModelDetailDataSource;
 
  filter_string: string = '';
  method_string: string = '';
  
  @ViewChild(MatPaginator, {static: true})
    paginatorMake: MatPaginator;
  @ViewChild('paginatorTireConfiguration', {read: MatPaginator, static: true})
    paginatorTireConfiguration: MatPaginator;
 

  constructor(
    public modelDetailService: ModelDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(modelsEnglish, modelsSpanish, modelsFrench, modelsPortuguese);

    this.model = localStorage.getItem("model_detail")? JSON.parse(localStorage.getItem("model_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.model != '' )
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
    
  
    this.dataSourceMake              = new ModelDetailDataSource(this.modelDetailService);
    this.dataSourceTireConfiguration = new ModelDetailDataSource(this.modelDetailService);
    
    this.dataSourceMake             .loadModelDetail(this.userConncode, this.userID, 0, 10, this.model.make, "make_clist");
    this.dataSourceTireConfiguration.loadModelDetail(this.userConncode, this.userID, 0, 10, '', "tireconfiguration_clist");

    this.modelForm = this._formBuilder.group({
      name               : [null, Validators.required],
      make               : [null, Validators.required],
      isactive           : [null, Validators.required],
      tireconfiguration  : [null, Validators.required],
      createdwhen        : [{value: '', disabled: true}, Validators.required],
      createdbyname      : [{value: '', disabled: true}, Validators.required],
      lastmodifieddate   : [{value: '', disabled: true}, Validators.required],
      lastmodifiedbyname : [{value: '', disabled: true}, Validators.required],
      filterstring       : [null, Validators.required],
  });

  this.setValues();
}

  ngAfterViewInit() {
    

    merge(this.paginatorMake.page)
    .pipe(
      tap(() => {
        this.loadModelDetail("make")
      })
    )
    .subscribe( (res: any) => {
        
    });
   
    merge(this.paginatorTireConfiguration.page)
    .pipe(
      tap(() => {
        this.loadModelDetail("tireconfiguration")
      })
    )
    .subscribe( (res: any) => {
        
    });
  }

  loadModelDetail(method_string: string) {
    if (method_string == 'make') {
        this.dataSourceMake.loadModelDetail(this.userConncode, this.userID, this.paginatorMake.pageIndex, this.paginatorMake.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'tireconfiguration') {
        this.dataSourceTireConfiguration.loadModelDetail(this.userConncode, this.userID, this.paginatorTireConfiguration.pageIndex, this.paginatorTireConfiguration.pageSize, '', `${method_string}_clist`)
    } 
  }

  managePageIndex(method_string: string) {
    switch(method_string) {

      case 'make':
        this.paginatorMake.pageIndex = 0;
      break;
     
      case 'tireconfiguration':
        this.paginatorTireConfiguration.pageIndex = 0;
      break;
    }
  }

  showCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
   
    let selected_element_id = this.modelForm.get(`${this.method_string}`).value;

    

    let clist = this.modelDetailService.unit_clist_item[methodString];

    for (let i = 0; i< clist.length; i++) {
      if ( clist[i].id == selected_element_id ) {
        this.modelForm.get('filterstring').setValue(clist[i].name);
        this.filter_string = clist[i].name;
      }
    }
    
    this.managePageIndex(this.method_string);
    this.loadModelDetail(this.method_string);
  }

  clearFilter() {
    
    this.filter_string = '';
    this.modelForm.get('filterstring').setValue(this.filter_string);
  
    this.managePageIndex(this.method_string);
    this.loadModelDetail(this.method_string);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
     
      this.managePageIndex(this.method_string);
      this.loadModelDetail(this.method_string);
    }

    
  }

  setValues() {
      this.modelForm.get('name').setValue(this.model.name);
      this.modelForm.get('make').setValue(this.model.makeid);
      this.modelForm.get('tireconfiguration').setValue(this.model.tireconfigurationid);

      let createdwhen      = this.model.createdwhen? new Date(`${this.model.createdwhen}`) : '';
      let lastmodifieddate = this.model.lastmodifieddate? new Date(`${this.model.lastmodifieddate}`) : '';

      this.modelForm.get('createdwhen').setValue(this.dateFormat(createdwhen));
      this.modelForm.get('createdbyname').setValue(this.model.createdbyname);
      this.modelForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.modelForm.get('lastmodifiedbyname').setValue(this.model.lastmodifiedbyname);
      this.modelForm.get('filterstring').setValue(this.filter_string);
  }

  getValues(dateTime: any, mode: string) {
    this.modelDetail.name                = this.modelForm.get('name').value || '',
    this.modelDetail.makeid              = this.modelForm.get('make').value || 0;
    this.modelDetail.tireconfigurationid = this.modelForm.get('tireconfiguration').value || 0;
 
    this.modelDetail.isactive            = this.model.isactive || true;

    if( mode  == "save" ) {
      this.modelDetail.id               = this.model.id;
      this.modelDetail.createdwhen      = this.model.createdwhen;
      this.modelDetail.createdby        = this.model.createdby;
      this.modelDetail.lastmodifieddate = dateTime;
      this.modelDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.modelDetail.id               = 0;
      this.modelDetail.createdwhen      = dateTime;
      this.modelDetail.createdby        = this.userID;
      this.modelDetail.lastmodifieddate = dateTime;
      this.modelDetail.lastmodifiedby   = this.userID;
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

  saveModel(): void {
    
    let today = new Date().toISOString();
    this.getValues(today, "save");
    

    if (this.modelDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.modelDetailService.saveModelDetail(this.userConncode, this.userID, this.modelDetail)
      .subscribe((result: any) => {
        
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['admin/models/models']);
        }
      });
    }
  }

  addModel(): void {
    
    let today = new Date().toISOString();
    this.getValues(today, "add");
    

    if (this.modelDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.modelDetailService.saveModelDetail(this.userConncode, this.userID, this.modelDetail)
      .subscribe((result: any) => {
        
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['admin/models/models']);
        }
      });
    }
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       model: "", flag: flag
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
