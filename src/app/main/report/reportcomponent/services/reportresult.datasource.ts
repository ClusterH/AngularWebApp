import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";
import { ReportResultService } from 'app/main/report/reportcomponent/services/reportresult.service';

export class ReportResultDataSource extends DataSource<any> {
    private reportSubject = new BehaviorSubject<any>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private _unsubscribeAll: Subject<any>;
    public loading$ = this.loadingSubject.asObservable();

    totalLength: number;
    total_page: number;
    page_index: number;
    displayedColumns = [];
    currentCompanyName: string = '';
    currentGroupName: string = '';
    reportResult: any;

    constructor(private reportResultService: ReportResultService) {
        super();
        this._unsubscribeAll = new Subject();
    }

    loadReportResult(pageindex: number, pagesize: number) {
        this.displayedColumns = [];
        this.loadingSubject.next(true);
        this.reportResultService.loadReportResult(pageindex, pagesize)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result.responseCode == 100) {
                    this.reportResult = result.TrackingXLAPI.DATA;
                    for (let column in result.TrackingXLAPI.DATA[0]) {
                        if (column == 'companyid') {
                            this.currentCompanyName = JSON.parse(localStorage.getItem('report_result')).companyname;
                        } else if (column == 'groupid') {
                            this.currentGroupName = JSON.parse(localStorage.getItem('report_result')).groupname;
                        } else if (column != 'id') {
                            this.displayedColumns.push(column);
                        }
                    }
                    this.reportSubject.next(result.TrackingXLAPI.DATA);
                    this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
                    this.page_index = pageindex + 1;
                    this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
                } else if ((result.responseCode == 200)) {
                    this.totalLength = 0;
                }
            });
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.reportSubject.asObservable();
    }

    /**
     * Disconnect
     */
    disconnect(): void {
        this.reportSubject.complete();
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}