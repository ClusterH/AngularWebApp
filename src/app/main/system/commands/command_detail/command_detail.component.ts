import { Component, OnInit, ViewEncapsulation,  } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { CommandDetail } from 'app/main/system/commands/model/command.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { CommandDetailService } from 'app/main/system/commands/services/command_detail.service';

import { locale as commandsEnglish } from 'app/main/system/commands/i18n/en';
import { locale as commandsSpanish } from 'app/main/system/commands/i18n/sp';
import { locale as commandsFrench } from 'app/main/system/commands/i18n/fr';
import { locale as commandsPortuguese } from 'app/main/system/commands/i18n/pt';

@Component({
  selector: 'app-command-detail',
  templateUrl: './command_detail.component.html',
  styleUrls: ['./command_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class CommandDetailComponent implements OnInit
{
  command_detail: any;
  public command: any;
  pageType: string;
  userConncode: string;
  userID: number;

  commandForm: FormGroup;
  commandDetail: CommandDetail = {};

  displayedColumns: string[] = ['name'];
 
  filter_string: string = '';
  method_string: string = '';
  
  constructor(
    public commandDetailService: CommandDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(commandsEnglish, commandsSpanish, commandsFrench, commandsPortuguese);

    this.command = localStorage.getItem("command_detail")? JSON.parse(localStorage.getItem("command_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.command != '' )
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
    
  
    this.commandForm = this._formBuilder.group({
      name               : [null, Validators.required],
      isactive           : [null, Validators.required],
      created            : [{value: '', disabled: true}, Validators.required],
      createdbyname      : [{value: '', disabled: true}, Validators.required],
      lastmodifieddate   : [{value: '', disabled: true}, Validators.required],
      lastmodifiedbyname : [{value: '', disabled: true}, Validators.required],
  });

  this.setValues();
  }

  setValues() {
      this.commandForm.get('name').setValue(this.command.name);

      let created          = this.command.createdwhen? new Date(`${this.command.createdwhen}`) : '';
      let lastmodifieddate = this.command.lastmodifieddate? new Date(`${this.command.lastmodifieddate}`) : '';

      this.commandForm.get('created').setValue(this.dateFormat(created));
      this.commandForm.get('createdbyname').setValue(this.command.createdbyname);
      this.commandForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.commandForm.get('lastmodifiedbyname').setValue(this.command.lastmodifiedbyname);
  }

  getValues(dateTime: any, mode: string) {
    this.commandDetail.name             = this.commandForm.get('name').value || '',
    this.commandDetail.isactive         = this.command.isactive || true;
    // this.commandDetail.deletedwhen      = this.command.deletedwhen || '';
    // this.commandDetail.deletedby        = this.command.deletedby || 0;

    if( mode  == "save" ) {
      this.commandDetail.id               = this.command.id;
      this.commandDetail.createdwhen      = this.command.createdwhen;
      this.commandDetail.createdby        = this.command.createdby;
      this.commandDetail.lastmodifieddate = dateTime;
      this.commandDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.commandDetail.id               = 0;
      this.commandDetail.createdwhen      = dateTime;
      this.commandDetail.createdby        = this.userID;
      this.commandDetail.lastmodifieddate = dateTime;
      this.commandDetail.lastmodifiedby   = this.userID;
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

  saveCommand(): void {
    
    let today = new Date().toISOString();
    this.getValues(today, "save");
    

    if (this.commandDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.commandDetailService.saveCommandDetail(this.userConncode, this.userID, this.commandDetail)
      .subscribe((result: any) => {
        
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['system/commands/commands']);
        }
      });
    }
  }

  addCommand(): void {
    
    let today = new Date().toISOString();
    this.getValues(today, "add");
    

    if (this.commandDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.commandDetailService.saveCommandDetail(this.userConncode, this.userID, this.commandDetail)
      .subscribe((result: any) => {
        
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['system/commands/commands']);
        }
      });
    }
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       command: "", flag: flag
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
