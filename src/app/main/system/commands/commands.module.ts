import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from '@ngx-translate/core';
import { CommandsComponent } from 'app/main/system/commands/commands/commands.component';
import { CommandsService } from 'app/main/system/commands/services/commands.service';
import { CommandDetailComponent } from 'app/main/system/commands/command_detail/command_detail.component';
import { CommandDetailService } from 'app/main/system/commands/services/command_detail.service';
import { CourseDialogComponent } from 'app/main/system/commands/dialog/dialog.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes = [
    { path: 'commands', component: CommandsComponent },
    { path: 'command_detail', component: CommandDetailComponent },
];

@NgModule({
    imports: [
        MatDialogModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        CommandsComponent,
        CommandDetailComponent,
        CourseDialogComponent,
    ],
    providers: [
        CommandsService, CommandDetailService
    ]
})
export class CommandsModule { }