import { Injectable, Inject } from '@angular/core';
import { bindCallback, Observable } from 'rxjs';
// import {ADAL_CONFIG, AUTHENTICATION_CONTEXT} from './di_tokens';
import { map } from 'rxjs/operators';

declare var AuthenticationContext;

@Injectable({
  providedIn: 'root'
})
export class NgxAdalService {
  private context: typeof AuthenticationContext;

  constructor(@Inject('adalConfig') private adalConfig: any) {
    (adalConfig.redirectUri = `${window.location.origin}/${adalConfig.redirectUri}`),
      (adalConfig.postLogoutRedirectUri = `${window.location.origin}/${adalConfig.postLogoutRedirectUri}`),
      (this.context = new AuthenticationContext(adalConfig));
    this.handleCallback();
  }

  // constructor(
  //   @Inject(ADAL_CONFIG) private adalConfig: any, @Inject(AUTHENTICATION_CONTEXT) private context: typeof AuthenticationContext) {
  //   this.handleCallback();
  // }

  public get LoggedInUserEmail() {
    if (this.isAuthenticated) {
      return this.context.getCachedUser().userName;
    }
    return '';
  }

  public get LoggedInUserName() {
    if (this.isAuthenticated) {
      return this.context.getCachedUser().profile.name;
    }
    return '';
  }

  public login() {
    this.context.login();
  }

  public logout() {
    this.context.logOut();
  }

  public GetResourceForEndpoint(url: string): string {
    return this.context.getResourceForEndpoint(url);
    // let resource = null;
    // if (url) {
    //   resource = this.context.getResourceForEndpoint(url);
    //   if (!resource) {
    //     resource = this.adalConfig.clientId;
    //   }
    // }
    // return resource;
  }

  public RenewToken(url: string): Observable<string> {
    const resource = this.GetResourceForEndpoint(url);
    return this.context.clearCacheForResource(resource); // Trigger the ADAL token renew
  }

  public acquireToken(url: string) {
    const _this = this; // save outer this for inner function
    let errorMessage: string;

    return bindCallback(acquireTokenInternal)().pipe(
      map((token: string) => {
        if (!token && errorMessage) {
          throw errorMessage;
        }
        return token;
      })
    );

    function acquireTokenInternal(cb: (token: string) => string) {
      let s: string = null;
      let resource: string;
      resource = _this.GetResourceForEndpoint(url);

      _this.context.acquireToken(resource, (error: string, tokenOut: string) => {
        if (error) {
          _this.context.error('Error when acquiring token for resource: ' + resource, error);
          errorMessage = error;
          cb(null as string);
        } else {
          cb(tokenOut);
          s = tokenOut;
        }
      });

      return s;
    }
  }

  public getToken(url: string): string {
    const resource = this.context.getResourceForEndpoint(url);
    const storage = this.adalConfig.cacheLocation; // ?
    let key;
    if (resource) {
      key = 'adal.access.token.key' + resource;
    } else {
      key = 'adal.idtoken';
    }
    if (storage === 'localStorage') {
      return localStorage.getItem(key);
    } else {
      return sessionStorage.getItem(key);
    }
  }

  handleCallback() {
    this.context.handleWindowCallback();
  }

  public get userInfo() {
    return this.context.getCachedUser();
  }

  public get accessToken() {
    return this.context.getCachedToken(this.adalConfig.clientId);
  }

  public get isAuthenticated(): boolean {
    return this.userInfo && this.accessToken ? true : false;
  }
}
