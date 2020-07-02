import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { FuseConfirmDialogModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { CourseDialogComponent } from 'app/main/admin/events/dialog/dialog.component';
import { EventsComponent } from 'app/main/admin/events/events/events.component';
import { EventDetailComponent } from 'app/main/admin/events/event_detail/event_detail.component';
import { EventsService } from 'app/main/admin/events/services/events.service';
import { EventDetailService } from 'app/main/admin/events/services/event_detail.service';
import { BlockUIModule } from 'ng-block-ui';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { UiSwitchModule } from 'ngx-ui-switch';

const routes = [
    {
        path: 'events',
        component: EventsComponent,
        // pathMatch: 'full'
    },
    {
        path: 'event_detail',
        component: EventDetailComponent,
        // pathMatch: 'full'
    },
];

@NgModule({
    imports: [
        FuseSharedModule,
        FuseConfirmDialogModule,
        NgxMatSelectSearchModule,

        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        MatSelectModule,
        MatInputModule,
        MatToolbarModule,
        MatDatepickerModule,
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        MatDialogModule,
        MatProgressSpinnerModule,

        TranslateModule,
        HttpClientModule,

        NgSelectModule,
        BlockUIModule,

        NgbModule,
        CommonModule,
        UiSwitchModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
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
