import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { ContentModule } from 'app/core/layout/components/content/content.module';
// import { FooterModule } from 'app/layout/components/footer/footer.module';
import { NavbarModule } from 'app/core/layout/components/navbar/navbar.module';
import { QuickPanelModule } from 'app/core/layout/components/quick-panel/quick-panel.module';
import { ToolbarModule } from 'app/core/layout/components/toolbar/toolbar.module';

import { VerticalLayout2Component } from 'app/core/layout/vertical/layout-2/layout-2.component';

@NgModule({
    declarations: [
        VerticalLayout2Component
    ],
    imports: [
        RouterModule,

        FuseSharedModule,
        FuseSidebarModule,

        ContentModule,
        // FooterModule,
        NavbarModule,
        QuickPanelModule,
        ToolbarModule
    ],
    exports: [
        VerticalLayout2Component
    ]
})
export class VerticalLayout2Module {
}
