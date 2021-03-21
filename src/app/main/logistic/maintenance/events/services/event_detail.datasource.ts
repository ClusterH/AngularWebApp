import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { EventDetailService } from 'app/main/logistic/maintenance/events/services/event_detail.service';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";

export class EventDetailDataSource extends DataSource<any> {
    public eventsSubject = new BehaviorSubject<any>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private _unsubscribeAll: Subject<any>;
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;
    flag: boolean = false;
    selected_method: string;
    selected_method_id: number;
    currentPage_unit_data: any;

    constructor(private eventDetailService: EventDetailService) {
        super();
        this.flag = false; this._unsubscribeAll = new Subject();
    }

    loadCompanyDetail(pageindex: number, pagesize: number, name: string, method: string) {
        if (!name) { name = ''; }
        this.loadingSubject.next(true);
        this.eventDetailService.getCompanies(pageindex, pagesize, name, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this.eventsSubject.next(result.TrackingXLAPI.DATA);
                this.eventDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    loadGroupDetail(pageindex: number, pagesize: number, name: string, companyid, method: string) {
        if (!name) { name = ''; }
        this.loadingSubject.next(true);
        this.eventDetailService.getGroups(pageindex, pagesize, name, companyid)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this.eventsSubject.next(result.TrackingXLAPI.DATA);
                this.eventDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    loadUnitDetail(pageindex: number, pagesize: number, companyid: string, groupid: string, eventid: string) {
        this.loadingSubject.next(true);
        this.eventDetailService.getUnits(pageindex, pagesize, companyid, groupid, eventid)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this.eventsSubject.next(result.TrackingXLAPI.DATA);
                this.currentPage_unit_data = result.TrackingXLAPI.DATA;
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    loadMaintEventUnits(pageindex: number, pagesize: number, eventid: string, groupid: string, name: string, method: string) {
        if (!name) { name = ''; }
        this.loadingSubject.next(true);
        this.eventDetailService.getEventUnits(pageindex, pagesize, eventid, groupid, name, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this.eventsSubject.next(result.TrackingXLAPI.DATA);
                this.eventDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
                this.page_index = pageindex + 1;
            });
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.eventsSubject.asObservable();
    }

    /**
     * Disconnect
     */
    disconnect(): void {
        this.eventsSubject.complete();
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}