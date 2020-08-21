import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
import { FuseConfirmDialogModule, FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { FuseDirectivesModule } from '@fuse/directives/directives';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BlockUIModule } from 'ng-block-ui';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { QuicklinkModule } from 'ngx-quicklink';
import { UiSwitchModule } from 'ngx-ui-switch';
import { HttpConfigInterceptor } from 'app/interceptors/https.interceptor';

import { MatDialogModule } from "@angular/material/dialog";

import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ContractorsComponent } from 'app/main/system/installations/contractors/contractors/contractors.component';
import { DeleteDialogComponent } from 'app/main/system/installations/contractors/deletedialog/deletedialog.component';
import { ContractorDialogComponent } from 'app/main/system/installations/contractors/dialog/dialog.component';
import { ContractorsService } from 'app/main/system/installations/contractors/services/contractors.service';

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
        MatSelectModule,
        MatInputModule,
        MatToolbarModule,
        MatDatepickerModule,
        MatChipsModule,
        MatRippleModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        UiSwitchModule,
        NgxMatSelectSearchModule,
        QuicklinkModule,
        NgxChartsModule,
        NgbModule,
        NgSelectModule,
        BlockUIModule,
        FuseProgressBarModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        FuseConfirmDialogModule,
        FuseDirectivesModule,
        FusePipesModule,
    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }],
})
export class SharedModule { }