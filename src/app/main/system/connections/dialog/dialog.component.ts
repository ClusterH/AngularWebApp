import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ConnectionsService } from 'app/main/system/connections/services/connections.service';
import { locale as connectionsEnglish } from 'app/main/system/connections/i18n/en';
import { locale as connectionsSpanish } from 'app/main/system/connections/i18n/sp';
import { locale as connectionsFrench } from 'app/main/system/connections/i18n/fr';
import { locale as connectionsPortuguese } from 'app/main/system/connections/i18n/pt';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'connection-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    private _unsubscribeAll: Subject<any>;
    connection: any;
    flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private connectionsService: ConnectionsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { connection, flag }
    ) {
        this._fuseTranslationLoaderService.loadTranslations(connectionsEnglish, connectionsSpanish, connectionsFrench, connectionsPortuguese);
        this._unsubscribeAll = new Subject();
        this.connection = connection;
        this.flag = flag;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.connection.id = 0;
            this.connection.name = '';
            this.connection.created = '';
            this.connection.createdbyname = '';
            this.connection.deletedwhen = '';
            this.connection.deletedbyname = '';
            this.connection.lastmodifieddate = '';
            this.connection.lastmodifiedbyname = '';
            this.dialogRef.close(this.connection);
        } else if (this.flag == "delete") {
            this.connectionsService.deleteConnection(this.connection.id).pipe(takeUntil(this._unsubscribeAll))
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