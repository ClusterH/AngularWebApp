import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from "rxjs/operators";
import { CommandDetailService } from 'app/main/system/commands/services/command_detail.service'

export class CommandDetailDataSource extends DataSource<any> {
    private commandsSubject = new BehaviorSubject<any>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    totalLength: number;
    total_page: number;
    page_index: number;
    flag: boolean = false;
    selected_method: string;
    selected_method_id: number;
    private _unsubscribeAll: Subject<any>;

    constructor(private commandDetailService: CommandDetailService) {
        super();
        this.flag = false; this._unsubscribeAll = new Subject();
    }

    loadCommandDetail(pageindex: number, pagesize: number, name: string, method: string) {
        if (!name) { name = ''; }
        this.loadingSubject.next(true);
        this.commandDetailService.getCompanies(pageindex, pagesize, name, method)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)), takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this.commandsSubject.next(result.TrackingXLAPI.DATA);
                this.commandDetailService.unit_clist_item[`${method}`] = result.TrackingXLAPI.DATA || [];
                this.totalLength = result.TrackingXLAPI.DATA1 ? Number(result.TrackingXLAPI.DATA1[0].total) : 0;
                this.page_index = pageindex + 1;
                this.total_page = Math.floor(this.totalLength % pagesize == 0 ? this.totalLength / pagesize : this.totalLength / pagesize + 1);
            });
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.commandsSubject.asObservable();
    }

    /**
     * Disconnect
     */
    disconnect(): void {
        this.commandsSubject.complete();
        this.loadingSubject.complete();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}