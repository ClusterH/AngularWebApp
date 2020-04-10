import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of } from 'rxjs';
import {catchError, finalize} from "rxjs/operators";

import { ReportService } from 'app/main/report/reportcomponent/services/report.service';

export class ReportDataSource extends DataSource<any>
{
    private reportSubject = new BehaviorSubject<any>([]);
    private companySubject = new BehaviorSubject<any>([]);

    // to show the total number of records
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private loadingCompanySubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;


    constructor(
        private reportService: ReportService,
      
    ) {
        super();
    }
    
    loadReport(conncode: string, userid: number, pageindex: number, pagesize: number, categoryid: any, filterString: string, method: string) {
        console.log("loadVehicles:", conncode, userid,  pagesize, pageindex, filterString, method );
        this.loadingSubject.next(true);
   
        // use pipe operator to chain functions with Observable type
        this.reportService.getReports(conncode, userid, pageindex, pagesize, categoryid, filterString, method)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
            console.log(result);
            if (method == 'report_clist') {
                this.reportService.report_cList = result.TrackingXLAPI.DATA;
            }

            this.reportSubject.next(result.TrackingXLAPI.DATA);
            this.totalLength = result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0;
            this.page_index = pageindex + 1;
            this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength/pagesize + 1);
        });
    }
   
    connect(collectionViewer: CollectionViewer): Observable<any[]>
    {
        return this.reportSubject.asObservable();
        // return this.companySubject.asObservable();
    }
 
    /**
     * Disconnect
     */
    disconnect(): void
    {
        this.reportSubject.complete();
        this.loadingSubject.complete();
        // this.loadingCompanySubject.complete();
    }
}