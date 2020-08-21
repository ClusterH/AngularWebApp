import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as routesEnglish } from 'app/main/admin/routes/i18n/en';
import { locale as routesFrench } from 'app/main/admin/routes/i18n/fr';
import { locale as routesPortuguese } from 'app/main/admin/routes/i18n/pt';
import { locale as routesSpanish } from 'app/main/admin/routes/i18n/sp';
import { RoutesService } from 'app/main/admin/routes/services/routes.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'route-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    route: any;
    flag: any;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private routesService: RoutesService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { route, flag }
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(routesEnglish, routesSpanish, routesFrench, routesPortuguese);
        this.route = route;
        this.flag = flag;
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.route.id = 0;
            this.route.name = '';
            this.route.createdwhen = '';
            this.route.createdbyname = '';
            this.route.lastmodifieddate = '';
            this.route.lastmodifiedbyname = '';
            this.dialogRef.close(this.route);
        } else if (this.flag == "delete") {
            this.routesService.deleteRoute(this.route.id).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        this.dialogRef.close(result);
                    }
                });
        }
    }

    close() { this.dialogRef.close(); }
    goback() { this.dialogRef.close('goback'); }
}