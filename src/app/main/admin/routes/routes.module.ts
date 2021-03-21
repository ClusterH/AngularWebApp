import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AgmDirectionModule, AgmDirection } from 'agm-direction';
import { DialogModule } from 'primeng/dialog';

import { CourseDialogComponent } from 'app/main/admin/routes/dialog/dialog.component';
import { RoutesComponent } from 'app/main/admin/routes/routes/routes.component';
import { RouteDetailComponent } from 'app/main/admin/routes/route_detail/route_detail.component';
import { StopsFileDragDropComponent } from './components/drag-drop/drag-drop.component';
import { RoutesService } from 'app/main/admin/routes/services/routes.service';
import { RouteDetailService } from 'app/main/admin/routes/services/route_detail.service';
import { AgmDirectionGeneratorService } from 'app/sharedModules/services';
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
            apiKey: 'AIzaSyDO1lOoJtxmSRni0mkXGGrqmcn3TqLP8t4',
            libraries: ['places', 'drawing', 'geometry'],
        }),
        AgmDirectionModule,
        DialogModule,
        SharedModule
    ],
    declarations: [
        RoutesComponent,
        RouteDetailComponent,
        CourseDialogComponent,
        StopsFileDragDropComponent
    ],
    providers: [RoutesService, RouteDetailService, AgmDirection, AgmDirectionGeneratorService]
})
export class RoutesModule { }