import {Inject, InjectionToken} from '@angular/core';

declare var AuthenticationContext;

export const AUTHENTICATION_CONTEXT = new InjectionToken('AUTHENTICATION_CONTEXT');
export const ADAL_CONFIG = new InjectionToken('ADAL_CONFIG');

export function authContextFactory(@Inject(ADAL_CONFIG) adalConfig: any) {
    adalConfig.redirectUri =`${window.location.origin}/${adalConfig.redirectUri}`;
    adalConfig.postLogoutRedirectUri =`${window.location.origin}/${adalConfig.postLogoutRedirectUri}`;

    return new AuthenticationContext(adalConfig);
}
