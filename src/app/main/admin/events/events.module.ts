import { NgModule } from '@angular/core';
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CourseDialogComponent } from 'app/main/admin/events/dialog/dialog.component';
import { EventsComponent } from 'app/main/admin/events/events/events.component';
import { EventDetailComponent } from 'app/main/admin/events/event_detail/event_detail.component';
import { EventsService } from 'app/main/admin/events/services/events.service';
import { EventDetailService } from 'app/main/admin/events/services/event_detail.service';
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