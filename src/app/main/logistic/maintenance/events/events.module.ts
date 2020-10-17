import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { EventsComponent } from 'app/main/logistic/maintenance/events/events/events.component';
import { EventsService } from 'app/main/logistic/maintenance/events/services/events.service';
import { EventDetailComponent } from 'app/main/logistic/maintenance/events/event_detail/event_detail.component';
import { EventDetailService } from 'app/main/logistic/maintenance/events/services/event_detail.service';
import { CourseDialogComponent } from 'app/main/logistic/maintenance/events/dialog/dialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'events', component: EventsComponent },
    { path: 'event_detail', component: EventDetailComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        EventsComponent,
        EventDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        EventsService, EventDetailService
    ]
})
export class EventsModule { }