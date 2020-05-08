import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { EventsService } from 'app/main/logistic/maintenance/events/services/events.service';

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

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private eventsService: EventsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {event, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(eventsEnglish, eventsSpanish, eventsFrench, eventsPortuguese);

        this.event = event;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.event.id = 0;
            this.event.name = '';
            this.event.email = '';
            this.event.password = '';
            this.event.created = '';
            this.event.createdbyname = '';
            this.event.deletedwhen = '';
            this.event.deletedbyname = '';
            this.event.lastmodifieddate = '';
            this.event.lastmodifiedbyname = '';
    
            localStorage.setItem("event_detail", JSON.stringify(this.event));
    
            console.log("localstorage:", JSON.parse(localStorage.getItem("event_detail")));
    
            this.router.navigate(['logistic/events/event_detail']);
        } else if( this.flag == "delete") {
            this.eventsService.deleteEvent(this.event.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    // this.reloadComponent();
                }
              });
        }


        this.dialogRef.close();
    }

    close() {
        localStorage.removeItem("event_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("event_detail");

        this.router.navigate(['logistic/events/events']);
    }

    // reloadComponent() {
    //     this.router.routeReuseStrategy.shouldReeventoute = () => false;
    //     this.router.onSameUrlNavigation = 'reload';
    //     this.router.navigate(['logistic/events/events']);
    // }

}
