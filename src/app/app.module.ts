import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxAdalModule } from 'ngx-adal-8';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxAdalModule.forRoot({
      tenant: `7cd77541-b916-4e50-905b-905acbd528dc`,
      clientId: `c0622ca0-df1f-4dd2-8175-9dfa840e1dee`,

      endpoints: {
        'https://localhost:44344/api/values': '4cee322a-42cc-44f2-9540-9d7fd69b0659'
      },
      anonymousEndpoints: ['https://localhost:44344/api/values/get1'],
      redirectUri: `frameRedirect.html`,
      postLogoutRedirectUri: `frameRedirect.html`,
      cacheLocation: 'localStorage'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
