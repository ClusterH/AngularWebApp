import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';

@Injectable()
export class AuthService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
    ) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user_info')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    userLogin(email: string, password: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));

        let params = new HttpParams()
            .set('email', email)
            .set('password', password)

        // http://trackingxlapi.polarix.com/AuthenticateUser.ashx?{email:%22polarix@polarixusa.com%22,password:%22f0r3s1ght01!%22}
        return this._httpClient.get('http://trackingxlapi.polarix.com/AuthenticateUser.ashx', {
            headers: headers,
            params: params
        });
        // .pipe(map(user => {

        //     if (user) {
        //         localStorage.setItem('user_info', JSON.stringify(user));
        //     }

        //     this.currentUserSubject.next(user);
        //     return user;
        // }), share());
    }

    getUserObject() {


        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
        let id: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        let params = new HttpParams()
            .set('id', id.toString())
            .set('method', 'user_Object');
        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx', {
            headers: headers,
            params: params
        });
    }

    logOut() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user_info');
        localStorage.removeItem('current_token');
        this.currentUserSubject.next(null);
    }
}