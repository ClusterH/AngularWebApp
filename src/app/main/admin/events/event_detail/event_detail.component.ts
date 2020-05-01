import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
// import {MatTableDataSource} from '@angular/material/table';

import { Observable, BehaviorSubject, of } from 'rxjs';
// import {catchError, finalize} from "rxjs/operators";

import { SelectionModel } from '@angular/cdk/collections';
import * as $ from 'jquery';

// import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

import { EventDetail } from 'app/main/admin/events/model/event.model';
import { CourseDialogComponent } from "../dialog/dialog.component";
import { EventDetailDataSource } from "app/main/admin/events/services/event_detail.datasource";

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { EventDetailService } from 'app/main/admin/events/services/event_detail.service';

import { locale as eventsEnglish } from 'app/main/admin/events/i18n/en';
import { locale as eventsSpanish } from 'app/main/admin/events/i18n/sp';
import { locale as eventsFrench } from 'app/main/admin/events/i18n/fr';
import { locale as eventsPortuguese } from 'app/main/admin/events/i18n/pt';

// export interface EventConditionListElement {
//   evcode: string;
//   description: string;
// }


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
  evType: string = 'new';
  userConncode: string;
  userID: number;
  userObjectList: any;

  eventForm: FormGroup;
  eventDetail: EventDetail = {};

  eventConditionList: string[];

  displayedColumns: string[] = ['name'];
  displayedConditionColumns: string[] = ['id', 'description'];
  displayedUnitColumns: string[] = ['id', 'name'];

  pageIndex= 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  ev_condition: string = '';
  speed_condition: string = '';
  speed_unit: string = '';
  longstop_unit: string = '';
  idle_unit: string = '';
  noreporton_unit: string = '';
  noreportoff_unit: string = '';
  fuel_tank: string = '';
  fuel_condition: string = '';
  fuel_unit: string = '';
  fuelmin: number = 0;
  fuelmax: number = 5;
  temp_sensor: string = '';
  temp_condition: string = '';
  temp_unit: string = '';
  tempmin: number = 0;
  tempmax: number = 5;
  poi_condition: string = '';
  zone_condition: string = '';

  dataSource: EventDetailDataSource;

  dataSourceEvCondition: EventDetailDataSource;
  dataSourceCompany: EventDetailDataSource;
  dataSourceGroup:   EventDetailDataSource;
  dataSourceUnit:   EventDetailDataSource;

  // public loadingSubjectEV_SPEED     = new BehaviorSubject<boolean>(true);
  // public loadingSubjectEV_OFFHOURS       = new BehaviorSubject<boolean>(true);
  // public loadingSubjectEV_LATESTART        = new BehaviorSubject<boolean>(true);
  // public loadingSubjectEV_LONGSTOP      = new BehaviorSubject<boolean>(true);
  // public loadingSubjectEV_IDLE        = new BehaviorSubject<boolean>(true);
  // public loadingSubjectEV_NODATA   = new BehaviorSubject<boolean>(true);
  // public loadingSubjectEV_FUEL       = new BehaviorSubject<boolean>(true);
  // public loadingSubjectEV_TEMP    = new BehaviorSubject<boolean>(true);
  // public loadingSubjectEV_ZONE    = new BehaviorSubject<boolean>(true);
  // public loadingSubjectEV_POI = new BehaviorSubject<boolean>(true);
  // public loadingSubjectEV_SENSOR = new BehaviorSubject<boolean>(true);
  // public loadingSubjectEV_DEVICE     = new BehaviorSubject<boolean>(true);
  // public loadingSubjectEV_ROUTE     = new BehaviorSubject<boolean>(true);
  // public loadingSubjectEV_TOW     = new BehaviorSubject<boolean>(true);

  // public loadingSubject

  selectionAmount: any;

  filter_string: string = '';
  method_string: string = '';

  loadUnitList_flag: boolean = false;

  unitSelection = new SelectionModel<Element>(false, []);

  @ViewChild(MatPaginator, {static: true})
    paginatorCompany: MatPaginator;
  @ViewChild('paginatorGroup', {read: MatPaginator, static: true})
    paginatorGroup: MatPaginator;
  @ViewChild('paginatorUnit', {read: MatPaginator, static: true})
    paginatorUnit: MatPaginator;
  
  constructor(
    public eventDetailService: EventDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(eventsEnglish, eventsSpanish, eventsFrench, eventsPortuguese);

    this.event = localStorage.getItem("event_detail")? JSON.parse(localStorage.getItem("event_detail")) : '';
   
    console.log(this.event);

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;
    this.userObjectList = JSON.parse(localStorage.getItem('userObjectList'));

    this.event_detail = this.event;
    this.event_detail.conncode = this.userConncode;
    this.event_detail.userid= this.userID;
    
    delete this.event_detail.company;
    delete this.event_detail.group;


    console.log(this.userObjectList);

    if ( this.event != '' )
    {
      this.pageType = 'edit';
      this.eventDetailService.current_eventID = this.event.id;
    }
    else
    {
      this.pageType = 'new';
      this.eventDetailService.current_eventID = 0;
    }

    this.filter_string = '';
  }

  ngOnInit(): void {

    this.eventForm = this._formBuilder.group({
      name: [null, Validators.required],
      
      company: [null],
      group: [null],
      unit: [null],
      ev_condition : [null],
      speedinput: [null],
      offhourstart: [null],
      offhourend: [null],
      latestart: [null],
      longstopinput: [null],
      idleinput: [null],
      noreportoninput: [null],
      noreportoffinput: [null],
      fuelinput: [null],
      tempinput: [null],
      deviceinput: [null],
      filterstring: [null],
      wholeCompany: [null],
      // unit_checkbox: [null],

    });

    this.dataSourceEvCondition = new EventDetailDataSource(this.eventDetailService);
    this.dataSourceCompany = new EventDetailDataSource(this.eventDetailService);
    this.dataSourceGroup = new EventDetailDataSource(this.eventDetailService);
    this.dataSourceUnit = new EventDetailDataSource(this.eventDetailService);

    this.dataSourceEvCondition.loadEventCondition(this.userConncode, this.userID, this.event.id);

    this.dataSourceCompany.loadCompanyDetail(this.userConncode, this.userID, 0, 10, this.event.company, "company_clist");
    this.dataSourceGroup  .loadGroupDetail(this.userConncode, this.userID, 0, 10, this.event.group, this.event.companyid, "group_clist");

    if ((this.event.isfullcompany == 'false') && (this.event.isfullgroup == 'false')) {
      this.loadUnitList_flag = false;
      this.dataSourceUnit.loadUnitDetail(this.userConncode, this.userID, 0, 20, this.event.companyid, this.event.groupid, this.event.id);
    }

    this.unitSelection.isSelected = this.isCheckedRow.bind(this);

    this.setValues();
  }

  isCheckedRow(row: any): boolean {
    // console.log(row);
    const found = this.unitSelection.selected.find(el => el.id === row.id);
    // console.log("found: " + found);
    if (found) { return true; }
    return false;
  }

  // isAllSelected() {
  //   const numSelected = this.unitSelection.selected.length;
  //   const page = this.paginatorUnit.pageSize;
  //   return numSelected === page;
  // }

  // /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected() ? 
  //   this.unitSelection.clear() : this.selectRows();
  // }

  // selectRows() {
  //   for (let index = 0; index < this.paginatorUnit.pageSize; index++) {
  //     this.unitSelection.select(this.dataSourceUnit.currentPage_unit_data[index]);
  //     this.selectionAmount = this.unitSelection.selected.length;
  //   }
  // }

  ngAfterViewInit() {
    console.log("ngAfterViewInit:");

    // var node = $("div.page_index");
    // var node_length = node.length;
    // $("div.page_index").remove();
    // $("button.mat-paginator-navigation-previous.mat-icon-button.mat-button-base").after(node[node_length - 1]);
    
    merge(this.paginatorCompany.page)
    .pipe(
      tap(() => {
        this.loadEventDetail("company")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorGroup.page)
    .pipe(
      tap(() => {
        this.loadEventDetail("group")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    // merge(this.paginatorUnit.page)
    // .pipe(
    //   tap(() => {
    //     this.loadEventDetail("unit")
    //   })
    // )
    // .subscribe( (res: any) => {
    //     console.log(res);
    // });
  }

  loadEventDetail(method_string: string) {
    if (method_string == 'company') {
      this.dataSourceCompany.loadCompanyDetail(this.userConncode, this.userID, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
    
    } else if (method_string == 'group') {
      let companyid = this.eventForm.get('company').value;
      this.dataSourceGroup.loadGroupDetail(this.userConncode, this.userID, this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, companyid, `${method_string}_clist`)
    
    } else if (method_string == 'unit') {
      if (this.eventForm.get('wholeCompany').value == false) {
        this.loadUnitList_flag = false;
        this.dataSourceUnit.loadUnitDetail(this.userConncode, this.userID, this.paginatorUnit.pageIndex, this.paginatorUnit.pageSize, this.event.companyid, this.event.groupid, this.event.id);
      }
    }
  }

  managePageIndex(method_string: string) {
    switch(method_string) {
      case 'company':
        this.paginatorCompany.pageIndex = 0;
      break;

      case 'group':
        this.paginatorGroup.pageIndex = 0;
      break;

      case 'unit':
        this.paginatorUnit.pageIndex = 0;
      break;
    }
  }

  showCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
   
    let selected_element_id = this.eventForm.get(`${this.method_string}`).value;

    // console.log(methodString, this.eventDetailService.unit_clist_item[methodString], selected_element_id );

    let clist = this.eventDetailService.unit_clist_item[methodString];

    for (let i = 0; i< clist.length; i++) {
      if ( clist[i].id == selected_element_id ) {
        this.eventForm.get('filterstring').setValue(clist[i].name);
        this.filter_string = clist[i].name;
      }
    }
    
    this.managePageIndex(this.method_string);
    this.loadEventDetail(this.method_string);
  }

  onConditionChange(selected: any){
    console.log(selected.value);

    let checkedCondition =  this.eventDetailService.eventConditionList.find((event: any) => event.evcode == selected.value);
    console.log(checkedCondition);

    if (checkedCondition !== undefined) {
      alert("This Event already exist. Please choose another new one!");
      this.eventForm.get('ev_condition').setValue('none');
      this.ev_condition = 'none';
      this.evType = 'new';

    } else {
      this.ev_condition = selected.value;
      this.evType = 'new';
    }
  }

  editEvCondition(evcondition: any) {
    console.log(evcondition);

    this.eventForm.get('ev_condition').setValue(evcondition.evcode);
    this.ev_condition = evcondition.evcode;
    this.evType = 'old';
  }

  onCompanyChange(event: any) {
    console.log(event);
    let current_companyID = this.eventForm.get('company').value;

    this.dataSourceGroup.loadGroupDetail(this.userConncode, this.userID, 0, 10, "", current_companyID, "group_clist");
    if (this.loadUnitList_flag == false) {
      this.dataSourceUnit.loadUnitDetail(this.userConncode, this.userID, 0, 20, current_companyID, 0, this.event.id);
    }
  }

  onGroupChange(event: any) {
    console.log(event);
    let current_companyID = this.eventForm.get('company').value;
    let current_groupID = this.eventForm.get('group').value;
    
    if (this.loadUnitList_flag == false) {
      this.dataSourceUnit.loadUnitDetail(this.userConncode, this.userID, 0, 20, current_companyID, current_groupID, this.event.id);
    }
  }

  selectWholeCompany(event: any) {
    console.log(event.checked);
    if (event.checked == false) {
      this.loadUnitList_flag = false;

      let current_companyID = this.eventForm.get('company').value;
      let current_groupID = this.eventForm.get('group').value;

      this.dataSourceUnit = new EventDetailDataSource(this.eventDetailService); 
      this.dataSourceUnit.loadUnitDetail(this.userConncode, this.userID, 0, 20, current_companyID, current_groupID, this.event.id);
    } else {
       this.loadUnitList_flag = true;
    }
    // event.checked

  }

  clearFilter() {
    console.log(this.filter_string);
    this.filter_string = '';
    this.eventForm.get('filterstring').setValue(this.filter_string);

    // if (this.method_string == 'model') {
    // }
    this.managePageIndex(this.method_string);
    this.loadEventDetail(this.method_string);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
     
      this.managePageIndex(this.method_string);
      this.loadEventDetail(this.method_string);
    }

    console.log(this.filter_string);
  }

  setValues() {
      this.eventForm.get('name').setValue(this.event.name);

      // Speed Condition
      if (this.event.isspeed == 'true') {
        this.speed_condition = this.event.speedcondition;
        this.eventForm.get('speedinput').setValue(this.event.speed);
        if (this.userObjectList.lengthunitid == "4") {
          this.speed_unit = 'mph';
        } else {
          this.speed_unit = 'km'
        }
      }

      //OffHourActivity Condition
      if (this.event.isoffhours == 'true') {
        this.eventForm.get('offhourstart').setValue(this.convertNumberToTime(this.event.offhourstart));
        this.eventForm.get('offhourend').setValue(this.convertNumberToTime(this.event.offhourend));
      }

      //LateStart Condition
      if (this.event.islatestart == 'true') {
        this.eventForm.get('latestart').setValue(this.convertNumberToTime(this.event.startofday));
      }

      //LongStop Condition
      if (this.event.islongstop == 'true') {

        this.eventForm.get('longstopinput').setValue(this.checkMinHourDay(this.event.stoplength).split('-')[0]);
        this.longstop_unit = this.checkMinHourDay(this.event.stoplength).split('-')[1];
      }

      //IDLE Condition
      if (this.event.isidle == 'true') {
        this.eventForm.get('idleinput').setValue(this.checkMinHourDay(this.event.idletime).split('-')[0]);
        this.idle_unit = this.checkMinHourDay(this.event.idletime).split('-')[1];
        
      }

      //NoReporting Condition
      if (this.event.isnodata !== '0') {
        this.eventForm.get('noreportoninput').setValue(this.event.nodataintervalon);
        this.eventForm.get('noreportoffinput').setValue(this.event.nodataintervaloff);
        this.noreporton_unit = 'minute';
        this.noreportoff_unit = 'minute';
      }

      //Fuel Condition
      if (this.event.isfuel == 'true') {
        this.fuel_tank = this.event.fueltank;
        this.fuel_condition = this.event.fuelcondition;
        this.fuelmin = this.event.fuelmin;
        this.fuelmax = this.event.fuelmax;
        this.eventForm.get('fuelinput').setValue(this.event.fuelchange);

        if (this.userObjectList.fuelunitid == "1") {
          this.speed_unit = 'liters';
        } else {
          this.speed_unit = 'gallons'
        }
      }

      //Temp Condition
      if (this.event.istemp == 'true') {
        this.temp_sensor = this.event.tempsensor;
        this.fuel_condition = this.event.tempcondition;
        this.fuelmin = this.event.tempmin;
        this.fuelmax = this.event.tempmax;
        this.eventForm.get('fuelinput').setValue(this.event.tempchange);

        if (this.userObjectList.tempunitid == "1") {
          this.temp_unit = 'celsius';
        } else {
          this.temp_unit = 'fahrenheit';
        }
      }

      //Zone Condition
      if (this.event.iszone !== '0') {
        this.zone_condition = this.event.zonecondition;
      }

      //POI Condition
      if (this.event.ispoi == 'true') {
        this.eventForm.get('deviceinput').setValue(this.event.devicecode);
      }

      //Device Condition
      if (this.event.ishardware == 'true') {
        this.poi_condition = this.event.poicondition;
      }

      this.eventForm.get('company').setValue(this.event.companyid);
      this.eventForm.get('group').setValue(this.event.groupid);
      let wholeCompany = this.event.isfullcompany? this.event.isfullcompany : this.event.isfullgroup;
      console.log(wholeCompany);
      if (wholeCompany == true) {
        this.eventForm.get('wholeCompany').setValue(true);
      
      } else {
        this.eventForm.get('wholeCompany').setValue(false);
      }
  }

  checkMinHourDayUnit(time: number, unit: string) {
    console.log(unit);
    if (unit == 'minute') {
      return time;
      
    } else if (unit == 'hour') {
      console.log( time* 60);
      return time * 60;

    } else if (unit == 'day'){
      return time * 60 * 24;
    }
  }

  checkMinHourDay(time: any) {
    if (Number(time) >= 1440 ) {
      let days = Math.ceil(Number(time)/(60*24));
      return days.toString() + '-day';
      
    } else if (Number(time) >= 60 ) {
      let hours = Math.ceil(Number(time)/60);
      return hours.toString() + '-hour';

    } else {
      return time + '-minute';
    }
  }

  convertNumberToTime(input: string) {
    let hours = (Math.floor(Number(input)/60)).toString();
    let minutes = (Math.floor(Number(input) - Number(hours)*60)).toString();

    if (Number(hours) < 10 ) {hours = "0" + hours};
    if (Number(minutes) < 10 ) {minutes = "0" + minutes};

    console.log(hours + ':' + minutes);

    return hours + ':' + minutes;
    
  }

  convertTimeToNumber(input: string) {
    console.log(input);
    
    let time = Number(input.split(':')[0]) * 60 + Number(input.split(':')[1]);
    console.log(time);
    return time;
  }

  addNewCondition() {
    console.log('add new condition: ');
  }

  getValues( mode: string) {
    this.event_detail.name = this.eventForm.get('name').value || '';

    if( mode  == "save" ) {
      this.event_detail.id = this.event.id;
    } else if ( mode == "add" ) {
      this.event_detail.id = 0;
    }
  }

  // dateFormat(date: any) {
  //   let str = '';

  //   if (date != '') {
  //     str = 
  //       ("00" + (date.getMonth() + 1)).slice(-2) 
  //       + "/" + ("00" + date.getDate()).slice(-2) 
  //       + "/" + date.getFullYear() + " " 
  //       + ("00" + date.getHours()).slice(-2) + ":" 
  //       + ("00" + date.getMinutes()).slice(-2) 
  //       + ":" + ("00" + date.getSeconds()).slice(-2); 
  //   }

  //   return str;
  // }

  addEvCondition(type: string) {
    let selectedCondition = this.eventForm.get('ev_condition').value;
    let lang: string;
    if( this.userObjectList.languageid == '1' ) { lang = 'en'}
    else if( this.userObjectList[0].languageid == '2') {lang = 'es'}
    else if( this.userObjectList[0].languageid == '3') {lang = 'fr'}
    else if( this.userObjectList[0].languageid == '4') {lang = 'pt'}

    switch(selectedCondition) {
      //EV_SPEED
      case 'EV_SPEED':
        let param_speed = {
          'conncode': this.userConncode.toString(),
          'userid': this.userID.toString(),
          'lang': `${lang}`,
          'speed': (this.eventForm.get('speedinput').value).toString(),
          'speedcondition': this.speed_condition.toString(),
          'lengthunitid': (this.userObjectList[0].lengthunitid).toString(),
          'method': 'GetSpeedEventDescription'
        }
       
        this.saveEvCondition('EV_SPEED', param_speed, type);
        
        this.event_detail.isspeed = 'true';
        this.event_detail.speed = (this.eventForm.get('speedinput').value).toString();
        this.event_detail.speedcondition = this.speed_condition;

        this.evType = 'old';

        break;

      // EV_OFFHOURS
      case 'EV_OFFHOURS':
        let param_offhours = {
          'conncode': this.userConncode.toString(),
          'userid': this.userID.toString(),
          'lang': `${lang}`,
          'offhourstart': this.convertTimeToNumber(this.eventForm.get('offhourstart').value).toString(),
          'offhourend': this.convertTimeToNumber(this.eventForm.get('offhourend').value).toString(),
          'method': 'GetOffHoursEventDescription'
        }
        
        this.saveEvCondition('EV_OFFHOURS', param_offhours, type);

        this.event_detail.isoffhours = 'true';
        this.event_detail.offhourstart = this.convertTimeToNumber(this.eventForm.get('offhourstart').value).toString();
        this.event_detail.offhourend = this.convertTimeToNumber(this.eventForm.get('offhourend').value).toString();

        this.evType = 'old';

        break;

      // EV_OFFHOURS
      case 'EV_LATESTART':
        let param_latestart = {
          'conncode': this.userConncode.toString(),
          'userid': this.userID.toString(),
          'lang': `${lang}`,
          'startofday': this.convertTimeToNumber(this.eventForm.get('latestart').value).toString(),
          'method': 'GetLateStartEventDescription'
        }

        this.saveEvCondition('EV_LATESTART', param_latestart, type);
        
        this.event_detail.islatestart = 'true';
        this.event_detail.startofday = this.convertTimeToNumber(this.eventForm.get('latestart').value).toString();

        this.evType = 'old';

        break;

      // EV_LONGSTOP
      case 'EV_LONGSTOP':
        let param_longstop = {
          'conncode': this.userConncode.toString(),
          'userid': this.userID.toString(),
          'lang': `${lang}`,
          'stoplength': this.checkMinHourDayUnit(this.eventForm.get('longstopinput').value, this.longstop_unit).toString(),
          'method': 'GetLongStopEventDescription'
        }

        this.saveEvCondition('EV_LONGSTOP', param_longstop, type);
        
        this.event_detail.islongstop = 'true';
        this.event_detail.stoplength = this.checkMinHourDayUnit(this.eventForm.get('longstopinput').value, this.longstop_unit).toString();

        this.evType = 'old';

        break;

      // EV_IDLE
      case 'EV_IDLE':
        let param_idle = {
          'conncode': this.userConncode.toString(),
          'userid': this.userID.toString(),
          'lang': `${lang}`,
          'idletime': this.checkMinHourDayUnit(this.eventForm.get('idleinput').value, this.idle_unit).toString(),
          'method': 'GetIdleEventDescription'
        }

        this.saveEvCondition('EV_IDLE', param_idle, type);
        
        this.event_detail.isidle = 'true';
        this.event_detail.idletime = this.checkMinHourDayUnit(this.eventForm.get('idleinput').value, this.idle_unit).toString();

        this.evType = 'old';

        break;

      // EV_NODATA
      case 'EV_NODATA':
        let param_nodata = {
          'conncode': this.userConncode.toString(),
          'userid': this.userID.toString(),
          'lang': `${lang}`,
          'nodataintervalon': this.checkMinHourDayUnit(this.eventForm.get('noreportoninput').value, this.noreporton_unit).toString(),
          'nodataintervaloff': this.checkMinHourDayUnit(this.eventForm.get('noreportoffinput').value, this.noreportoff_unit).toString(),
          'method': 'GetNoDataEventDescription'
        }

        this.saveEvCondition('EV_NODATA', param_nodata, type);
        
        this.event_detail.isnodata = 'true';
        this.event_detail.nodataintervalon = this.checkMinHourDayUnit(this.eventForm.get('noreportoninput').value, this.noreporton_unit).toString();
        this.event_detail.nodataintervaloff = this.checkMinHourDayUnit(this.eventForm.get('noreportoffinput').value, this.noreportoff_unit).toString();

        this.evType = 'old';

        break;
    }
  }

  saveEvCondition(evcode: string, param: any, type: string) {
    this.eventDetailService.saveEvCondition(param)
    .subscribe((res: any) => {
      console.log(res);
      if (res.responseCode == 100 || res.responseCode == 200) {
        if (type == 'new') {
          this.eventDetailService.eventConditionList = this.eventDetailService.eventConditionList.concat(res.TrackingXLAPI.DATA);
        } else if (type == 'old') {
          let selectedCondition =  this.eventDetailService.eventConditionList.findIndex((event: any) => event.evcode == evcode);
          console.log(selectedCondition);
  
          this.eventDetailService.eventConditionList[selectedCondition].description = res.TrackingXLAPI.DATA[0].description;
        }
  
        console.log(this.eventDetailService.eventConditionList);
  
        this.dataSourceEvCondition.eventsSubject.next(this.eventDetailService.eventConditionList);
        
      } else {
        alert('Please check entered condition detail again');
      }
    });
  }
 
  saveEvent(): void {
    console.log("saveEvent");
       // let today = new Date().toISOString();
    this.getValues("save");
    // console.log(this.eventDetail);

    if (this.event_detail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.event_detail.name = this.eventForm.get('name').value;
      this.event_detail.method = 'event_save';

      this.eventDetailService.saveEventDetail(this.event_detail)
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
    // let today = new Date().toISOString();
    this.getValues("add");
    console.log(this.event_detail);

    if (this.event_detail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.eventDetailService.saveEventDetail(this.event_detail)
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

  paginatorClick(paginator) {
    console.log("paginatorclick: ", paginator, this.unitSelection.selected);
   
    this.dataSourceUnit.loadUnitDetail(this.userConncode, this.userID, paginator.pageIndex, paginator.pageSize, this.event.companyid, this.event.groupid, this.event.id);
  }

  // navigatePageEvent() {
  //   console.log("pageEvent");
  //   this.paginatorUnit.pageIndex = this.dataSourceUnit.page_index - 1;
  //   this.dataSourceUnit.loadUnitDetail(this.userConncode, this.userID, this.paginatorUnit.pageIndex, this.paginatorUnit.pageSize,  this.event.companyid, this.event.groupid, this.event.id);
  // }
}
