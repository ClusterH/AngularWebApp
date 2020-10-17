import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { TodoService } from 'app/main/logistic/jobmanagement/todo/todo.service';
import { TodoComponent } from 'app/main/logistic/jobmanagement/todo/todo.component';
import { TodoMainSidebarComponent } from 'app/main/logistic/jobmanagement/todo/sidebars/main/main-sidebar.component';
import { TodoListItemComponent } from 'app/main/logistic/jobmanagement/todo/todo-list/todo-list-item/todo-list-item.component';
import { TodoListComponent } from 'app/main/logistic/jobmanagement/todo/todo-list/todo-list.component';
import { TodoDetailsComponent } from 'app/main/logistic/jobmanagement/todo/todo-details/todo-details.component';
import { SharedModule } from 'app/sharedModules/shared.module';

const routes: Routes = [
    {
        path: 'all',
        component: TodoComponent,
        resolve: {
            todo: TodoService
        }
    },
    {
        path: 'all/:todoId',
        component: TodoComponent,
        resolve: {
            todo: TodoService
        }
    },
    {
        path: 'tag/:tagHandle',
        component: TodoComponent,
        resolve: {
            todo: TodoService
        }
    },
    {
        path: 'tag/:tagHandle/:todoId',
        component: TodoComponent,
        resolve: {
            todo: TodoService
        }
    },
    {
        path: 'filter/:filterHandle',
        component: TodoComponent,
        resolve: {
            todo: TodoService
        }
    },
    {
        path: 'filter/:filterHandle/:todoId',
        component: TodoComponent,
        resolve: {
            todo: TodoService
        }
    },
    {
        path: '**',
        redirectTo: 'all'
    }
];

@NgModule({
    declarations: [
        TodoComponent,
        TodoMainSidebarComponent,
        TodoListItemComponent,
        TodoListComponent,
        TodoDetailsComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatMenuModule,
        NgxDnDModule,
        SharedModule
    ],
    providers: [TodoService]
})
export class TodoModule { }