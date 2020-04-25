import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';

import { OperatorDetail } from 'app/main/admin/operators/model/operator.model';
import {CourseDialogComponent} from "../dialog/dialog.component";

// import * as $ from 'jquery';
import * as _ from 'lodash';

import { Subject, merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OperatorDetailService } from 'app/main/admin/operators/services/operator_detail.service';
import { OperatorDetailDataSource } from "app/main/admin/operators/services/operator_detail.datasource";
import { AuthService } from 'app/authentication/services/authentication.service';

import { locale as operatorsEnglish } from 'app/main/admin/operators/i18n/en';
import { locale as operatorsSpanish } from 'app/main/admin/operators/i18n/sp';
import { locale as operatorsFrench } from 'app/main/admin/operators/i18n/fr';
import { locale as operatorsPortuguese } from 'app/main/admin/operators/i18n/pt';

@Component({
  selector: 'app-operator-detail',
  templateUrl: './operator_detail.component.html',
  styleUrls: ['./operator_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class OperatorDetailComponent implements OnInit
{
  operator_detail: any;
  public operator: any;
  pageType: string;
  userConncode: string;
  userID: number;

  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: any;

  operatorForm: FormGroup;
  operatorDetail: OperatorDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: OperatorDetailDataSource;

  dataSourceCompany:      OperatorDetailDataSource;
  dataSourceGroup:        OperatorDetailDataSource;
  dataSourceOperatorType: OperatorDetailDataSource;

  filter_string: string = '';
  method_string: string = '';
  
  @ViewChild(MatPaginator, {static: true})
    paginatorCompany: MatPaginator;
  @ViewChild('paginatorGroup', {read: MatPaginator, static: true})
    paginatorGroup: MatPaginator;
  @ViewChild('paginatorOperatorType', {read: MatPaginator, static: true})
    paginatorOperatorType: MatPaginator;

  constructor(
    public operatorDetailService: OperatorDetailService,
    private authService: AuthService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(operatorsEnglish, operatorsSpanish, operatorsFrench, operatorsPortuguese);

    this.operator = localStorage.getItem("operator_detail")? JSON.parse(localStorage.getItem("operator_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.operator != '' )
    {
      this.pageType = 'edit';
    }
    else
    {
      console.log(this.operator);
      this.pageType = 'new';
    }

    this.filter_string = '';
  }

  ngOnInit(): void {
    console.log(this.operator);
  
    this.dataSourceCompany        = new OperatorDetailDataSource(this.operatorDetailService);
    this.dataSourceGroup          = new OperatorDetailDataSource(this.operatorDetailService);
    this.dataSourceOperatorType   = new OperatorDetailDataSource(this.operatorDetailService);

    this.dataSourceCompany      .loadOperatorDetail(this.userConncode, this.userID, 0, 10, this.operator.company, "company_clist");
    this.dataSourceGroup        .loadOperatorDetail(this.userConncode, this.userID, 0, 10, this.operator.group, "group_clist");
    this.dataSourceOperatorType .loadOperatorDetail(this.userConncode, this.userID, 0, 10, '', "operatortype_clist");

    this.operatorForm = this._formBuilder.group({
      name                       : [null, Validators.required],
      email                      : [null, Validators.required],
      password                   : [null, Validators.required],
      phonenumber                : [null, Validators.required],
      operatortype               : [null, Validators.required],
      isactive                   : [null, Validators.required],
      company                    : [null, Validators.required],
      group                      : [null, Validators.required],
      subgroup                   : [null, Validators.required],
      created                    : [{value: '', disabled: true}, Validators.required],
      createdbyname              : [{value: '', disabled: true}, Validators.required],
      deletedwhen                : [{value: '', disabled: true}, Validators.required],
      deletedbyname              : [{value: '', disabled: true}, Validators.required],
      lastmodifieddate           : [{value: '', disabled: true}, Validators.required],
      lastmodifiedbyname         : [{value: '', disabled: true}, Validators.required],
      birthdate                  : [null, Validators.required],
      hiredate                   : [null, Validators.required],
      physicaltestexpirydate     : [null, Validators.required],
      licenseexpirationdate      : [null, Validators.required],
      driverlicensenumber        : [null, Validators.required],
      filterstring               : [null, Validators.required],
  });

  this.setValues();
}

  ngAfterViewInit() {
    console.log("ngAfterViewInit:");
    
    merge(this.paginatorCompany.page)
    .pipe(
      tap(() => {
        this.loadOperatorDetail("company")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorGroup.page)
    .pipe(
      tap(() => {
        this.loadOperatorDetail("group")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });

    merge(this.paginatorOperatorType.page)
    .pipe(
      tap(() => {
        this.loadOperatorDetail("operatortype")
      })
    )
    .subscribe( (res: any) => {
        console.log(res);
    });
  }

  loadOperatorDetail(method_string: string) {
    if (method_string == 'company') {
      this.dataSourceCompany.loadOperatorDetail(this.userConncode, this.userID, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'group') {
        this.dataSourceGroup.loadOperatorDetail(this.userConncode, this.userID, this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'operatortype') {
       this.dataSourceOperatorType.loadOperatorDetail(this.userConncode, this.userID, this.paginatorGroup.pageIndex, this.paginatorGroup.pageSize, '', `${method_string}_clist`)
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

      case 'operatortype':
        this.paginatorOperatorType.pageIndex = 0;
      break;
    }
  }

  showCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
   
    let selected_element_id = this.operatorForm.get(`${this.method_string}`).value;

    console.log(methodString, this.operatorDetailService.unit_clist_item[methodString], selected_element_id );

    let clist = this.operatorDetailService.unit_clist_item[methodString];

    for (let i = 0; i< clist.length; i++) {
      if ( clist[i].id == selected_element_id ) {
        this.operatorForm.get('filterstring').setValue(clist[i].name);
        this.filter_string = clist[i].name;
      }
    }
     
    this.managePageIndex(this.method_string);
    this.loadOperatorDetail(this.method_string);
  }

  clearFilter() {
    console.log(this.filter_string);
    this.filter_string = '';
    this.operatorForm.get('filterstring').setValue(this.filter_string);

    this.managePageIndex(this.method_string);
    this.loadOperatorDetail(this.method_string);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
     
      this.managePageIndex(this.method_string);
      this.loadOperatorDetail(this.method_string);
    }

    console.log(this.filter_string);
  }

  setValues() {
      this.operatorForm.get('name').setValue(this.operator.name);
      this.operatorForm.get('email').setValue(this.operator.email);
      this.operatorForm.get('password').setValue(this.operator.password);
      this.operatorForm.get('phonenumber').setValue(this.operator.phonenumber);

      this.operatorForm.get('operatortype').setValue(this.operator.operatortypeid);
      this.operatorForm.get('company').setValue(this.operator.companyid);
      this.operatorForm.get('group').setValue(this.operator.groupid);

      let created                = this.operator.created? new Date(`${this.operator.created}`) : '';
      let deletedwhen            = this.operator.deletedwhen? new Date(`${this.operator.deletedwhen}`) : '';
      let lastmodifieddate       = this.operator.lastmodifieddate? new Date(`${this.operator.lastmodifieddate}`) : '';
      let birthdate              = this.operator? new Date(`${this.operator.birthdate}`) : new Date();
      let hiredate               = this.operator? new Date(`${this.operator.hiredate}`) : new Date();
      let physicaltestexpirydate = this.operator? new Date(`${this.operator.physicaltestexpirydate}`) : new Date();
      let licenseexpirationdate  = this.operator? new Date(`${this.operator.licenseexpirationdate}`) : new Date();

      console.log(birthdate);

      this.operatorForm.get('created').setValue(this.dateFormat(created));
      this.operatorForm.get('createdbyname').setValue(this.operator.createdbyname);
      this.operatorForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.operatorForm.get('deletedbyname').setValue(this.operator.deletedbyname);
      this.operatorForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.operatorForm.get('lastmodifiedbyname').setValue(this.operator.lastmodifiedbyname);
      this.operatorForm.get('birthdate').setValue(this.setDatePicker(birthdate), {onlyself:true});
      this.operatorForm.get('hiredate').setValue(this.setDatePicker(hiredate), {onlyself:true});
      this.operatorForm.get('physicaltestexpirydate').setValue(this.setDatePicker(physicaltestexpirydate), {onlyself:true});
      this.operatorForm.get('licenseexpirationdate').setValue(this.setDatePicker(licenseexpirationdate), {onlyself:true});
      this.operatorForm.get('driverlicensenumber').setValue(this.operator.driverlicensenumber);

      this.cardImageBase64 = this.operator.filephoto || "0";

      if (this.cardImageBase64 == "0") {
        this.isImageSaved = false;
      } else {
        this.isImageSaved = true;
      }

      this.operatorForm.get('filterstring').setValue(this.filter_string);
  }

  getValues(dateTime: any, mode: string) {
    this.operatorDetail.name             = this.operatorForm.get('name').value || '',
    this.operatorDetail.email            = this.operatorForm.get('email').value || '';
    this.operatorDetail.password         = this.operatorForm.get('password').value || '';
    this.operatorDetail.phonenumber      = this.operatorForm.get('phonenumber').value || '';
    this.operatorDetail.operatortypeid   = this.operatorForm.get('operatortype').value || 0;
    this.operatorDetail.companyid        = this.operatorForm.get('company').value || 0;
    this.operatorDetail.groupid          = this.operatorForm.get('group').value || 0;
 
    this.operatorDetail.subgroup               = this.operator.subgroup || 0;
    this.operatorDetail.isactive               = this.operator.isactive || true;
    this.operatorDetail.deletedwhen            = this.operator.deletedwhen || '';
    this.operatorDetail.deletedby              = this.operator.deletedby || 0;
    this.operatorDetail.sin                    = this.operator.sin || '';
    this.operatorDetail.filephoto              = this.cardImageBase64 || '0';

    this.operatorDetail.birthdate              = new Date(this.operatorForm.get('birthdate').value).toISOString() || '';
    this.operatorDetail.hiredate               = new Date(this.operatorForm.get('hiredate').value).toISOString() || '';
    this.operatorDetail.physicaltestexpirydate = new Date(this.operatorForm.get('physicaltestexpirydate').value).toISOString() || '';
    this.operatorDetail.licenseexpirationdate  = new Date(this.operatorForm.get('licenseexpirationdate').value).toISOString() || '';
    this.operatorDetail.driverlicensenumber    = this.operatorForm.get('driverlicensenumber').value || '';
    console.log(this.operatorDetail.birthdate);

    if( mode  == "save" ) {
      this.operatorDetail.id               = this.operator.id;
      this.operatorDetail.created          = this.operator.created;
      this.operatorDetail.createdby        = this.operator.createdby;
      this.operatorDetail.lastmodifieddate = dateTime;
      this.operatorDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.operatorDetail.id               = 0;
      this.operatorDetail.created          = dateTime;
      this.operatorDetail.createdby        = this.userID;
      this.operatorDetail.lastmodifieddate = dateTime;
      this.operatorDetail.lastmodifiedby   = this.userID;
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

  setDatePicker(date) {
    let str = new Date(date).toISOString().substring(0, 10);
    console.log(str);
    return str;

  }

  saveOperator(): void {
    console.log("saveOperator");
    let today = new Date().toISOString();
    this.getValues(today, "save");
    console.log(new Date(this.operatorDetail.birthdate));

    if (this.operatorDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.operatorDetailService.saveOperatorDetail(this.userConncode, this.userID, this.operatorDetail)
      .subscribe((result: any) => {
        console.log(result);
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['admin/operators/operators']);
        }
      });
    }
  }

  addOperator(): void {
    console.log("addOperator");
    let today = new Date().toISOString();
    this.getValues(today, "add");
    console.log(this.operatorDetail);

    if (this.operatorDetail.name == '') {
      alert('Please enter Detail Name')
    } else {
      this.operatorDetailService.saveOperatorDetail(this.userConncode, this.userID, this.operatorDetail)
      .subscribe((result: any) => {
        console.log(result);
        if ((result.responseCode == 200)||(result.responseCode == 100)) {
          alert("Success!");
          this.router.navigate(['admin/operators/operators']);
        }
      });
    }
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       operator: "", flag: flag
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

  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
        // Size Filter Bytes
        const max_size = 20971520;
        const allowed_types = ['image/png', 'image/jpeg'];
        const max_height = 15200;
        const max_width = 25600;

        if (fileInput.target.files[0].size > max_size) {
            this.imageError =
                'Maximum size allowed is ' + max_size / 1000 + 'Mb';

            return false;
        }

        if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
            this.imageError = 'Only Images are allowed ( JPG | PNG )';
            return false;
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = rs => {
                const img_height = rs.currentTarget['height'];
                const img_width = rs.currentTarget['width'];

                if (img_height > max_height && img_width > max_width) {
                    this.imageError =
                        'Maximum dimentions allowed ' +
                        max_height +
                        '*' +
                        max_width +
                        'px';
                    return false;
                } else {
                    const imgBase64Path = e.target.result;
                    this.cardImageBase64 = imgBase64Path;
                    console.log(this.cardImageBase64);
                    this.isImageSaved = true;
                    // this.previewImagePath = imgBase64Path;
                }
            };
        };

        reader.readAsDataURL(fileInput.target.files[0]);
    }
}
}
