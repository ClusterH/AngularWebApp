import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";
import { InstallersService } from 'app/main/system/installations/installers/services/installers.service'

export class InstallersDataSource extends DataSource<any> {
    public installersSubject = new BehaviorSubject<any>([]);
    // to show the total number of records
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;
    private _unsubscribeAll: Subject<any>;

    constructor(private installersService: InstallersService) {
        super(); this._unsubscribeAll = new Subject();
    }

    loadInstallers(conncode: string, userid: number, pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string) {
        this.loadingSubject.next(true);
        // use pipe operator to chain functions with Observable type
        this.installersService.getInstallers(conncode, userid, pageindex, pagesize, orderby, orderdirection, filterItem, filterString, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)),
                takeUntil(this._unsubscribeAll)
            ).subscribe((result: any) => {
                this.installersSubject.next(result.TrackingXLAPI.DATA);
                this.installersService.installerList = result.TrackingXLAPI.DATA;
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1.Total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    loadCompanyDetail(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, method: string) {
        if (!name) { name = '' }
        this.loadingSubject.next(true);
        // use pipe operator to chain functions with Observable type
        this.installersService.getCompanies(conncode, userid, pageindex, pagesize, name, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)),
                takeUntil(this._unsubscribeAll)
            ).subscribe((result: any) => {
                this.installersSubject.next(result.TrackingXLAPI.DATA);
                this.installersService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1.Total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    loadGroupDetail(conncode: string, userid: number, pageindex: number, pagesize: number, name: string, companyid, method: string) {
        if (!name) { name = '' };
        this.loadingSubject.next(true);
        this.installersService.getGroups(conncode, userid, pageindex, pagesize, name, companyid)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)),
                takeUntil(this._unsubscribeAll)
            ).subscribe((result: any) => {
                this.installersSubject.next(result.TrackingXLAPI.DATA);
                this.installersService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1.Total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.installersSubject.asObservable();
    }

    disconnect(): void {
        this.installersSubject.complete();
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}