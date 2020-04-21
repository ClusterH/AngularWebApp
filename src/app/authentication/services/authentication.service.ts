import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService
{
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
        
    userLogin(email: string, password: string ):Observable<any>
    {
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
       
        let params = new HttpParams()
            .set('email', email)
            .set('password', password)

        console.log('params', params);
        // http://trackingxlapi.polarix.com/AuthenticateUser.ashx?{email:%22polarix@polarixusa.com%22,password:%22f0r3s1ght01!%22}
        return this._httpClient.get('http://trackingxlapi.polarix.com/AuthenticateUser.ashx',{
            headers: headers,   
            params: params
        })
        .pipe(map(user => {
            console.log( user);
            if (user) {
                localStorage.setItem('user_info', JSON.stringify(user));
            }
            
            this.currentUserSubject.next(user);
            return user;
        }));
    }

    getUserObject(conncode: string, id: number) {
        console.log(conncode, id)
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m"));
       
        let params = new HttpParams()
            .set('conncode', conncode.toString())
            .set('id', id.toString())
            .set('method', 'user_Object');

        console.log('params', params);
        return this._httpClient.get('http://trackingxlapi.polarix.com/trackingxlapi.ashx',{
            headers: headers,   
            params: params
        })
    }

    logOut() {
        // remove user from local storage and set current user to null
        console.log("logout");
       
        localStorage.removeItem('user_info');

        this.currentUserSubject.next(null);
        
    }
}
