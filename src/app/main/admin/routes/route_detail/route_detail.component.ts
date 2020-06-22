import { Component, OnInit, ViewEncapsulation, NgModule, } from '@angular/core';
import { Router } from '@angular/router';
declare const google: any;

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { AgmCoreModule } from '@agm/core';

import { RouteDetail } from 'app/main/admin/routes/model/route.model';
import { CourseDialogComponent } from "../dialog/dialog.component";

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { RouteDetailService } from 'app/main/admin/routes/services/route_detail.service';

import { locale as routesEnglish } from 'app/main/admin/routes/i18n/en';
import { locale as routesSpanish } from 'app/main/admin/routes/i18n/sp';
import { locale as routesFrench } from 'app/main/admin/routes/i18n/fr';
import { locale as routesPortuguese } from 'app/main/admin/routes/i18n/pt';

@Component({
  selector: 'app-route-detail',
  templateUrl: './route_detail.component.html',
  styleUrls: ['./route_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations

})


export class RouteDetailComponent implements OnInit {
  route_detail: any;
  public route: any;
  pageType: string;
  userConncode: string;
  userID: number;

  routeForm: FormGroup;
  routeDetail: RouteDetail = {};

  displayedColumns: string[] = ['name'];

  filter_string: string = '';
  method_string: string = '';

  constructor(
    public routeDetailService: RouteDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(routesEnglish, routesSpanish, routesFrench, routesPortuguese);

    this.route = localStorage.getItem("route_detail") ? JSON.parse(localStorage.getItem("route_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if (this.route != '') {
      this.pageType = 'edit';
    }
    else {
      
      this.pageType = 'new';
    }

    this.filter_string = '';
  }

  ngOnInit(): void {
    

    this.routeForm = this._formBuilder.group({
      name: [null, Validators.required],
      isactive: [null, Validators.required],
      created: [{ value: '', disabled: true }, Validators.required],
      createdbyname: [{ value: '', disabled: true }, Validators.required],
      lastmodifieddate: [{ value: '', disabled: true }, Validators.required],
      lastmodifiedbyname: [{ value: '', disabled: true }, Validators.required],
    });

    this.setValues();
  }

  setValues() {
    this.routeForm.get('name').setValue(this.route.name);

    let created = this.route.created ? new Date(`${this.route.created}`) : '';
    let lastmodifieddate = this.route.lastmodifieddate ? new Date(`${this.route.lastmodifieddate}`) : '';

    this.routeForm.get('created').setValue(this.dateFormat(created));
    this.routeForm.get('createdbyname').setValue(this.route.createdbyname);
    this.routeForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
    this.routeForm.get('lastmodifiedbyname').setValue(this.route.lastmodifiedbyname);
  }

  getValues(dateTime: any, mode: string) {
    this.routeDetail.name = this.routeForm.get('name').value || '',
      this.routeDetail.isactive = this.route.isactive || true;
    // this.routeDetail.deletedwhen      = this.route.deletedwhen || '';
    // this.routeDetail.deletedby        = this.route.deletedby || 0;

    if (mode == "save") {
      this.routeDetail.id = this.route.id;
      this.routeDetail.created = this.route.created;
      this.routeDetail.createdby = this.route.createdby;
      this.routeDetail.lastmodifieddate = dateTime;
      this.routeDetail.lastmodifiedby = this.userID;
    } else if (mode == "add") {
      this.routeDetail.id = 0;
      this.routeDetail.created = dateTime;
      this.routeDetail.createdby = this.userID;
      this.routeDetail.lastmodifieddate = dateTime;
      this.routeDetail.lastmodifiedby = this.userID;
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

  saveRoute(): void {
    
    let today = new Date().toISOString();
    this.getValues(today, "save");
    

    if (this.routeDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.routeDetailService.saveRouteDetail(this.userConncode, this.userID, this.routeDetail)
      .subscribe((result: any) => {
        
        if ((result.responseCode == 200) || (result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['admin/routes/routes']);
        }
      });
    }
  }

  addRoute(): void {
    
    let today = new Date().toISOString();
    this.getValues(today, "add");
    

    if (this.routeDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.routeDetailService.saveRouteDetail(this.userConncode, this.userID, this.routeDetail)
      .subscribe((result: any) => {
        
        if ((result.responseCode == 200) || (result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['admin/routes/routes']);
        }
      });
    }
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;

    dialogConfig.data = {
      route: "", flag: flag
    };

    dialogConfig.disableClose = false;

    const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        

      } else {
        
      }
    });

  }
}
