import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as eventsEnglish } from 'app/main/admin/events/i18n/en';
import { locale as eventsFrench } from 'app/main/admin/events/i18n/fr';
import { locale as eventsPortuguese } from 'app/main/admin/events/i18n/pt';
import { locale as eventsSpanish } from 'app/main/admin/events/i18n/sp';
import { EventsService } from 'app/main/admin/events/services/events.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'event-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    event: any;
    flag: any;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private eventsService: EventsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { event, flag }
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(eventsEnglish, eventsSpanish, eventsFrench, eventsPortuguese);
        this.event = event;
        this.flag = flag;
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.event.id = 0;
            this.event.name = '';
            this.event.createdwhen = '';
            this.event.createdbyname = '';
            this.event.lastmodifieddate = '';
            this.event.lastmodifiedbyname = '';
            this.dialogRef.close(this.event);
        } else if (this.flag == "delete") {
            this.eventsService.deleteEvent(this.event.id).pipe(takeUntil(this._unsubscribeAll))
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