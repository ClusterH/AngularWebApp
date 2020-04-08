import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import { Observable, BehaviorSubject, of } from 'rxjs';
import {catchError, finalize} from "rxjs/operators";

import { ModelDetailService } from 'app/main/admin/models/services/model_detail.service'
import { ModelsComponent } from "app/main/admin/models/models/models.component";

export class ModelDetailDataSource extends DataSource<any>
{
    private modelsSubject = new BehaviorSubject<any>([]);

    // to show the total number of records
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;
  
    flag: boolean =false;
    selected_method: string;
    selected_method_id: number;

    constructor(
        private modelDetailService: ModelDetailService,
    ) {
        super();
        this.flag = false;
    }

    loadModelDetail(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, method: string) {
        console.log("loadModels:", conncode, userid,  pagesize, pageindex, name, method );
        if (!name) {
            name = '';
        }
        this.loadingSubject.next(true);
       
        // use pipe operator to chain functions with Observable type
        this.modelDetailService.getCompanies(conncode, userid, pageindex, pagesize, name, method)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
           console.log("method:", method, result);
       
            this.modelsSubject.next(result.TrackingXLAPI.DATA);
            console.log(result.TrackingXLAPI.DATA);
            this.modelDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
          
            console.log("unit_clist: ", this.modelDetailService.unit_clist_item);
            this.totalLength = result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0;

            this.page_index = pageindex + 1;
            this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength/pagesize + 1);

            console.log(this.totalLength);   
          }
        );
     }
   
    connect(collectionViewer: CollectionViewer): Observable<any[]>
    {
        console.log("Connecting data source");
        return this.modelsSubject.asObservable();
    }
 
    /**
     * Disconnect
     */
    disconnect(): void
    {
        this.modelsSubject.complete();
        this.loadingSubject.complete();
    }
}