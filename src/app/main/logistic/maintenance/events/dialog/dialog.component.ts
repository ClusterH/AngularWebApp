import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { EventsService } from 'app/main/logistic/maintenance/events/services/events.service';
import { EventsDataSource } from "app/main/logistic/maintenance/events/services/events.datasource";

import { locale as eventsEnglish } from 'app/main/logistic/maintenance/events/i18n/en';
import { locale as eventsSpanish } from 'app/main/logistic/maintenance/events/i18n/sp';
import { locale as eventsFrench } from 'app/main/logistic/maintenance/events/i18n/fr';
import { locale as eventsPortuguese } from 'app/main/logistic/maintenance/events/i18n/pt';

@Component({
    selector: 'event-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

    event: any;
    flag: any;



    dataSource: EventsDataSource;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private eventsService: EventsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
    ) {


        this._fuseTranslationLoaderService.loadTranslations(eventsEnglish, eventsSpanish, eventsFrench, eventsPortuguese);

        this.event = _data.eventDetail;
        this.flag = _data.flag;
    }

    ngOnInit() {
    }

    deleteList(): boolean {
        let deletedMaintevent = this.eventsService.mainteventList.findIndex((index: any) => index.id == this.event.id);

        if (deletedMaintevent > -1) {
            this.eventsService.mainteventList.splice(deletedMaintevent, 1);

            return true;
        }
    }

    delete() {
        let result = this.deleteList();

        if (result) {
            this.eventsService.deleteEvent(this.event.id)
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        this.dataSource = new EventsDataSource(this.eventsService);
                        this.dataSource.eventsSubject.next(this.eventsService.mainteventList);
                    }
                });
            // this.flagForDeleting.next(false);
            this.dialogRef.close(this.eventsService.mainteventList);
        }
    }
    close() {
        // localStorage.removeItem("event_detail");
        this.dialogRef.close(this.eventsService.mainteventList);
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("event_detail");

        this.router.navigate(['logistic/events/events']);
    }
}
