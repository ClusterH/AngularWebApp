import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CourseDialogComponent } from 'app/main/admin/routes/dialog/dialog.component';
import { RoutesComponent } from 'app/main/admin/routes/routes/routes.component';
import { RouteDetailComponent } from 'app/main/admin/routes/route_detail/route_detail.component';
import { RoutesService } from 'app/main/admin/routes/services/routes.service';
import { RouteDetailService } from 'app/main/admin/routes/services/route_detail.service';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'routes', component: RoutesComponent },
    { path: 'route_detail', component: RouteDetailComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAP_Xy-1QSclKYAvxSmAZO2BuFAWWAlOZQ',
            libraries: ['places', 'drawing', 'geometry'],
        }),
        SharedModule
    ],
    declarations: [
        RoutesComponent,
        RouteDetailComponent,
        CourseDialogComponent,
    ],
    providers: [RoutesService, RouteDetailService]
})
export class RoutesModule { }