import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpConfigInterceptor } from './interceptors/https.interceptor';

import { FuseModule } from '@fuse/fuse.module';
import { fuseConfig } from './fuse-config';
import { LayoutModule } from './layout/layout.module';

@NgModule({
  imports: [
    // angular
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    BrowserAnimationsModule,
    LayoutModule,
    FuseModule.forRoot(fuseConfig),
  ],
  declarations: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
  ],
  exports: [
    // angular
    FormsModule,
    LayoutModule,

  ]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
