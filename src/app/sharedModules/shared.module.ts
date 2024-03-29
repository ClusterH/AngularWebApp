import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Material
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatDatetimepickerModule, MatNativeDatetimeModule } from "@mat-datetimepicker/core";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
//Fuse
import { FuseConfirmDialogModule, FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule, FuseMaterialColorPickerModule } from '@fuse/components';
import { FuseDirectivesModule } from '@fuse/directives/directives';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { QuicklinkModule } from 'ngx-quicklink';
import { GridsterModule } from 'angular-gridster2';
import { DndDirective } from './directives/file-dnd/dnd.directive';
//PrimeNg
import { MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
    imports: [CommonModule, QuicklinkModule],
    declarations: [DndDirective],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        //Material
        MatMomentDateModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatIconModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSelectModule,
        MatInputModule,
        MatToolbarModule,
        MatDatepickerModule,
        MatChipsModule,
        MatRippleModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatListModule,
        MatMenuModule,
        MatPaginatorModule,
        MatSnackBarModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatAutocompleteModule,
        MatDividerModule,
        MatSlideToggleModule,

        //PrimeNg
        MultiSelectModule,
        MenuModule,
        ToastModule,
        CalendarModule,

        MatDatetimepickerModule,
        MatNativeDatetimeModule,
        NgxMatNativeDateModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        FontAwesomeModule,
        QuicklinkModule,
        NgxChartsModule,
        GridsterModule,
        DndDirective,

        FuseProgressBarModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        FuseConfirmDialogModule,
        FuseDirectivesModule,
        FusePipesModule,
        FuseMaterialColorPickerModule,
    ],
    providers: [MessageService]
})

export class SharedModule { }