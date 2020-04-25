import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { ConnectionDetail } from 'app/main/system/connections/model/connection.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import { Subject, merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { ConnectionDetailService } from 'app/main/system/connections/services/connection_detail.service';
import { ConnectionDetailDataSource } from "app/main/system/connections/services/connection_detail.datasource";

import { locale as connectionsEnglish } from 'app/main/system/connections/i18n/en';
import { locale as connectionsSpanish } from 'app/main/system/connections/i18n/sp';
import { locale as connectionsFrench } from 'app/main/system/connections/i18n/fr';
import { locale as connectionsPortuguese } from 'app/main/system/connections/i18n/pt';

@Component({
  selector: 'app-connection-detail',
  templateUrl: './connection_detail.component.html',
  styleUrls: ['./connection_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class ConnectionDetailComponent implements OnInit
{
  connection_detail: any;
  public connection: any;
  pageType: string;
  userConncode: string;
  userID: number;

  connectionModel_flag: boolean;

  connectionForm: FormGroup;
  connectionDetail: ConnectionDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: ConnectionDetailDataSource;
  
  dataSourceProtocol: ConnectionDetailDataSource;
 
  filter_string: string = '';
  method_string: string = '';
  
  @ViewChild(MatPaginator, {static: true})
  paginatorProtocol: MatPaginator;

  constructor(
    public connectionDetailService: ConnectionDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(connectionsEnglish, connectionsSpanish, connectionsFrench, connectionsPortuguese);

    this.connection = localStorage.getItem("connection_detail")? JSON.parse(localStorage.getItem("connection_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.connection != '' )
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
    console.log(this.connection);
    
    this.dataSourceProtocol = new ConnectionDetailDataSource(this.connectionDetailService);

    this.dataSourceProtocol.loadConnectionDetail(this.userConncode, this.userID, 0, 10, this.connection.protocol, "protocol_clist");

    this.connectionForm = this._formBuilder.group({
      name               : [null, Validators.required],
      conntype           : [null, Validators.required],
      localport          : [null, Validators.required],
      protocol           : [null, Validators.required],
     
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

    merge(this.paginatorProtocol.page)
    .pipe(
      tap(() => {
        this.loadConnectionDetail("protocol")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });
    
  }

  loadConnectionDetail(method_string: string) {
    if (method_string == 'protocol') {
        this.dataSourceProtocol.loadConnectionDetail(this.userConncode, this.userID, this.paginatorProtocol.pageIndex, this.paginatorProtocol.pageSize, this.filter_string, `${method_string}_clist`)
    }
  }

  managePageIndex(method_string: string) {
    switch(method_string) {
      
      case 'protocol':
        this.paginatorProtocol.pageIndex = 0;
      break;
    }
  }

  showCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
   
    let selected_element_id = this.connectionForm.get(`${this.method_string}`).value;

    console.log(methodString, this.connectionDetailService.unit_clist_item[methodString], selected_element_id );

    let clist = this.connectionDetailService.unit_clist_item[methodString];

    for (let i = 0; i< clist.length; i++) {
      if ( clist[i].id == selected_element_id ) {
        this.connectionForm.get('filterstring').setValue(clist[i].name);
        this.filter_string = clist[i].name;
      }
    }
    
    this.managePageIndex(this.method_string);
    this.loadConnectionDetail(this.method_string);
  }

  clearFilter() {
    console.log(this.filter_string);
    this.filter_string = '';
    this.connectionForm.get('filterstring').setValue(this.filter_string);
  
    this.managePageIndex(this.method_string);
    this.loadConnectionDetail(this.method_string);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
     
      this.managePageIndex(this.method_string);
      this.loadConnectionDetail(this.method_string);
    }

    console.log(this.filter_string);
  }

  setValues() {
      this.connectionForm.get('name').setValue(this.connection.name);
      this.connectionForm.get('conntype').setValue(this.connection.conntype);
      this.connectionForm.get('localport').setValue(this.connection.localport);
      this.connectionForm.get('protocol').setValue(this.connection.protocolid);
     
      let created          = this.connection.created? new Date(`${this.connection.created}`) : '';
      let deletedwhen      = this.connection.deletedwhen? new Date(`${this.connection.deletedwhen}`) : '';
      let lastmodifieddate = this.connection.lastmodifieddate? new Date(`${this.connection.lastmodifieddate}`) : '';

      this.connectionForm.get('created').setValue(this.dateFormat(created));
      this.connectionForm.get('createdbyname').setValue(this.connection.createdbyname);
      this.connectionForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.connectionForm.get('deletedbyname').setValue(this.connection.deletedbyname);
      this.connectionForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.connectionForm.get('lastmodifiedbyname').setValue(this.connection.lastmodifiedbyname);
      this.connectionForm.get('filterstring').setValue(this.filter_string);
  }

  getValues(dateTime: any, mode: string) {
    this.connectionDetail.name      = this.connectionForm.get('name').value || '',
    this.connectionDetail.conntype  = this.connectionForm.get('conntype').value || '';
    this.connectionDetail.localport = this.connectionForm.get('localport').value || 0;
    this.connectionDetail.protocolid  = this.connectionForm.get('protocol').value || 0;
 
    this.connectionDetail.isactive         = this.connection.isactive || true;
    this.connectionDetail.deletedwhen      = this.connection.deletedwhen || '';
    this.connectionDetail.deletedby        = this.connection.deletedby || 0;

    if( mode  == "save" ) {
      this.connectionDetail.id               = this.connection.id;
      this.connectionDetail.created          = this.connection.created;
      this.connectionDetail.createdby        = this.connection.createdby;
      this.connectionDetail.lastmodifieddate = dateTime;
      this.connectionDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.connectionDetail.id               = 0;
      this.connectionDetail.created          = dateTime;
      this.connectionDetail.createdby        = this.userID;
      this.connectionDetail.lastmodifieddate = dateTime;
      this.connectionDetail.lastmodifiedby   = this.userID;
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

  saveConnection(): void {
    console.log("saveConnection");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(this.connectionDetail);

    if (this.connectionDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.connectionDetailService.saveConnectionDetail(this.userConncode, this.userID, this.connectionDetail)
      .subscribe((result: any) => {
        console.log(result);
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['system/connections/connections']);
        }
      });
    }
  }

  addConnection(): void {
    console.log("addConnection");
    let today = new Date().toISOString();
    this.getValues(today, "add");
    console.log(this.connectionDetail);

    if (this.connectionDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.connectionDetailService.saveConnectionDetail(this.userConncode, this.userID, this.connectionDetail)
      .subscribe((result: any) => {
        console.log(result);
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['system/connections/connections']);
        }
      });
    }
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       connection: "", flag: flag
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
