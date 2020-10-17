import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
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
import { FuseConfirmDialogModule, FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule, FuseMaterialColorPickerModule } from '@fuse/components';
import { FuseDirectivesModule } from '@fuse/directives/directives';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BlockUIModule } from 'ng-block-ui';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { QuicklinkModule } from 'ngx-quicklink';
import { UiSwitchModule } from 'ngx-ui-switch';
import { GridsterModule } from 'angular-gridster2';
import { HttpConfigInterceptor } from 'app/interceptors/https.interceptor';

@NgModule({
    imports: [CommonModule, QuicklinkModule],
    declarations: [],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        HttpClientModule,
        MatMomentDateModule,
        MatButtonModule,
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
        UiSwitchModule,
        NgxMatSelectSearchModule,
        QuicklinkModule,
        NgxChartsModule,
        NgbModule,
        NgSelectModule,
        BlockUIModule,
        GridsterModule,
        FuseProgressBarModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        FuseConfirmDialogModule,
        FuseDirectivesModule,
        FusePipesModule,
        FuseMaterialColorPickerModule,
    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }],
})
export class SharedModule { }