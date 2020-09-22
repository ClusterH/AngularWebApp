import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";

import { ReportService } from 'app/main/report/reportcomponent/services/report.service';

export class ReportDataSource extends DataSource<any>
{
    private reportSubject = new BehaviorSubject<any>([]);
    // private companySubject = new BehaviorSubject<any>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private _unsubscribeAll: Subject<any>;

    // private loadingCompanySubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;


    constructor(
        private reportService: ReportService,

    ) {
        super();
        this._unsubscribeAll = new Subject();
    }

    loadReport(pageindex: number, pagesize: number, categoryid: any, filterString: string, method: string) {

        this.loadingSubject.next(true);
        this.reportService.getReports(pageindex, pagesize, categoryid, filterString, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {

                if (method == 'report_clist') {
                    this.reportService.report_cList = result.TrackingXLAPI.DATA;
                }

                this.reportSubject.next(result.TrackingXLAPI.DATA);
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].Total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    loadGroup(pageindex: number, pagesize: number, companyid: any, filterString: string, method: string) {

        this.loadingSubject.next(true);
        this.reportService.loadGroup(pageindex, pagesize, companyid, filterString, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {


                this.reportSubject.next(result.TrackingXLAPI.DATA);
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].Total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.reportSubject.asObservable();
        // return this.companySubject.asObservable();
    }

    /**
     * Disconnect
     */
    disconnect(): void {
        this.reportSubject.complete();
        this.loadingSubject.complete();
        // this.loadingCompanySubject.complete();
    }
}