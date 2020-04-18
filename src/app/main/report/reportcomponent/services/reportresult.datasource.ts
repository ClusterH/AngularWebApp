import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of } from 'rxjs';
import {catchError, finalize} from "rxjs/operators";

import { ReportResultService } from 'app/main/report/reportcomponent/services/reportresult.service';

export class ReportResultDataSource extends DataSource<any>
{
    private reportSubject = new BehaviorSubject<any>([]);
   
    // to show the total number of records
    private loadingSubject = new BehaviorSubject<boolean>(false);
    // private loadingCompanySubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    totalLength: number;
    total_page: number;
    page_index: number;
    displayedColumns = [];
    currentCompanyName: string = '';
    currentGroupName: string = '';

    constructor(
        private reportResultService: ReportResultService,
      
    ) {
        super();
    }
    
    loadReportResult(conncode: string, userid: number, pageindex: number, pagesize: number) {
        console.log("loadVehicles:", conncode, userid,  pagesize, pageindex );
        this.displayedColumns = [];

        this.loadingSubject.next(true);
   
        // use pipe operator to chain functions with Observable type
        this.reportResultService.loadReportResult(conncode, userid, pageindex, pagesize)
        .pipe(
           catchError(() => of([])),
           finalize(() => this.loadingSubject.next(false))
        )
        // subscribe method to receive Observable type data when it is ready
        .subscribe((result : any) => {
            console.log(result);

            if (result.responseCode == 100) {
                for(let column in result.TrackingXLAPI.DATA[0]) {
                    if ( column == 'companyid' ) {
                        this.currentCompanyName = JSON.parse(localStorage.getItem('report_result')).companyname;
                    } else if ( column == 'groupid' ) {
                        this.currentGroupName = JSON.parse(localStorage.getItem('report_result')).groupname;
                    } else if ( column != 'id' ) {
                        this.displayedColumns.push(column);
                    }
                }
    
                console.log(this.displayedColumns);
    
                this.reportSubject.next(result.TrackingXLAPI.DATA);
                this.totalLength = result.TrackingXLAPI.DATA1? Number(result.TrackingXLAPI.DATA1.Total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength/pagesize + 1);
            } else if (result.responseCode == 200) {
                this.totalLength = 0;
                // this.loadingSubject.next(false);
            }

            
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