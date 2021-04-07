import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";
import { ZonesService } from '../services';

export class CompanyDataSource extends DataSource<any> {
    public contractorsSubject = new BehaviorSubject<any>([]); private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;
    private _unsubscribeAll: Subject<any>;

    constructor(private zonesService: ZonesService) {
        super(); this._unsubscribeAll = new Subject();
    }

    loadCompanyList(pageindex: number, pagesize: number, filterString: string) {
        this.loadingSubject.next(true);
        this.zonesService.getCompany(pageindex, pagesize, filterString)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)),
                takeUntil(this._unsubscribeAll)
            ).subscribe((result: any) => {
                this.contractorsSubject.next(result.TrackingXLAPI.DATA);
                this.zonesService.currentCompanyClist = result.TrackingXLAPI.DATA;
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    loadGroupList(pageindex: number, pagesize: number, name: string, companyid: string) {
        if (!name) { name = ''; }
        this.loadingSubject.next(true);
        // use pipe operator to chain functions with Observable type
        this.zonesService.getGroups(pageindex, pagesize, name, companyid)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)),
                takeUntil(this._unsubscribeAll)
            ).subscribe((result: any) => {
                this.contractorsSubject.next(result.TrackingXLAPI.DATA);
                this.zonesService.currentGroupClist = result.TrackingXLAPI.DATA || [];
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }


    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.contractorsSubject.asObservable();
    }

    disconnect(): void {
        this.contractorsSubject.complete();
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}