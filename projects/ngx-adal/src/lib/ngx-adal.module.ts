import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { NgxAdalService } from './ngx-adal.service';
import { NgxAdalInterceptor } from './ngx-adal.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxAdalGuard } from './ngx-adal.guard';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    NgxAdalGuard,
    NgxAdalService,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: NgxAdalInterceptor,
        multi: true
    }
]
})
export class NgxAdalModule { 

  constructor(@Optional() @SkipSelf() parentModule: NgxAdalModule) {
    // https://angular.io/styleguide#!#04-12
    if (parentModule) {
        throw new Error(
            'NgxAdalModule is already loaded. Import it in the AppModule only');
    }
}


static forRoot(adalConfig: any): ModuleWithProviders {
  return {
      ngModule: NgxAdalModule,
      providers: [
          [NgxAdalService, { provide: 'adalConfig', useValue: adalConfig }]
      ]
  };
}


}



// https://www.npmjs.com/package/microsoft-adal-angular6

// import { NgModule } from '@angular/core';
// import { ModuleWithProviders } from '@angular/core';
// import { Optional, SkipSelf } from '@angular/core';
// import { AuthenticationService } from './authentication.service';
// import { AuthenticationGuard, NgxAdalGuard } from './ngx-adal-guard';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
// import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { AuthenticationInterceptor } from './ngx-adal.interceptor';
// import { NgxAdalService } from './ngx-adal.service';


