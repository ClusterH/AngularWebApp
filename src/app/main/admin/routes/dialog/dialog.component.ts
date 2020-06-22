import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { RoutesService } from 'app/main/admin/routes/services/routes.service';
import { locale as routesEnglish } from 'app/main/admin/routes/i18n/en';
import { locale as routesSpanish } from 'app/main/admin/routes/i18n/sp';
import { locale as routesFrench } from 'app/main/admin/routes/i18n/fr';
import { locale as routesPortuguese } from 'app/main/admin/routes/i18n/pt';

@Component({
    selector: 'route-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   route: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private routesService: RoutesService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {route, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(routesEnglish, routesSpanish, routesFrench, routesPortuguese);

        this.route = route;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.route.id = 0;
            this.route.name = '';
            this.route.createdwhen = '';
            this.route.createdbyname = '';
            this.route.lastmodifieddate = '';
            this.route.lastmodifiedbyname = '';
    
            localStorage.setItem("route_detail", JSON.stringify(this.route));
    
            
    
            this.router.navigate(['admin/routes/route_detail']);
        } else if( this.flag == "delete") {
            this.routesService.deleteRoute(this.route.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    this.reloadComponent();
                }
            });
        }

        this.dialogRef.close();
    }

    close() {
        localStorage.removeItem("route_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("route_detail");

        this.router.navigate(['admin/routes/routes']);
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['admin/routes/routes']);
    }

}
