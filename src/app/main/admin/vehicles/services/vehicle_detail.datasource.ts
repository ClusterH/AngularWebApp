import {CollectionViewer, DataSource} from "@angular/cdk/collections";
// import { MatPaginator, PageEvent } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
import { Observable, BehaviorSubject, of } from 'rxjs';
import {catchError, finalize} from "rxjs/operators";

// import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { VehicleDetailService } from 'app/main/admin/vehicles/services/vehicle_detail.service'
import { VehiclesComponent } from "app/main/admin/vehicles/vehicles/vehicles.component";

// import { FuseUtils } from '@fuse/utils';

export class VehicleDetailDataSource extends DataSource<any>
{
    private vehiclesSubject = new BehaviorSubject<any>([]);

    // to show the total number of records
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;
    flag: boolean =false;
    selected_method: string;
    selected_method_id: number;
    // private countSubject = new BehaviorSubject<number>(0);
    // public counter$ = this.countSubject.asObservable();


    constructor(
        private vehicleDetailService: VehicleDetailService,

        // private _matPaginator: any,
        // private pageIndex: number,
        // private pageSize: number,
        // private _matSort: MatSort
    ) {
        super();
        this.flag = false;
    }

    loadCompanies(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, method: string) {
        console.log("loadVehicles:", conncode, userid,  pagesize, pageindex, name, method );
        this.loadingSubject.next(true);
        if (this.vehicleDetailService.vehicle_detail == '') {
            this.selected_method = '';
        } else {
            switch(method) {
                case 'company_clist':
                    this.selected_method_id = this.vehicleDetailService.vehicle_detail.companyid
                    this.selected_method = this.vehicleDetailService.vehicle_detail.company
                    break;
                case 'account_clist':
                    this.selected_method = this.vehicleDetailService.vehicle_detail.account
                    this.selected_method_id = this.vehicleDetailService.vehicle_detail.accountid
                    break;
                case 'group_clist':
                    this.selected_method = this.vehicleDetailService.vehicle_detail.account
                    this.selected_method_id = this.vehicleDetailService.vehicle_detail.accountid
                    break;
                case 'operator_clist':
                    this.selected_method = this.vehicleDetailService.vehicle_detail.operator
                    this.selected_method_id = this.vehicleDetailService.vehicle_detail.operatorid
                    break;
                case 'unittype_clist':
                    this.selected_method = this.vehicleDetailService.vehicle_detail.unittype
                    this.selected_method_id= this.vehicleDetailService.vehicle_detail.unittypeid
                    break;
                case 'serviceplan_clist':
                    this.selected_method = this.vehicleDetailService.vehicle_detail.serviceplan
                    this.selected_method_id = this.vehicleDetailService.vehicle_detail.serviceplanid
                    break;
                case 'producttype_clist':
                    this.selected_method = this.vehicleDetailService.vehicle_detail.producttype
                    this.selected_method_id = this.vehicleDetailService.vehicle_detail.producttypeid
                    break;
                case 'make_clist':
                    this.selected_method = this.vehicleDetailService.vehicle_detail.make
                    this.selected_method_id = this.vehicleDetailService.vehicle_detail.makeid
                    break;
                case 'model_clist':
                    this.selected_method = this.vehicleDetailService.vehicle_detail.model
                    this.selected_method_id = this.vehicleDetailService.vehicle_detail.modelid
                    break;
                case 'timezone_clist':
                    this.selected_method = this.vehicleDetailService.vehicle_detail.timezone
                    this.selected_method_id = this.vehicleDetailService.vehicle_detail.timezoneid
                    break;
            }
        }
   
        // use pipe operator to chain functions with Observable type
        this.vehicleDetailService.getCompanies(conncode, userid, pageindex, pagesize, name, method)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
           console.log("method:", method, result);
           if (pageindex == 0 && this.vehicleDetailService.vehicle_detail && this.selected_method && !this.flag) {
               console.log("add started1");
               for(let i = 0; i < result.TrackingXLAPI.DATA.length; i++) {
                   if (this.selected_method == result.TrackingXLAPI.DATA[i].name) {
                       this.flag = true;

                       result.TrackingXLAPI.DATA.forEach(function(item, j){
                           if(item.name == result.TrackingXLAPI.DATA[i].name ) {
                                result.TrackingXLAPI.DATA.splice(j, 1);
                                result.TrackingXLAPI.DATA.unshift(item);
                           }
                       })
                   }
               }

               if (!this.flag ) {
                    let temp = {id: this.selected_method_id, name: this.selected_method};
                    let subResult = result.TrackingXLAPI.DATA.unshift(temp);
                    console.log(subResult);
                    this.vehiclesSubject.next(result.TrackingXLAPI.DATA);
                    console.log("add started2");

                } else {
                    this.vehiclesSubject.next(result.TrackingXLAPI.DATA);
                    console.log(result.TrackingXLAPI.DATA);
                }
           } else {
            
                this.vehiclesSubject.next(result.TrackingXLAPI.DATA);
                console.log(result.TrackingXLAPI.DATA);
           }

           this.totalLength = Number(result.TrackingXLAPI.DATA1.Total);

           this.page_index = pageindex + 1;
           this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength/pagesize + 1);

           console.log(this.totalLength);
        //    this.countSubject.next(result.TrackingXLAPI.DATA1);
          }
        );
     }
   
    connect(collectionViewer: CollectionViewer): Observable<any[]>
    {
        console.log("Connecting data source");
        return this.vehiclesSubject.asObservable();
    }
 
    /**
     * Disconnect
     */
    disconnect(): void
    {
        this.vehiclesSubject.complete();
        this.loadingSubject.complete();
    }
}