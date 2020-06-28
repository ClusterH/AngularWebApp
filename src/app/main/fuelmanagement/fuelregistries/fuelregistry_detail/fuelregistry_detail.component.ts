import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as fuelregistriesEnglish } from 'app/main/fuelmanagement/fuelregistries/i18n/en';
import { locale as fuelregistriesFrench } from 'app/main/fuelmanagement/fuelregistries/i18n/fr';
import { locale as fuelregistriesPortuguese } from 'app/main/fuelmanagement/fuelregistries/i18n/pt';
import { locale as fuelregistriesSpanish } from 'app/main/fuelmanagement/fuelregistries/i18n/sp';
import { FuelregistryDetail } from 'app/main/fuelmanagement/fuelregistries/model/fuelregistry.model';
import { FuelregistryDetailDataSource } from "app/main/fuelmanagement/fuelregistries/services/fuelregistry_detail.datasource";
import { FuelregistryDetailService } from 'app/main/fuelmanagement/fuelregistries/services/fuelregistry_detail.service';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CourseDialogComponent } from "../dialog/dialog.component";

@Component({
  selector: 'app-fuelregistry-detail',
  templateUrl: './fuelregistry_detail.component.html',
  styleUrls: ['./fuelregistry_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class FuelregistryDetailComponent implements OnInit
{
  fuelregistry_detail: any;
  public fuelregistry: any;
  pageType: string;
  userConncode: string;
  userID: number;

  fuelregistryModel_flag: boolean;

  fuelregistryForm: FormGroup;
  fuelregistryDetail: FuelregistryDetail = {};

  displayedColumns: string[] = ['name'];

  dataSource: FuelregistryDetailDataSource;

  dataSourceToUnit:   FuelregistryDetailDataSource;
  dataSourceFromTank: FuelregistryDetailDataSource;
  dataSourceOperator: FuelregistryDetailDataSource;
 
  filter_string: string = '';
  method_string: string = '';
  
  @ViewChild(MatPaginator, {static: true})
    paginatorToUnit: MatPaginator;
  @ViewChild('paginatorFromTank', {read: MatPaginator, static: true})
    paginatorFromTank: MatPaginator;
  @ViewChild('paginatorOperator', {read: MatPaginator, static: true})
    paginatorOperator: MatPaginator;
 
  constructor(
    public _fuelregistryDetailService: FuelregistryDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,

    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(fuelregistriesEnglish, fuelregistriesSpanish, fuelregistriesFrench, fuelregistriesPortuguese);

    this.fuelregistry = localStorage.getItem("fuelregistry_detail")? JSON.parse(localStorage.getItem("fuelregistry_detail")) : '';

    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.fuelregistry != '' )
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
  
    this.dataSourceToUnit   = new FuelregistryDetailDataSource(this._fuelregistryDetailService);
    this.dataSourceFromTank = new FuelregistryDetailDataSource(this._fuelregistryDetailService);
    this.dataSourceOperator = new FuelregistryDetailDataSource(this._fuelregistryDetailService);
   
    this.dataSourceToUnit.loadFuelregistryDetail(this.userConncode, this.userID, 0, 10, this.fuelregistry.tounit, "unit_clist");
    this.dataSourceFromTank.loadFuelregistryDetail(this.userConncode, this.userID, 0, 10, this.fuelregistry.fromtank, "fueltank_clist");
    this.dataSourceOperator.loadFuelregistryDetail(this.userConncode, this.userID, 0, 10, this.fuelregistry.operator, "operator_clist");

    this.fuelregistryForm = this._formBuilder.group({
      tounit      : [null, Validators.required],
      fromtank    : [null, Validators.required],
      amount      : [null, Validators.required],
      fuelunit    : [null, Validators.required],
      datentime   : [null, Validators.required],
      odometer    : [null, Validators.required],
      cost        : [null, Validators.required],
      operator    : [null, Validators.required],
      filterstring: [null, Validators.required],
  });

  this.setValues();
}

  ngAfterViewInit() {
    
    
    merge(this.paginatorToUnit.page)
    .pipe(
      tap(() => {
        this.loadFuelregistryDetail("tounit")
      })
    )
    .subscribe( () => {
        
    });

    merge(this.paginatorFromTank.page)
    .pipe(
      tap(() => {
        this.loadFuelregistryDetail("fromtank")
      })
    )
    .subscribe( () => {
        
    });

    merge(this.paginatorOperator.page)
    .pipe(
      tap(() => {
        this.loadFuelregistryDetail("operator")
      })
    )
    .subscribe( () => {
        
    });
  }

  loadFuelregistryDetail(method_string: string) {
    if (method_string == 'tounit') {
      this.dataSourceToUnit.loadFuelregistryDetail(this.userConncode, this.userID, this.paginatorToUnit.pageIndex, this.paginatorToUnit.pageSize, this.filter_string, 'unit_clist')
    } else if (method_string == 'fromtank') {
        this.dataSourceFromTank.loadFuelregistryDetail(this.userConncode, this.userID, this.paginatorFromTank.pageIndex, this.paginatorFromTank.pageSize, this.filter_string, 'fueltank_clist')
    } else if (method_string == 'operator') {
        this.dataSourceOperator.loadFuelregistryDetail(this.userConncode, this.userID, this.paginatorOperator.pageIndex, this.paginatorOperator.pageSize, this.filter_string, 'operator_clist')
    }
  }

  managePageIndex(method_string: string) {
    switch(method_string) {
      case 'tounit':
        this.paginatorToUnit.pageIndex = 0;
      break;
     
      case 'fromtank':
        this.paginatorFromTank.pageIndex = 0;
      break;

      case 'operator':
        this.paginatorOperator.pageIndex = 0;
      break;
    }
  }

  showCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
   
    let selected_element_id = this.fuelregistryForm.get(`${this.method_string}`).value;

    let clist = this._fuelregistryDetailService.unit_clist_item[methodString];

    for (let i = 0; i< clist.length; i++) {
      if ( clist[i].id == selected_element_id ) {
        this.fuelregistryForm.get('filterstring').setValue(clist[i].name);
        this.filter_string = clist[i].name;
      }
     
      this.managePageIndex(this.method_string);
      this.loadFuelregistryDetail(this.method_string);
    }
  }

  clearFilter() {
    
    this.filter_string = '';
    this.fuelregistryForm.get('filterstring').setValue(this.filter_string);
   
    this.managePageIndex(this.method_string);
    this.loadFuelregistryDetail(this.method_string);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
     
      this.managePageIndex(this.method_string);
      this.loadFuelregistryDetail(this.method_string);
    }
  }

  setValues() {
    this.fuelregistryForm.get('tounit').setValue(this.fuelregistry.tounitid);
    this.fuelregistryForm.get('fromtank').setValue(this.fuelregistry.fromtankid);
    this.fuelregistryForm.get('amount').setValue(this.fuelregistry.amount || 0);
    this.fuelregistryForm.get('fuelunit').setValue(this.fuelregistry.fuelunit || 'liters');
    this.fuelregistryForm.get('datentime').setValue(this.fuelregistry.datentime || new Date().toISOString().slice(0, 16));
    this.fuelregistryForm.get('odometer').setValue(this.fuelregistry.odometer);
    this.fuelregistryForm.get('cost').setValue(this.fuelregistry.cost || 0);
    this.fuelregistryForm.get('operator').setValue(this.fuelregistry.operatorid);
    this.fuelregistryForm.get('filterstring').setValue(this.filter_string);
  }

  getValues(dateTime: any, mode: string) {
    this.fuelregistryDetail.tounitid   = this.fuelregistryForm.get('tounit').value || '0',
    this.fuelregistryDetail.fromtankid = this.fuelregistryForm.get('fromtank').value || '0';
    this.fuelregistryDetail.amount     = this.fuelregistryForm.get('password').value || '0';
    this.fuelregistryDetail.datentime  = this.fuelregistryForm.get('datentime').value || '0';
    this.fuelregistryDetail.odometer   = this.fuelregistryForm.get('odometer').value || '0';
    this.fuelregistryDetail.cost       = this.fuelregistryForm.get('cost').value || '0';
    this.fuelregistryDetail.operatorid = this.fuelregistryForm.get('operator').value || '0';

    if( mode  == "save" ) {
      // this.fuelregistryDetail.id               = this.fuelregistry.id;
      // this.fuelregistryDetail.created          = this.fuelregistry.created;
      // this.fuelregistryDetail.createdby        = this.fuelregistry.createdby;
      // this.fuelregistryDetail.lastmodifieddate = dateTime;
      // this.fuelregistryDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      // this.fuelregistryDetail.id               = 0;
      // this.fuelregistryDetail.created          = dateTime;
      // this.fuelregistryDetail.createdby        = this.userID;
      // this.fuelregistryDetail.lastmodifieddate = dateTime;
      // this.fuelregistryDetail.lastmodifiedby   = this.userID;
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

  savefuelregistry(): void {
    
    let today = new Date().toISOString();
    this.getValues(today, "save");
    

    if (this.fuelregistryDetail.tounitid == '0' || this.fuelregistryDetail.fromtankid == '0') {
      alert('Please Choose Unit and Tank')
    } else {
      this._fuelregistryDetailService.saveFuelregistryDetail(this.userConncode, this.userID, this.fuelregistryDetail)
      .subscribe((result: any) => {
        
        if (result.responseCode == 100) {
          alert("Success!");
          this.router.navigate(['fuelmanagement/fuelregistries/fuelregistries']);
        }
      });
    }
  }

  addfuelregistry(): void {
    
    let today = new Date().toISOString();
    this.getValues(today, "add");

    if (this.fuelregistryDetail.tounitid == '0' || this.fuelregistryDetail.fromtankid == '0') {
      alert('Please Choose Unit and Tank')
    } else {
      this._fuelregistryDetailService.saveFuelregistryDetail(this.userConncode, this.userID, this.fuelregistryDetail)
      .subscribe((result: any) => {
        
        if (result.responseCode == 100) {
          alert("Success!");
          this.router.navigate(['fuelmanagement/fuelregistries/fuelregistries']);
        }
      });
    }
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       fuelregistry: "", flag: flag
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
