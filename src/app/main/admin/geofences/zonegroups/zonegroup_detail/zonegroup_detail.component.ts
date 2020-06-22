import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog,  MatDialogConfig } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list'
import { ZonegroupDetail } from 'app/main/admin/geofences/zonegroups/model/zonegroup.model';
import { CourseDialogComponent } from "../dialog/dialog.component";

import { merge, Subject } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { ZonegroupDetailService } from 'app/main/admin/geofences/zonegroups/services/zonegroup_detail.service';
import { ZonegroupDetailDataSource } from "app/main/admin/geofences/zonegroups/services/zonegroup_detail.datasource";

import { locale as zonegroupsEnglish } from 'app/main/admin/geofences/zonegroups/i18n/en';
import { locale as zonegroupsSpanish } from 'app/main/admin/geofences/zonegroups/i18n/sp';
import { locale as zonegroupsFrench } from 'app/main/admin/geofences/zonegroups/i18n/fr';
import { locale as zonegroupsPortuguese } from 'app/main/admin/geofences/zonegroups/i18n/pt';

@Component({
  selector: 'app-zonegroup-detail',
  templateUrl: './zonegroup_detail.component.html',
  styleUrls: ['./zonegroup_detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class ZonegroupDetailComponent implements OnInit
{
  public zonegroup: any;
  pageType: string;
  userConncode: string;
  userID: number;

  zonegroupModel_flag: boolean;

  zonegroupForm: FormGroup;
  zonegroupDetail: ZonegroupDetail = {};

  displayedColumns: string[] = ['name'];
  ZONEsColumns: string[] = ['id','name'];

  dataSource: ZonegroupDetailDataSource;

  dataSourceCompany:     ZonegroupDetailDataSource;
  dataSourceIncluded:    ZonegroupDetailDataSource;
  dataSourceExcluded:    ZonegroupDetailDataSource;
 
  filter_string: string = '';
  method_string: string = '';

  currentTab: number;

  dialogRef: any;
  filterBy: boolean;                                                                                                                                                                                               
  includedSelection = new SelectionModel<Element>(true, []);
  excludedSelection = new SelectionModel<Element>(true, []);

  @ViewChild(MatPaginator, {static: true})
    paginatorCompany: MatPaginator;
  @ViewChild('paginatorIncluded', {read: MatPaginator, static: true})
    paginatorIncluded: MatPaginator;
  @ViewChild('paginatorExcluded', {read: MatPaginator, static: true})
    paginatorExcluded: MatPaginator;
  
  constructor(
    public zonegroupDetailService: ZonegroupDetailService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _fuseSidebarService: FuseSidebarService,
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private router: Router,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(zonegroupsEnglish, zonegroupsSpanish, zonegroupsFrench, zonegroupsPortuguese);

    this.zonegroup = localStorage.getItem("zonegroup_detail")? JSON.parse(localStorage.getItem("zonegroup_detail")) : '';
    
    
    this.userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
    this.userID       = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

    if ( this.zonegroup != '' )
    {

      this.zonegroupDetailService.current_zoneGroupID = this.zonegroup.id;
      this.pageType = 'edit';
    }
    else
    {
      this.zonegroupDetailService.current_zoneGroupID = 0;
      this.pageType = 'new';
    }

    this.filter_string = '';
    this.filterBy = true;
  }

  ngOnInit(): void {
  
    this.dataSourceCompany = new ZonegroupDetailDataSource(this.zonegroupDetailService);
    this.dataSourceIncluded = new ZonegroupDetailDataSource(this.zonegroupDetailService);
    this.dataSourceExcluded = new ZonegroupDetailDataSource(this.zonegroupDetailService);
    
    if (this.pageType == 'new') {
      this.dataSourceCompany.loadZonegroupDetail(this.userConncode, this.userID, 0, 10, '', "company_clist");
    } else if (this.pageType == 'edit') {
      this.dataSourceIncluded.loadZonegroupDetail(this.userConncode, this.userID, 0, 10, '', "GetGroupIncludedZONEs");
      this.dataSourceExcluded.loadZonegroupDetail(this.userConncode, this.userID, 0, 10, '', "GetGroupExcludedZONEs");
    }
  
    this.zonegroupForm = this._formBuilder.group({
      name               : [null, Validators.required],
      company            : [null, Validators.required],
      companyInput       : [{value: '', disabled: true}],
      excludedZONEs      : [null, Validators.required],
      includedZONEs      : [null, Validators.required],
     
      isactive           : [null, Validators.required],
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
    
    if (this,this.pageType == 'new') {
      merge(this.paginatorCompany.page)
      .pipe(
        tap(() => {
          this.loadZonegroupDetail("company")
        })
      )
      .subscribe( (res: any) => {
          
      });
    }

    merge(this.paginatorIncluded.page)
    .pipe(
      tap(() => {
        this.loadZonegroupDetail("included")
      })
    )
    .subscribe( (res: any) => {
        
    });

    merge(this.paginatorExcluded.page)
    .pipe(
      tap(() => {
        this.loadZonegroupDetail("excluded");
      })
    )
    .subscribe( (res: any) => {
      
    })

  }

  loadZonegroupDetail(method_string: string) {
    if (method_string == 'company') {
      this.dataSourceCompany.loadZonegroupDetail(this.userConncode, this.userID, this.paginatorCompany.pageIndex, this.paginatorCompany.pageSize, this.filter_string, `${method_string}_clist`)
    } else if (method_string == 'included') {
      this.dataSourceIncluded.loadZonegroupDetail(this.userConncode, this.userID, this.paginatorIncluded.pageIndex, this.paginatorIncluded.pageSize, this.filter_string, "GetGroupIncludedZONEs")
      
    } else if (method_string == 'excluded') {
      this.dataSourceExcluded.loadZonegroupDetail(this.userConncode, this.userID, this.paginatorExcluded.pageIndex, this.paginatorExcluded.pageSize, this.filter_string, "GetGroupExcludedZONEs");
      
    }
  }

  managePageIndex(method_string: string) {
    switch(method_string) {
      case 'company':
        this.paginatorCompany.pageIndex = 0;
      break;

      case 'included':
        this.paginatorIncluded.pageIndex = 0;
      break;

      case 'excluded':
        this.paginatorExcluded.pageIndex = 0;
      break;
    }
  }

  showCompanyList(item: string) {
    let methodString = item;
    this.method_string = item.split('_')[0];
    let selected_element_id = this.zonegroupForm.get(`${this.method_string}`).value;

    

    let clist = this.zonegroupDetailService.unit_clist_item[methodString];

    for (let i = 0; i< clist.length; i++) {
      if ( clist[i].id == selected_element_id ) {
        this.zonegroupForm.get('filterstring').setValue(clist[i].name);
        this.filter_string = clist[i].name;
      }
    }
    
    this.managePageIndex(this.method_string);
    this.loadZonegroupDetail(this.method_string);
  }

  clearFilter() {
    
    this.filter_string = '';
    this.zonegroupForm.get('filterstring').setValue(this.filter_string);
   
    this.managePageIndex(this.method_string);
    this.loadZonegroupDetail(this.method_string);
  }

  onKey(event: any) {
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
     
      this.managePageIndex(this.method_string);
      this.loadZonegroupDetail(this.method_string);
    }

    
  }

  onIncludedFilter(event: any) {
    this.method_string = 'included';
    this.filter_string = event.target.value;

    

    if(this.filter_string.length >= 3 || this.filter_string == '') {
     
      this.managePageIndex(this.method_string);
      this.loadZonegroupDetail(this.method_string);
    }

    
  }

  onExcludedFilter(event: any) {
    this.method_string = 'excluded';
    this.filter_string = event.target.value;

    if(this.filter_string.length >= 3 || this.filter_string == '') {
     
      this.managePageIndex(this.method_string);
      this.loadZonegroupDetail(this.method_string);
    }

    
  }

  setValues() {
      this.zonegroupForm.get('name').setValue(this.zonegroup.name);
      this.zonegroupForm.get('company').setValue(this.zonegroup.companyid);
      this.zonegroupForm.get('companyInput').setValue(this.zonegroup.company);
      this.zonegroupForm.get('excludedZONEs').setValue('');
      this.zonegroupForm.get('includedZONEs').setValue('');

      let created          = this.zonegroup.created? new Date(`${this.zonegroup.created}`) : '';
      let deletedwhen      = this.zonegroup.deletedwhen? new Date(`${this.zonegroup.deletedwhen}`) : '';
      let lastmodifieddate = this.zonegroup.lastmodifieddate? new Date(`${this.zonegroup.lastmodifieddate}`) : '';

      this.zonegroupForm.get('created').setValue(this.dateFormat(created));
      this.zonegroupForm.get('createdbyname').setValue(this.zonegroup.createdbyname);
      this.zonegroupForm.get('deletedwhen').setValue(this.dateFormat(deletedwhen));
      this.zonegroupForm.get('deletedbyname').setValue(this.zonegroup.deletedbyname);
      this.zonegroupForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
      this.zonegroupForm.get('lastmodifiedbyname').setValue(this.zonegroup.lastmodifiedbyname);
      this.zonegroupForm.get('filterstring').setValue(this.filter_string);
  }

  getValues(dateTime: any, mode: string) {
    this.zonegroupDetail.name        = this.zonegroupForm.get('name').value || '',
    this.zonegroupDetail.companyid   = this.zonegroupForm.get('company').value || 0;
   
    this.zonegroupDetail.isactive         = this.zonegroup.isactive || true;
    this.zonegroupDetail.deletedwhen      = this.zonegroup.deletedwhen || '';
    this.zonegroupDetail.deletedby        = this.zonegroup.deletedby || 0;

    if( mode  == "save" ) {
      this.zonegroupDetail.id               = this.zonegroup.id;
      this.zonegroupDetail.created          = this.zonegroup.created;
      this.zonegroupDetail.createdby        = this.zonegroup.createdby;
      this.zonegroupDetail.lastmodifieddate = dateTime;
      this.zonegroupDetail.lastmodifiedby   = this.userID;
    } else if ( mode == "add" ) {
      this.zonegroupDetail.id               = 0;
      this.zonegroupDetail.created          = dateTime;
      this.zonegroupDetail.createdby        = this.userID;
      this.zonegroupDetail.lastmodifieddate = dateTime;
      this.zonegroupDetail.lastmodifiedby   = this.userID;
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

  saveZonegroup(): void {
    
    let today = new Date().toISOString();
    this.getValues(today, "save");
    

    this.zonegroupDetailService.saveZonegroupDetail(this.userConncode, this.userID, this.zonegroupDetail)
    .subscribe((result: any) => {
      
      if ((result.responseCode == 200)||(result.responseCode == 100)) {
        alert("Success!");
        this.router.navigate(['admin/geofences/zonegroups/zonegroups']);
      }
    });
  }

  addZonegroup(): void {
    let today = new Date().toISOString();
    this.getValues(today, "add");

    this.zonegroupDetailService.saveZonegroupDetail(this.userConncode, this.userID, this.zonegroupDetail)
    .subscribe((result: any) => {
      if ((result.responseCode == 200)||(result.responseCode == 100)) {
        alert("Success!");
        this.router.navigate(['admin/geofences/zonegroups/zonegroups']);
      }
    });
  }

  addZONEs() {
    if (this.pageType == 'new' && !this.zonegroup.id) {
      let today = new Date().toISOString();
      this.getValues(today, "add");

      this.zonegroupDetailService.saveZonegroupDetail(this.userConncode, this.userID, this.zonegroupDetail)
      .subscribe((result: any) => {
        
        if (result.responseCode == 100) {
          

          let addData = [];
          for (let i = 0; i < this.excludedSelection.selected.length; i ++ ){
            addData[i] = {
              zonegroupid: Number(result.TrackingXLAPI.DATA[0].id),
              zoneid: Number(this.excludedSelection.selected[i])
            }
          }
          
          
          this.zonegroupDetailService.addZoneToGroup(this.userConncode, this.userID, addData)
          .subscribe((res: any) => {
            if (res.TrackingXLAPI.DATA) {
              
              alert("ZONEGroup added successfully!")
              this.router.navigate(['admin/geofences/zonegroups/zonegroups']);
            }
          });
        }
      });
    } else {
      
      let addData = [];
      for (let i = 0; i < this.excludedSelection.selected.length; i ++ ){
        addData[i] = {
          zonegroupid: Number(this.zonegroup.id),
          zoneid: Number(this.excludedSelection.selected[i])
        }
      }
      
      
      this.zonegroupDetailService.addZoneToGroup(this.userConncode, this.userID, addData)
      .subscribe((res: any) => {
        if (res.TrackingXLAPI.DATA) {
          
          alert("ZONEs added successfully!");
          this.dataSourceIncluded.loadZonegroupDetail(this.userConncode, this.userID, 0, 10, '', "GetGroupIncludedZONEs");
          this.dataSourceExcluded.loadZonegroupDetail(this.userConncode, this.userID, 0, 10, '', "GetGroupExcludedZONEs");
        }
      });
    }
  }

  deleteZONEs() {
    
    let deleteData = [];
    for (let i = 0; i < this.includedSelection.selected.length; i ++ ){
      deleteData[i] = {
        zonegroupid: Number(this.zonegroup.id),
        zoneid: Number(this.includedSelection.selected[i])
      }
    }
    
    
    this.zonegroupDetailService.deleteZoneToGroup(this.userConncode, this.userID, deleteData)
    .subscribe((res: any) => {
      if (res.TrackingXLAPI.DATA) {
        
        alert("ZONEs deleted successfully!");
        this.dataSourceIncluded.loadZonegroupDetail(this.userConncode, this.userID, 0, 10, '', "GetGroupIncludedZONEs");
        this.dataSourceExcluded.loadZonegroupDetail(this.userConncode, this.userID, 0, 10, '', "GetGroupExcludedZONEs");
      }
    });
  }

  getNewGroupZONEs(index: number) {
    if (index == 1) {
      this.filter_string = '';
      this.zonegroupForm.get('filterstring').setValue(this.filter_string);
    }

    if (index == 1 && this.pageType == 'new') {
      this.filterBy = false;
      this.zonegroupDetailService.current_CompanyID = this.zonegroupForm.get('company').value || 0;
      
      if (this.zonegroupDetailService.current_CompanyID == 0) {
        alert("Please choose company one first!");
        this.reloadComponent();

      } else {
        

        this.dataSourceIncluded.loadZonegroupDetail(this.userConncode, this.userID, 0, 10, '', "GetGroupIncludedZONEs");
        this.dataSourceExcluded.loadZonegroupDetail(this.userConncode, this.userID, 0, 10, '', "GetGroupExcludedZONEs");
      }
    }
  }

  goBackUnit() {
    const dialogConfig = new MatDialogConfig();
    let flag = 'goback';

    dialogConfig.disableClose = true;
    
    dialogConfig.data = {
       zonegroup: "", flag: flag
    };

    dialogConfig.disableClose = false;

    const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
        
    });

  }
 
  changeFilter(filter) {
    this.filterBy = filter == 'included'? true : false;
  }

  toggleSidebar(): void
  {
    this._fuseSidebarService.getSidebar('my-left-sidebar').toggleOpen();
  }

  reloadComponent() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['admin/geofences/zonegroups/zonegroup_detail']);
}
}
