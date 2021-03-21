import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";
import { UserProfilesService } from 'app/main/system/userprofiles/services/userprofiles.service'

export class UserProfilesDataSource extends DataSource<any> {
    public userprofilesSubject = new BehaviorSubject<any>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;
    private _unsubscribeAll: Subject<any>;

    constructor(private _adminUserProfilesService: UserProfilesService) {
        super();
        this._unsubscribeAll = new Subject();
    }

    loadUserProfiles(pageindex: number, pagesize: number, orderby: string, orderdirection: string, filterItem: string, filterString: string, method: string) {
        this.loadingSubject.next(true);
        this._adminUserProfilesService.getUserProfiles(pageindex, pagesize, orderby, orderdirection, filterItem, filterString, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this._adminUserProfilesService.userprofileList = result.TrackingXLAPI.DATA;
                this.userprofilesSubject.next(result.TrackingXLAPI.DATA);
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.userprofilesSubject.asObservable();
    }

    /**
     * Disconnect
     */
    disconnect(): void {
        this.userprofilesSubject.complete();
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}