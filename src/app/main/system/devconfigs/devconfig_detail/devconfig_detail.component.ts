import { Component, OnInit, ViewEncapsulation, ViewChild, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { DevConfigDetail } from 'app/main/system/devconfigs/model/devconfig.model';
import { CourseDialogComponent } from "../dialog/dialog.component";
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { DevConfigDetailDataSource } from "app/main/system/devconfigs/services/devconfig_detail.datasource";

import { DevConfigDetailService } from 'app/main/system/devconfigs/services/devconfig_detail.service';

import { locale as devconfigsEnglish } from 'app/main/system/devconfigs/i18n/en';
import { locale as devconfigsSpanish } from 'app/main/system/devconfigs/i18n/sp';
import { locale as devconfigsFrench } from 'app/main/system/devconfigs/i18n/fr';
import { locale as devconfigsPortuguese } from 'app/main/system/devconfigs/i18n/pt';

@Component({
  selector: 'app-devconfig-detail',
  templateUrl: './devconfig_detail.component.html',
  styleUrls: ['./devconfig_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class DevConfigDetailComponent implements OnInit
{
  public devconfig: any;
  pageType: string;
  userConncode: string;
  userID: number;

  command_edit_flag: boolean = false;
  currentCmdid: number;
  filter_name: string = '';
  
  @Output()
  pageEvent: PageEvent;
 
  pageIndex= 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  devconfigForm: FormGroup;
  devconfigDetail: DevConfigDetail = {};

  displayedColumns: string[] = ['name'];
  displayedCmdColumns: string[] = ['command', 'syscommand', 'edit'];

  dataSourceCommand:      DevConfigDetailDataSource;
  dataSourceSysCommand:   DevConfigDetailDataSource;
  dataSourceDevConfigCmd: DevConfigDetailDataSource;
 
  filter_string: string = '';
  method_string: string = '';

  @ViewChild('paginatorDevConfigCmd', {read: MatPaginator, static: true})
    paginatorDevConfigCmd: MatPaginator;

  @ViewChild('paginatorCommand', {read: MatPaginator, static: true})
    paginatorCommand: MatPaginator;

  @ViewChild('paginatorSysCommand', {read: MatPaginator, static: true})
    paginatorSysCommand: MatPaginator;
  
  constructor(
    public devconfigDetailService: DevConfigDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(devconfigsEnglish, devconfigsSpanish, devconfigsFrench, devconfigsPortuguese);

    this.pageIndex= 0;
    this.pageSize = 10;

    this.devconfig = localStorage.getItem("devconfig_detail")? JSON.parse(localStorage.getItem("devconfig_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.devconfig != '' )
    {
      this.devconfigDetailService.devconfig_id = this.devconfig.id;
      this.pageType = 'edit';
    }
    else
    {
      this.devconfigDetailService.devconfig_id = 0;
      this.pageType = 'new';
    }

    this.filter_string = '';
  }

  ngOnInit(): void {
    

    this.dataSourceDevConfigCmd = new DevConfigDetailDataSource(this.devconfigDetailService);
    this.dataSourceCommand      = new DevConfigDetailDataSource(this.devconfigDetailService);
    this.dataSourceSysCommand   = new DevConfigDetailDataSource(this.devconfigDetailService);

    this.dataSourceDevConfigCmd.loadDevConfigCmd(this.userConncode, this.userID, 0, 10, '', '', "DevConfigCmd_TList");
    this.dataSourceCommand     .loadDevConfigDetail(this.userConncode, this.userID, 0, 10, '', "command_clist");
    this.dataSourceSysCommand  .loadDevConfigDetail(this.userConncode, this.userID, 0, 10, '', "syscommand_clist");

  
    this.devconfigForm = this._formBuilder.group({
      name               : [null, Validators.required],
      command            : [null],
      syscommand         : [null],
      isactive           : [null, Validators.required],
      created            : [{value: '', disabled: true}, Validators.required],
      createdbyname      : [{value: '', disabled: true}, Validators.required],
      lastmodifieddate   : [{value: '', disabled: true}, Validators.required],
      lastmodifiedbyname : [{value: '', disabled: true}, Validators.required],
      filterstring       : [null, Validators.required],

    });

    this.setValues();
  }

  ngAfterViewInit() {
    

    var node = $("div.page_index");
    var node_length = node.length;
    $("div.page_index").remove();
    $("button.mat-paginator-navigation-previous.mat-icon-button.mat-button-base").after(node[node_length - 1]);
    
    merge(this.paginatorDevConfigCmd.page)
    .pipe(
      tap(() => {
        this.loadDevConfigDetail("devconfigcmd")
      })
    )
    .subscribe( (res: any) => {
        
    });

    merge(this.paginatorCommand.page)
    .pipe(
      tap(() => {
        this.loadDevConfigDetail("command")
      })
    )
    .subscribe( (res: any) => {
        
    });

    merge(this.paginatorSysCommand.page)
    .pipe(
      tap(() => {
        this.loadDevConfigDetail("syscommand")
      })
    )
    .subscribe( (res: any) => {
        
    });
  }

  loadDevConfigDetail(method_string: string) {
    if (method_string == 'devconfigcmd') {
      this.dataSourceDevConfigCmd.loadDevConfigCmd(this.userConncode, this.userID, this.paginatorDevConfigCmd.pageIndex, this.paginatorDevConfigCmd.pageSize, '', this.filter_string, `${method_string}_tlist`)
    } else if (method_string == 'command') {
        this.dataSourceCommand.loadDevConfigDetail(this.userConncode, this.userID, this.paginatorCommand.pageIndex, this.paginatorCommand.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'syscommand') {
        this.dataSourceSysCommand.loadDevConfigDetail(this.userConncode, this.userID, this.paginatorSysCommand.pageIndex, this.paginatorSysCommand.pageSize, this.filter_string, `${method_string}_clist`)
    } 
  }

  managePageIndex(method_string: string) {
    switch(method_string) {
      case 'devconfigcmd':
        this.paginatorDevConfigCmd.pageIndex = 0;
      break;

      case 'command':
        this.paginatorCommand.pageIndex = 0;
      break;

      case 'syscommand':
        this.paginatorSysCommand.pageIndex = 0;
      break;
    }
  }

  showCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
    
      let selected_element_id = this.devconfigForm.get(`${this.method_string}`).value;

      

      let clist = this.devconfigDetailService.unit_clist_item[methodString];

      for (let i = 0; i< clist.length; i++) {
        if ( clist[i].id == selected_element_id ) {
          this.devconfigForm.get('filterstring').setValue(clist[i].name);
          this.filter_string = clist[i].name;
        }
      }
     
      this.managePageIndex(this.method_string);
      this.loadDevConfigDetail(this.method_string);
  }

  setValues() {
      this.devconfigForm.get('name').setValue(this.devconfig.name);

      let created          = this.devconfig.createdwhen? new Date(`${this.devconfig.createdwhen}`) : '';
      let lastmodifieddate = this.devconfig.lastmodifieddate? new Date(`${this.devconfig.lastmodifieddate}`) : '';

      this.devconfigForm.get('created').setValue(this.dateFormat(created));
      this.devconfigForm.get('createdbyname').setValue(this.devconfig.createdbyname);
      this.devconfigForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.devconfigForm.get('lastmodifiedbyname').setValue(this.devconfig.lastmodifiedbyname);
  }

  getValues(dateTime: any, mode: string) {
    this.devconfigDetail.name             = this.devconfigForm.get('name').value || '',
    this.devconfigDetail.isactive         = this.devconfig.isactive || true;
    // this.devconfigDetail.deletedwhen      = this.devconfig.deletedwhen || '';
    // this.devconfigDetail.deletedby        = this.devconfig.deletedby || 0;

    if( mode  == "save" ) {
      this.devconfigDetail.id               = this.devconfig.id || 0;
      this.devconfigDetail.createdwhen      = this.devconfig.createdwhen;
      this.devconfigDetail.createdby        = this.devconfig.createdby;
      this.devconfigDetail.lastmodifieddate = dateTime;
      this.devconfigDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.devconfigDetail.id               = 0;
      this.devconfigDetail.createdwhen      = dateTime;
      this.devconfigDetail.createdby        = this.userID;
      this.devconfigDetail.lastmodifieddate = dateTime;
      this.devconfigDetail.lastmodifiedby   = this.userID;
    }
    
  }

  onKey(event: any) {
    
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
      if (this.method_string == 'devconfigcmd') {
        this.managePageIndex(this.method_string);
        
        this.dataSourceDevConfigCmd.loadDevConfigCmd(this.userConncode, this.userID, 0, 10, this.filter_name, this.filter_string, "DevConfigCmd_TList");
      } else {
        this.managePageIndex(this.method_string);
        this.loadDevConfigDetail(this.method_string);
      }
    }

    
  }

  onClickSearch(name: any) {
    
    this.method_string = 'devconfigcmd';

    if (name == 'command') {
      this.filter_name = 'command';
    } else if (name == 'syscommand') {
      this.filter_name = 'syscommand';
    }
  }

  clearFilter() {
    
    this.filter_string = '';
    this.devconfigForm.get('filterstring').setValue(this.filter_string);

    // if (this.method_string == 'model') {
    // }
    this.managePageIndex(this.method_string);
    this.loadDevConfigDetail(this.method_string);
  }

  editCommand(devconfigcmd: any) {
    
    this.command_edit_flag = true;
    this.currentCmdid = devconfigcmd.id;

    this.devconfigForm.get('command').setValue(devconfigcmd.commandid);
    this.devconfigForm.get('syscommand').setValue(devconfigcmd.syscommandid);
  }

  saveNewCommand() {
    

    let selectedCommand = this.devconfigForm.get('command').value;
    let selectedSysCommand = this.devconfigForm.get('syscommand').value;
    
    if (selectedCommand == null || selectedSysCommand == null) {
      alert("Please choose command detail!");
    } else {
      if (this.devconfigDetailService.devconfig_id == 0) {
        
        let today = new Date().toISOString();
        this.getValues(today, "add");
        

        this.devconfigDetailService.saveDevConfigDetail(this.userConncode, this.userID, this.devconfigDetail)
        .subscribe((result: any) => {
          
          if ((result.responseCode == 200)||(result.responseCode == 100)) {
            alert("Success!");
            this.devconfigDetailService.devconfig_id = result.TrackingXLAPI.DATA[0].id;
            this.devconfigDetailService.saveDevConfigCmd(this.userConncode, this.userID, 0, selectedCommand, selectedSysCommand, this.devconfigDetailService.devconfig_id)
            .subscribe((res: any) => {
              
              this.dataSourceDevConfigCmd.loadDevConfigCmd(this.userConncode, this.userID, 0, 10, '', '', "DevConfigCmd_TList");
              this.command_edit_flag = false;
              this.devconfigForm.get('command').setValue(0);
              this.devconfigForm.get('syscommand').setValue(0);
              
            });
            // this.router.navigate(['system/devconfigs/devconfigs']);
          }
        });
      } else {
        this.devconfigDetailService.saveDevConfigCmd(this.userConncode, this.userID, 0, selectedCommand, selectedSysCommand, this.devconfigDetailService.devconfig_id)
        .subscribe((res: any) => {
          
          this.dataSourceDevConfigCmd.loadDevConfigCmd(this.userConncode, this.userID, 0, 10, '', '', "DevConfigCmd_TList");
          this.command_edit_flag = false;
          this.devconfigForm.get('command').setValue(0);
          this.devconfigForm.get('syscommand').setValue(0);
          
        });
      }
    }
  }

  saveCurrentCommand() {
    
    let selectedCommand = this.devconfigForm.get('command').value;
    let selectedSysCommand = this.devconfigForm.get('syscommand').value;
    this.devconfigDetailService.saveDevConfigCmd(this.userConncode, this.userID, this.currentCmdid, selectedCommand, selectedSysCommand, this.devconfigDetailService.devconfig_id)
    .subscribe((res: any) => {
      
      // this.dataSourceDevConfigCmd =  new DevConfigDetailDataSource(this.devconfigDetailService);
      this.dataSourceDevConfigCmd.loadDevConfigCmd(this.userConncode, this.userID, 0, 10, '', '', "DevConfigCmd_TList");

      this.command_edit_flag = false;
      this.devconfigForm.get('command').setValue(0);
      this.devconfigForm.get('syscommand').setValue(0);
      
    })
  }

  deleteCurrentCommand(devconfig): void {
    const dialogConfig = new MatDialogConfig();
    

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
      devconfig, flag: 'delete_cmd'
    };

    const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if ( result )
      { 
          
      } else {
          
      }
    });
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

  saveDevConfig(): void {
    
    let today = new Date().toISOString();
    this.getValues(today, "save");
    

    if (this.devconfigDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.devconfigDetailService.saveDevConfigDetail(this.userConncode, this.userID, this.devconfigDetail)
      .subscribe((result: any) => {
        
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['system/devconfigs/devconfigs']);
        }
      });
    }
  }

  addDevConfig(): void {
    
    let today = new Date().toISOString();
    this.getValues(today, "add");
    

    if (this.devconfigDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.devconfigDetailService.saveDevConfigDetail(this.userConncode, this.userID, this.devconfigDetail)
      .subscribe((result: any) => {
        
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['system/devconfigs/devconfigs']);
        }
      });
    }
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       devconfig: "", flag: flag
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

  navigatePageEvent() {
    
    this.paginatorDevConfigCmd.pageIndex = this.dataSourceDevConfigCmd.page_index - 1;
    this.dataSourceDevConfigCmd.loadDevConfigCmd(this.userConncode, this.userID, this.paginatorDevConfigCmd.pageIndex, this.paginatorDevConfigCmd.pageSize,  this.filter_name, this.filter_string, "DevConfigCmd_TList");
  }
}

