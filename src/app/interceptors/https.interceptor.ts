import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HttpResponse
} from "@angular/common/http";
import { throwError, Observable, BehaviorSubject, of } from "rxjs";
import { catchError, filter, finalize, take, switchMap, map, first } from "rxjs/operators";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }

    intercept(

        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // console.log(req);
        let token: string = localStorage.getItem('current_token') || '';
        // let conncode: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        // let userid: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

        if (token.length != 0) {
            req = req.clone({ params: req.params.set("token", token) });
            // req = req.clone({ params: req.params.set("conncode", conncode) });
            // req = req.clone({ params: req.params.set("userid", userid.toString()) });
            // console.log(req);
        }
        return next.handle(req).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // console.log(event);
                    if (event.body.responseCode == 211 || event.body.responseCode == 210) {
                        // console.log('211=======>>> interceptor');
                        localStorage.removeItem('current_token');
                        alert('Your user has signed in from a different device');
                        this.router.navigate(['/login']);
                    } else if (event.body.responseCode == 100) {
                        // console.log('100=======>>> interceptor');
                        localStorage.setItem('current_token', event.body.token);
                    }

                    // if (event.body.token != '') {
                    //     console.log('211=======>>> interceptor');
                    //     localStorage.setItem('current_token', event.body.token);
                    // }

                    return event;
                }
            }));
    }
}
