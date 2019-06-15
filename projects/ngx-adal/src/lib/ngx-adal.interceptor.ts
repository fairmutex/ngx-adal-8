import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { NgxAdalService } from './ngx-adal.service';


@Injectable()
export class NgxAdalInterceptor implements HttpInterceptor {

    constructor(private adal: NgxAdalService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // retrieve resource from endpoints configuration
        const resource = this.adal.GetResourceForEndpoint(request.url);
        if (!resource) {
            return next.handle(request);
        }
        if (!this.adal.isAuthenticated) {
            this.adal.RenewToken(request.url);
        }

        return this.adal.acquireToken(request.url)
            .pipe(
                mergeMap((token: string) => {
                    const authorizedRequest = request.clone({
                        setHeaders: {
                            'Authorization': 'Bearer ' + token,
                            'content-Type': 'application/json; charset=utf-8',
                            'Accept': 'application/json',
                        }
                    });
                    return next.handle(authorizedRequest);
                }
                )
            );
    }
}
