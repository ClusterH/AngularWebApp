import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { DatatableComponent } from '@swimlane/ngx-datatable';
import {fromEvent, Observable} from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';

import { fuseAnimations } from '@fuse/animations';

import {DataService} from './services/data.service';

import {Vehicles} from './models/Vehicles';

interface ITEM {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss'],
  animations   : fuseAnimations,

})

export class VehiclesComponent implements OnInit, AfterViewInit {
  @ViewChild('search', { static: false }) search: any;
  @ViewChild(DatatableComponent) public table: DatatableComponent;

  name = 'Ngx Datatables Filter All Columns';
  public temp: Array<object> = [];
  public columns: Array<object>;
  public VEHICLE: Array<object>;

  loadingIndicator: boolean;
  reorderable: boolean;
  TableData: any;

  selected = 'unit';

  public readonly pageLimitOptions = [
    {value: 5},
    {value: 10},
    {value: 15},
    {value: 20},
    {value: 50},
  ];
  public currentPageLimit: number = 10;

  dialogRef: any;
  // items: ITEM[] = [
  //   {value: 'unit', viewValue: 'Unit'},
  //   {value: 'Driver', viewValue: 'Driver'},
  //   {value: 'SubFleet', viewValue: 'SubFleet'},
  //   {value: 'Group', viewValue: 'Group'},
  //   {value: 'Device', viewValue: 'Device'},
  //   {value: 'Make', viewValue: 'Make'},
  //   {value: 'Model', viewValue: 'Model'},
  //   {value: 'VIN', viewValue: 'VIN'},
  //   {value: 'Plate', viewValue: 'Plate'},
  //   {value: 'Last_Report', viewValue: 'Last Report'},
  //   {value: 'Location', viewValue: 'Location'},
  //   {value: 'Status', viewValue: 'Status'},
  //   {value: 'ServicePlan', viewValue: 'Service Plan'},
  // ]

  // @param {MatDialog} _matDialog

 
  
  constructor(
    private tableApiservice: DataService,
    private httpClient: HttpClient,
    private _matDialog: MatDialog,
    // private product: EcommerceProductComponent

  ) {
      this.loadingIndicator = true;
      this.reorderable = true;

    }

  ngOnInit() {
    // Initial columns, can be used for data list which is will be filtered
    // this.columns = [
    //   { prop: 'unit' }, 
    //   { prop: 'Driver', name: 'Driver' }, 
    //   { prop: 'Subfleet', name: 'SubFleet' },
    //   { prop: 'Group', name: 'Group' },
    //   { prop: 'Device', name: 'Device' }, 
    //   { prop: 'Make', name: 'Make' }, 
    //   { prop: 'Model', name: 'Model' },
    //   { prop: 'VIN', name: 'VIN' },
    //   { prop: 'Plate', name: 'Plate' }, 
    //   { prop: 'Last_report', name: 'Last Report' },
    //   { prop: 'Location', name: 'Location' },
    //   { prop: 'Status', name: 'Status' }, 
    //   { prop: 'Serviceplan', name: 'ServicePlan' }
    // ];

    this.tableApiservice.getTableNgxData().subscribe(Response => {
      this.TableData = Response;
      this.getTabledata();
    });

  }

  getTabledata() {
    this.VEHICLE = this.TableData['Vehicles'];
    this.temp = this.VEHICLE;
    console.log(this.VEHICLE);
  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.

    fromEvent(this.search.nativeElement, 'keydown')
      .pipe(
        debounceTime(550),
        map(x => x['target']['value'])
      )
      .subscribe(value => {
        this.updateFilter(value);
      });
  }

  updateFilter(val: any) {
    const value = val.toString().toLowerCase().trim();
    // get the amount of columns in the table
    const count = 13;
    // get the key names of each column in the dataset
    const keys = Object.keys(this.temp[0]);
    console.log(keys);
    // assign filtered matches to the active datatable
    this.VEHICLE = this.temp.filter(item => {
      // iterate through each row's column data
      console.log("item", item);
      for (let i = 0; i < count; i++) {
        // check for a match
        if (keys[i] === this.selected ) {
          console.log(this.selected);
          if (
            (item[keys[i]] &&
              item[keys[i]]
                .toString()
                .toLowerCase()
                .indexOf(value) !== -1) ||
            !value
          ) {
            // found match, return true to add to result set
            return true;
          }
        }
      }
    });

    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

  public onLimitChange(limit: any): void {
    this.changePageLimit(limit);
    this.table.limit = this.currentPageLimit;
    // this.table.recalculate();
    setTimeout(() => {
      if (this.table.bodyComponent.temp.length <= 0) {
        // TODO[Dmitry Teplov] find a better way.
        // TODO[Dmitry Teplov] test with server-side paging.
        this.table.offset = Math.floor((this.table.rowCount - 1) / this.table.limit);
        // this.table.offset = 0;
      }
    });
  }

  private changePageLimit(limit: any): void {
    this.currentPageLimit = parseInt(limit, 10);
    this.tableApiservice.getTableNgxData().subscribe(Response => {
      this.TableData = Response;
      this.getTabledata();
    });
    console.log("change:", this.currentPageLimit);
  }
}

