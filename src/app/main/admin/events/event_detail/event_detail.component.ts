import { Component, OnInit, ViewEncapsulation,  } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { EventDetail } from 'app/main/admin/events/model/event.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { EventDetailService } from 'app/main/admin/events/services/event_detail.service';

import { locale as eventsEnglish } from 'app/main/admin/events/i18n/en';
import { locale as eventsSpanish } from 'app/main/admin/events/i18n/sp';
import { locale as eventsFrench } from 'app/main/admin/events/i18n/fr';
import { locale as eventsPortuguese } from 'app/main/admin/events/i18n/pt';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event_detail.component.html',
  styleUrls: ['./event_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class EventDetailComponent implements OnInit
{
  event_detail: any;
  public event: any;
  pageType: string;
  userConncode: string;
  userID: number;

  eventForm: FormGroup;
  eventDetail: EventDetail = {};

  displayedColumns: string[] = ['name'];
 
  filter_string: string = '';
  method_string: string = '';
  
  constructor(
    public eventDetailService: EventDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(eventsEnglish, eventsSpanish, eventsFrench, eventsPortuguese);

    this.event = localStorage.getItem("event_detail")? JSON.parse(localStorage.getItem("event_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.event != '' )
    {
      this.pageType = 'edit';
    }
    else
    {
      console.log(this.event);
      this.pageType = 'new';
    }

    this.filter_string = '';
  }

  ngOnInit(): void {
    console.log(this.event);
  
    this.eventForm = this._formBuilder.group({
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
      this.eventForm.get('name').setValue(this.event.name);

      let created          = this.event.createdwhen? new Date(`${this.event.createdwhen}`) : '';
      let lastmodifieddate = this.event.lastmodifieddate? new Date(`${this.event.lastmodifieddate}`) : '';

      this.eventForm.get('created').setValue(this.dateFormat(created));
      this.eventForm.get('createdbyname').setValue(this.event.createdbyname);
      this.eventForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.eventForm.get('lastmodifiedbyname').setValue(this.event.lastmodifiedbyname);
  }

  getValues(dateTime: any, mode: string) {
    this.eventDetail.name             = this.eventForm.get('name').value || '',
    this.eventDetail.isactive         = this.event.isactive || true;
    // this.eventDetail.deletedwhen      = this.event.deletedwhen || '';
    // this.eventDetail.deletedby        = this.event.deletedby || 0;

    if( mode  == "save" ) {
      this.eventDetail.id               = this.event.id;
      this.eventDetail.createdwhen      = this.event.createdwhen;
      this.eventDetail.createdby        = this.event.createdby;
      this.eventDetail.lastmodifieddate = dateTime;
      this.eventDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.eventDetail.id               = 0;
      this.eventDetail.createdwhen      = dateTime;
      this.eventDetail.createdby        = this.userID;
      this.eventDetail.lastmodifieddate = dateTime;
      this.eventDetail.lastmodifiedby   = this.userID;
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

  saveEvent(): void {
    console.log("saveEvent");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(this.eventDetail);

    if (this.eventDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.eventDetailService.saveEventDetail(this.userConncode, this.userID, this.eventDetail)
      .subscribe((result: any) => {
        console.log(result);
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['admin/events/events']);
        }
      });
    }
  }

  addEvent(): void {
    console.log("addEvent");
    let today = new Date().toISOString();
    this.getValues(today, "add");
    console.log(this.eventDetail);

    if (this.eventDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.eventDetailService.saveEventDetail(this.userConncode, this.userID, this.eventDetail)
      .subscribe((result: any) => {
        console.log(result);
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['admin/events/events']);
        }
      });
    }
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       event: "", flag: flag
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
