import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatMenuModule } from '@angular/material/menu';


import { NgSelectModule } from '@ng-select/ng-select';
import { BlockUIModule } from 'ng-block-ui';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { PoigroupsComponent} from 'app/main/admin/poi/poigroups/poigroups/poigroups.component';
import { PoigroupsService } from 'app/main/admin/poi/poigroups/services/poigroups.service';
import { PoigroupDetailComponent} from 'app/main/admin/poi/poigroups/poigroup_detail/poigroup_detail.component';
import { PoigroupDetailService } from 'app/main/admin/poi/poigroups/services/poigroup_detail.service';
import { ContactsContactListComponent } from 'app/main/admin/poi/poigroups/poigroup_detail/contact-list/contact-list.component';
import { ContactsSelectedBarComponent } from 'app/main/admin/poi/poigroups/poigroup_detail/selected-bar/selected-bar.component';
import { ContactsMainSidebarComponent } from 'app/main/admin/poi/poigroups/poigroup_detail/sidebars/main/main.component';
import { ContactsContactFormDialogComponent } from 'app/main/admin/poi/poigroups/poigroup_detail/contact-form/contact-form.component';
import { CourseDialogComponent } from 'app/main/admin/poi/poigroups/dialog/dialog.component';
import { ContactsService } from 'app/main/admin/poi/poigroups/poigroup_detail/contacts.service';

import { HttpClientModule } from '@angular/common/http';

const routes = [
    {
        path     : 'poigroups',
        component: PoigroupsComponent,
        // pathMatch: 'full'
    },
    {
        path     : 'poigroup_detail',
        component: PoigroupDetailComponent,
        resolve : {
            contacts: ContactsService
        }
        // pathMatch: 'full'
    },
];

@NgModule({
    imports     : [
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,

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
        MatMenuModule,

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
        PoigroupsComponent,
        PoigroupDetailComponent,
        ContactsContactListComponent,
        ContactsSelectedBarComponent,
        ContactsMainSidebarComponent,
        ContactsContactFormDialogComponent,
        CourseDialogComponent,
    ],
    providers: [
        PoigroupsService, PoigroupDetailService, ContactsService
    ]
})
export class PoigroupsModule{ }
