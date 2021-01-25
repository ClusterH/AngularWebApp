import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class RoutePlanningStorageService {
    public selectedRouteListSubject = new BehaviorSubject<any>(null);
    loading$: Observable<any> = this.selectedRouteListSubject.asObservable();
    public clickedStopMoveToCenterSubject = new BehaviorSubject<any>(null);
    loadingStop$: Observable<any> = this.clickedStopMoveToCenterSubject.asObservable();

    constructor() { }

    setJobList(routeList): void {
        this.selectedRouteListSubject.next(routeList);
    }
}