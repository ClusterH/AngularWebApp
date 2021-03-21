import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { OperatorDetailService } from 'app/main/admin/operators/services/operator_detail.service';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";

export class OperatorDetailDataSource extends DataSource<any> {
    private operatorsSubject = new BehaviorSubject<any>([]); private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;

    flag: boolean = false;
    selected_method: string;
    selected_method_id: number;
    private _unsubscribeAll: Subject<any>;

    constructor(private operatorDetailService: OperatorDetailService) {
        super();
        this.flag = false;
        this._unsubscribeAll = new Subject();
    }

    loadOperatorDetail(pageindex: number, pagesize: number, name: string, method: string) {
        if (!name) { name = '' }
        this.loadingSubject.next(true);
        this.operatorDetailService.getCompanies(pageindex, pagesize, name, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((result: any) => {
                this.operatorsSubject.next(result.TrackingXLAPI.DATA);
                this.operatorDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    loadOperatorGroupDetail(pageindex: number, pagesize: number, name: string, companyid: number, method: string) {
        if (!name) { name = '' }
        this.loadingSubject.next(true);
        this.operatorDetailService.getGroup(pageindex, pagesize, name, companyid, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((result: any) => {
                this.operatorsSubject.next(result.TrackingXLAPI.DATA);
                this.operatorDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.operatorsSubject.asObservable();
    }

    disconnect(): void {
        this.operatorsSubject.complete();
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}