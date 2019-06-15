# Active Directory Authentication Library (ADAL) wrapper for (Angular X)

This library is a wrapper taking consideration different scenarios of how ADAL should be used with Angular 2+ without importing adal-angular in package.json

Registering Angular application with Azure can be found [here](http://wpblog.fairmutex.com/2019/06/15/registering-an-angular-app-with-azure/)   
Take note of Application (client) ID (6) and Directory (tenant) Id (7)

In your angular.json under build section add "src/frameRedirect.html" as shown below to make it servable without triggering angular routing.

```bash
            "assets": [
              "src/favicon.ico",
              "src/assets",
              "src/frameRedirect.html"
            ],
``` 
Create frameRedirect.html under src folder and inside frameRedirect.html

```html
<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title>Frame Redirect</title>
    <script src="https://secure.aadcdn.microsoftonline-p.com/lib/1.0.17/js/adal.min.js"></script>
</head>

<body>
    <script>
        var adalConfig = {
            clientId: "YOUR_CLIENT_ID (6)"
        };
        var authContext = new AuthenticationContext(adalConfig);
        authContext.handleWindowCallback();

        if (window === window.parent) { window.location.replace(location.origin + location.hash); }
    </script>
</body>

</html>
``` 

In index.html put

```html
<script src="https://secure.aadcdn.microsoftonline-p.com/lib/1.0.17/js/adal.min.js"></script>
``` 

In app.module.ts 

```bash
import { NgxAdalModule } from 'ngx-adal-8';
``` 

Imports section

```typescript
NgxAdalModule.forRoot({
      tenant: `YOUR_TENANT_ID (7)`,
      clientId: `YOUR_CLIENT_ID (6)`,
      redirectUri: `frameRedirect.html`, 
      postLogoutRedirectUri: `frameRedirect.html`, 
      cacheLocation: 'localStorage',
    }),
``` 

3 App scenerios


App that either you are logged in or will send you to login upon visit 

Without using guards

in your app.component.ts

```typescript
import {NgxAdalService} from 'ngx-adal-8';
``` 

```typescript
  constructor(private authService:NgxAdalService){
    if (!this.authService.isAuthenticated) {
      this.authService.login();
    }    
  }
``` 


Using guards


In app-routing.module.ts

```typescript

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', component: AppComponent, pathMatch:'full', canActivate: [NgxAdalGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

```

App that have public facing and some parts require login.
In some component perhaps navbar.component.ts login/logout buttons

```typescript
  login(){
    this.authService.login();
  }

  logout(){
    this.authService.logout();
  }
``` 

Then use guards on the specific children routes.


**Couldn't have done this without**
1. Help from with AngularJS back in 2016 [Tushar Grupta](https://github.com/tushargupta51)
2. [ms-adal-angular6](https://github.com/manishrasrani/ms-adal-angular6)

