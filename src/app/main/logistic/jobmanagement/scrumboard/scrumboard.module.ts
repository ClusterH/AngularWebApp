import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { ScrumboardBoardAddListComponent } from 'app/main/logistic/jobmanagement/scrumboard/board/add-list/add-list.component';
import { ScrumboardBoardComponent } from 'app/main/logistic/jobmanagement/scrumboard/board/board.component';
import { ScrumboardCardDialogComponent } from 'app/main/logistic/jobmanagement/scrumboard/board/dialogs/card/card.component';
import { ScrumboardLabelSelectorComponent } from 'app/main/logistic/jobmanagement/scrumboard/board/dialogs/card/label-selector/label-selector.component';
import { ScrumboardEditBoardNameComponent } from 'app/main/logistic/jobmanagement/scrumboard/board/edit-board-name/edit-board-name.component';
import { ScrumboardBoardAddCardComponent } from 'app/main/logistic/jobmanagement/scrumboard/board/list/add-card/add-card.component';
import { ScrumboardBoardCardComponent } from 'app/main/logistic/jobmanagement/scrumboard/board/list/card/card.component';
import { ScrumboardBoardEditListNameComponent } from 'app/main/logistic/jobmanagement/scrumboard/board/list/edit-list-name/edit-list-name.component';
import { ScrumboardBoardListComponent } from 'app/main/logistic/jobmanagement/scrumboard/board/list/list.component';
import { ScrumboardBoardColorSelectorComponent } from 'app/main/logistic/jobmanagement/scrumboard/board/sidenavs/settings/board-color-selector/board-color-selector.component';
import { ScrumboardBoardSettingsSidenavComponent } from 'app/main/logistic/jobmanagement/scrumboard/board/sidenavs/settings/settings.component';
import { ScrumboardComponent } from 'app/main/logistic/jobmanagement/scrumboard/scrumboard.component';
import { BoardResolve, ScrumboardService } from 'app/main/logistic/jobmanagement/scrumboard/scrumboard.service';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes: Routes = [
    { path: 'boards', component: ScrumboardComponent, resolve: { scrumboard: ScrumboardService } },
    { path: 'boards/:boardId/:boardUri', component: ScrumboardBoardComponent, resolve: { board: BoardResolve } },
    { path: '**', redirectTo: 'boards' }
];

@NgModule({
    declarations: [
        ScrumboardComponent,
        ScrumboardBoardComponent,
        ScrumboardBoardListComponent,
        ScrumboardBoardCardComponent,
        ScrumboardBoardEditListNameComponent,
        ScrumboardBoardAddCardComponent,
        ScrumboardBoardAddListComponent,
        ScrumboardCardDialogComponent,
        ScrumboardLabelSelectorComponent,
        ScrumboardEditBoardNameComponent,
        ScrumboardBoardSettingsSidenavComponent,
        ScrumboardBoardColorSelectorComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatDialogModule,
        NgxDnDModule,
        TranslateModule,
        SharedModule
    ],
    providers: [
        ScrumboardService,
        BoardResolve
    ],
    entryComponents: [ScrumboardCardDialogComponent]
})
export class ScrumboardModule { }