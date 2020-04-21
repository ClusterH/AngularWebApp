import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { PrivilegeDetail } from 'app/main/system/privileges/model/privilege.model';
import { CourseDialogComponent } from "../dialog/dialog.component";

import { Subject, merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { PrivilegeDetailService } from 'app/main/system/privileges/services/privilege_detail.service';
import { PrivilegeDetailDataSource } from "app/main/system/privileges/services/privilege_detail.datasource";

import { locale as privilegesEnglish } from 'app/main/system/privileges/i18n/en';
import { locale as privilegesSpanish } from 'app/main/system/privileges/i18n/sp';
import { locale as privilegesFrench } from 'app/main/system/privileges/i18n/fr';
import { locale as privilegesPortuguese } from 'app/main/system/privileges/i18n/pt';

@Component({
  selector: 'app-privilege-detail',
  templateUrl: './privilege_detail.component.html',
  styleUrls: ['./privilege_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class PrivilegeDetailComponent implements OnInit {
  privilege_detail: any;
  public privilege: any;
  pageType: string;
  userConncode: string;
  userID: number;

  privilegeObject_flag: boolean;

  privilegeForm: FormGroup;
  privilegeDetail: PrivilegeDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: PrivilegeDetailDataSource;

  dataSourcePrivType: PrivilegeDetailDataSource;
  dataSourcePrivObject: PrivilegeDetailDataSource;

  filter_string: string = '';
  method_string: string = '';

  @ViewChild(MatPaginator, { static: true })
    paginatorPrivType: MatPaginator;
  @ViewChild('paginatorPrivObject', {read: MatPaginator})
    paginatorPrivObject: MatPaginator;

  constructor(
    public privilegeDetailService: PrivilegeDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(privilegesEnglish, privilegesSpanish, privilegesFrench, privilegesPortuguese);

    this.privilege = localStorage.getItem("privilege_detail") ? JSON.parse(localStorage.getItem("privilege_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if (this.privilege != '') {
      if (this.privilege.typeid != 0) {
        console.log(this.privilege.typeid);

        this.privilegeDetailService.current_typeID = this.privilege.typeid;
        this.privilegeObject_flag = true;
      } else {
        this.privilegeDetailService.current_typeID = 0;
      }
      this.pageType = 'edit';
    }
    else {
      this.privilegeDetailService.current_typeID = 0;
      this.privilegeObject_flag = false;
      this.pageType = 'new';
    }

    this.filter_string = '';
  }

  ngOnInit(): void {
    console.log(this.privilege);

    this.dataSourcePrivType = new PrivilegeDetailDataSource(this.privilegeDetailService);
    this.dataSourcePrivObject = new PrivilegeDetailDataSource(this.privilegeDetailService);

    this.dataSourcePrivType.loadPrivilegeDetail(this.userConncode, this.userID, 0, 5, this.privilege.type, "privtype_clist");

    if (this.privilegeObject_flag) {
      this.dataSourcePrivObject.loadPrivilegeDetail(this.userConncode, this.userID, 0, 5,  this.privilege.object, "privobject_clist");
    }

    this.privilegeForm = this._formBuilder.group({
      name: [null, Validators.required],
      privtype: [null, Validators.required],
      privobject: [null, Validators.required],

      created: [{ value: '', disabled: true }, Validators.required],
      createdbyname: [{ value: '', disabled: true }, Validators.required],
      deletedwhen: [{ value: '', disabled: true }, Validators.required],
      deletedbyname: [{ value: '', disabled: true }, Validators.required],
      lastmodifieddate: [{ value: '', disabled: true }, Validators.required],
      lastmodifiedbyname: [{ value: '', disabled: true }, Validators.required],
      filterstring: [null, Validators.required],
    });

    this.setValues();
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit:");

    merge(this.paginatorPrivType.page)
      .pipe(
        tap(() => {
          this.loadPrivilegeDetail("privtype")
        })
      )
      .subscribe((res: any) => {
        console.log(res);
      });

    if (this.privilegeObject_flag) {
      merge(this.paginatorPrivObject.page)
        .pipe(
          tap(() => {

            this.loadPrivilegeDetail('privobject')
          })
        )
        .subscribe((res: any) => {
          console.log(res);
        });
    }

  }

  loadPrivilegeDetail(method_string: string) {
    console.log("loadPrivilegeDetail:" + method_string);
    if (method_string == 'privtype') {
      this.dataSourcePrivType.loadPrivilegeDetail(this.userConncode, this.userID, this.paginatorPrivType.pageIndex, this.paginatorPrivType.pageSize, this.filter_string,  `${method_string}_clist`)
    }
    else if (method_string == 'privobject') {
      this.dataSourcePrivObject.loadPrivilegeDetail(this.userConncode, this.userID, this.paginatorPrivObject.pageIndex, this.paginatorPrivObject.pageSize, this.filter_string,  `${method_string}_clist`)
    }
  }

  managePageIndex(method_string: string) {
    switch (method_string) {

      case 'privtype':
        this.paginatorPrivType.pageIndex = 0;
        break;
      case 'privobject':
        this.paginatorPrivObject.pageIndex = 0;
        break;
    }
  }

  showCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
    if (this.method_string == 'privobject' && !this.privilegeObject_flag) {
      alert("Please select Type first!");
    } else {
      let selected_element_id = this.privilegeForm.get(`${this.method_string}`).value;

      console.log(methodString, this.privilegeDetailService.unit_clist_item[methodString], selected_element_id);

      let clist = this.privilegeDetailService.unit_clist_item[methodString];

      for (let i = 0; i < clist.length; i++) {
        if (clist[i].id == selected_element_id) {
          this.privilegeForm.get('filterstring').setValue(clist[i].name);
          this.filter_string = clist[i].name;
        }
      }
    }

    this.managePageIndex(this.method_string);
    this.loadPrivilegeDetail(this.method_string);
  }

  clearFilter() {
    console.log(this.filter_string);
    this.filter_string = '';
    this.privilegeForm.get('filterstring').setValue(this.filter_string);

    this.managePageIndex(this.method_string);
    this.loadPrivilegeDetail(this.method_string);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if (this.filter_string.length >= 3 || this.filter_string == '') {

      this.managePageIndex(this.method_string);
      this.loadPrivilegeDetail(this.method_string);
    }

    console.log(this.filter_string);
  }

  setValues() {
    this.privilegeForm.get('name').setValue(this.privilege.name);
    this.privilegeForm.get('privtype').setValue(this.privilege.typeid);
    this.privilegeForm.get('privobject').setValue(this.privilege.objectid);

    let created = this.privilege.created ? new Date(`${this.privilege.created}`) : '';
    let deletedwhen = this.privilege.deletedwhen ? new Date(`${this.privilege.deletedwhen}`) : '';
    let lastmodifieddate = this.privilege.lastmodifieddate ? new Date(`${this.privilege.lastmodifieddate}`) : '';

    this.privilegeForm.get('created').setValue(this.dateFormat(created));
    this.privilegeForm.get('createdbyname').setValue(this.privilege.createdbyname);
    this.privilegeForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
    this.privilegeForm.get('deletedbyname').setValue(this.privilege.deletedbyname);
    this.privilegeForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
    this.privilegeForm.get('lastmodifiedbyname').setValue(this.privilege.lastmodifiedbyname);
    this.privilegeForm.get('filterstring').setValue(this.filter_string);
  }

  getValues(dateTime: any, mode: string) {
    this.privilegeDetail.name = this.privilegeForm.get('name').value || '',

    this.privilegeDetail.typeid      = this.privilegeForm.get('privtype').value || 0;
    this.privilegeDetail.objectid    = this.privilegeForm.get('privobject').value || 0;

    this.privilegeDetail.isactive    = this.privilege.isactive || true;
    this.privilegeDetail.deletedwhen = this.privilege.deletedwhen || '';
    this.privilegeDetail.deletedby   = this.privilege.deletedby || 0;

    if (mode == "save") {
      this.privilegeDetail.id = this.privilege.id;
      this.privilegeDetail.created = this.privilege.created;
      this.privilegeDetail.createdby = this.privilege.createdby;
      this.privilegeDetail.lastmodifieddate = dateTime;
      this.privilegeDetail.lastmodifiedby = this.userID;
    } else if (mode == "add") {
      this.privilegeDetail.id = 0;
      this.privilegeDetail.created = dateTime;
      this.privilegeDetail.createdby = this.userID;
      this.privilegeDetail.lastmodifieddate = dateTime;
      this.privilegeDetail.lastmodifiedby = this.userID;
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

  savePrivilege(): void {
    console.log("savePrivilege");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(this.privilegeDetail);

    this.privilegeDetailService.savePrivilegeDetail(this.userConncode, this.userID, this.privilegeDetail)
      .subscribe((result: any) => {
        console.log(result);
        if ((result.responseCode == 200) || (result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['system/privileges/privileges']);
        }
      });
  }

  addPrivilege(): void {
    console.log("addPrivilege");
    let today = new Date().toISOString();
    this.getValues(today, "add");
    console.log(this.privilegeDetail);

    this.privilegeDetailService.savePrivilegeDetail(this.userConncode, this.userID, this.privilegeDetail)
      .subscribe((result: any) => {
        console.log(result);
        if ((result.responseCode == 200) || (result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['system/privileges/privileges']);
        }
      });
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;

    dialogConfig.data = {
      privilege: "", flag: flag
    };

    dialogConfig.disableClose = false;

    const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);

      } else {
        console.log("FAIL:", result);
      }
    });

  }
  onTypeChange(event: any) {
    console.log(event);
    this.privilegeDetailService.current_typeID = this.privilegeForm.get('privtype').value;
    this.privilegeObject_flag = true;
    this.dataSourcePrivObject.loadPrivilegeDetail(this.userConncode, this.userID, 0, 5, "",  "privobject_clist");
  }

  checkTypeIsSelected() {
    alert("Please check first Type is selected!");
  }

}
