import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ConnectionsService } from 'app/main/system/connections/services/connections.service';

import { locale as connectionsEnglish } from 'app/main/system/connections/i18n/en';
import { locale as connectionsSpanish } from 'app/main/system/connections/i18n/sp';
import { locale as connectionsFrench } from 'app/main/system/connections/i18n/fr';
import { locale as connectionsPortuguese } from 'app/main/system/connections/i18n/pt';

@Component({
    selector: 'connection-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   connection: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private connectionsService: ConnectionsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {connection, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(connectionsEnglish, connectionsSpanish, connectionsFrench, connectionsPortuguese);

        this.connection = connection;
        this.flag = flag;
        
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.connection.id = 0;
            this.connection.name = '';
            this.connection.created = '';
            this.connection.createdbyname = '';
            this.connection.deletedwhen = '';
            this.connection.deletedbyname = '';
            this.connection.lastmodifieddate = '';
            this.connection.lastmodifiedbyname = '';
    
            localStorage.setItem("connection_detail", JSON.stringify(this.connection));
    
            
    
            this.router.navigate(['system/connections/connection_detail']);
        } else if( this.flag == "delete") {
            this.connectionsService.deleteConnection(this.connection.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    this.reloadComponent();
                }
            });
        }

        this.dialogRef.close();
    }

    close() {
        localStorage.removeItem("connection_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("connection_detail");

        this.router.navigate(['system/connections/connections']);
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['system/connections/connections']);
    }

}
