import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from "@angular/material/dialog";
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { RouterModule } from '@angular/router';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';

import { TranslateModule } from '@ngx-translate/core';
import { JobsComponent } from 'app/main/system/installations/jobs/jobs/jobs.component';
import { DeleteDialogComponent } from 'app/main/system/installations/jobs/deletedialog/deletedialog.component';
import { JobDialogComponent } from 'app/main/system/installations/jobs/dialog/dialog.component';
import { JobCardDialogComponent } from 'app/main/system/installations/jobs/jobs/board/dialogs/job/dialog.component';
import { InstallationBoardAddListComponent } from 'app/main/system/installations/jobs/jobs/board/add-list/add-list.component';
import { InstallationBoardComponent } from 'app/main/system/installations/jobs/jobs/board/board.component';
import { InstallationLabelSelectorComponent } from 'app/main/system/installations/jobs/jobs/board/dialogs/card/label-selector/label-selector.component';
import { InstallationEditBoardNameComponent } from 'app/main/system/installations/jobs/jobs/board/edit-board-name/edit-board-name.component';
import { InstallationBoardAddCardComponent } from 'app/main/system/installations/jobs/jobs/board/list/add-card/add-card.component';
import { InstallationBoardCardComponent } from 'app/main/system/installations/jobs/jobs/board/list/card/card.component';
import { InstallationBoardEditListNameComponent } from 'app/main/system/installations/jobs/jobs/board/list/edit-list-name/edit-list-name.component';
import { InstallationBoardListComponent } from 'app/main/system/installations/jobs/jobs/board/list/list.component';

import { JobsService, InstallationService, InstallationBoardResolve } from './services'
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'jobs', component: JobsComponent, resolve: { installation: InstallationService } },
    { path: 'jobs/:boardId/:boardUri', component: InstallationBoardComponent, resolve: { board: InstallationBoardResolve } },
    { path: '**', redirectTo: 'jobs' }
];

@NgModule({
    imports: [
        MatDialogModule,
        NgxDnDModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDO1lOoJtxmSRni0mkXGGrqmcn3TqLP8t4',
            libraries: ['places', 'drawing', 'geometry'],
        }),
        TranslateModule,
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        JobsComponent,
        JobDialogComponent,
        JobCardDialogComponent,
        DeleteDialogComponent,
        InstallationBoardComponent,
        InstallationBoardListComponent,
        InstallationBoardCardComponent,
        InstallationBoardEditListNameComponent,
        InstallationBoardAddCardComponent,
        InstallationBoardAddListComponent,
        // InstallationCardDialogComponent,
        InstallationLabelSelectorComponent,
        InstallationEditBoardNameComponent,
    ],
    providers: [JobsService, InstallationService, InstallationBoardResolve, GoogleMapsAPIWrapper]
})
export class JobsModule { }