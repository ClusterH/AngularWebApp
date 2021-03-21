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
import { MessageService } from 'primeng/api';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private router: Router, private messageService: MessageService) { }
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // const baseURL = 'http://trackingxlapipg.polarix.com/';
        const baseURL = 'http://trackingxlapi.polarix.com/';
        const request = req.url;
        if (!request.includes(baseURL)) {
            req = req.clone({ url: `${baseURL}${request}` });
        }

        req = req.clone({ headers: req.headers.set("Authorization", "Basic " + btoa("trackingxl:4W.f#jB*[pE.j9m")) });
        const token: string = localStorage.getItem('current_token') || '';
        if (token.length != 0) {
            const conncode: string = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].conncode;
            const userid: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;

            if (req.method == 'GET') {
                req = req.clone({ params: req.params.set("token", token) });
                req = req.clone({ params: req.params.set("conncode", conncode) });
                req = req.clone({ params: req.params.set("userid", userid.toString()) });
            }
        }

        return next.handle(req).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    if (event.body.responseCode == 211 || event.body.responseCode == 210) {
                        localStorage.removeItem('current_token');
                        this.generateToast('warn', 'Your user has signed in from a different device');
                        // alert('Your user has signed in from a different device');
                        this.router.navigate(['/login']);
                    } else if (event.body.responseCode === 100) {
                        localStorage.setItem('current_token', event.body.token);
                    }
                    return event;
                }
            }), catchError((err: HttpErrorResponse) => {

                this.generateToast('error', 'Woops! There was an Server Error!');
                return throwError(err);
            }));
    }

    generateToast(severity: string, summary: string): void {
        this.messageService.add({
            severity: severity,
            summary: summary,
            life: 5000,
        });
    }
}
