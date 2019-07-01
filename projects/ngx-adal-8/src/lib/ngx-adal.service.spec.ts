import {TestBed} from '@angular/core/testing';

import {NgxAdalService} from './ngx-adal.service';
import {ADAL_CONFIG, AUTHENTICATION_CONTEXT} from './di_tokens';
import * as AuthenticationContext from 'adal-angular';
import {Observer} from 'rxjs';

describe('NgxAdalService', () => {
  let service: NgxAdalService;
  let context: jasmine.SpyObj<AuthenticationContext>;

  const clientId = 'fake-clientId';
  const config = {clientId, cacheLocation: null};

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide:
        ADAL_CONFIG, useValue: config
      },
      {
        provide:
        AUTHENTICATION_CONTEXT, useValue: jasmine.createSpyObj(['error', 'acquireToken', 'handleWindowCallback', 'login', 'logOut', 'getCachedUser', 'getCachedToken', 'getResourceForEndpoint', 'clearCacheForResource'])
      }
    ]
  }));

  beforeEach(() => {
    service = TestBed.get(NgxAdalService);
    context = TestBed.get(AUTHENTICATION_CONTEXT);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call handleWindowCallBack', () => {
    expect(context.handleWindowCallback).toHaveBeenCalledTimes(1);
  });

  describe('LoggedInUserEmail', () => {
    describe('when authenticated', () => {
      beforeEach(() => {
        context.getCachedToken.and.returnValue('fake-token');
        context.getCachedUser.and.returnValue({userName: 'fake-user', profile: {name: 'Fake Username'}});
      });

      it('should return the userName from the cachedUser in the context', () => {
        expect(service.LoggedInUserEmail).toEqual('fake-user');
      });
    });

    describe('when not authenticated', () => {
      beforeEach(() => {
        context.getCachedToken.and.returnValue(undefined);
        context.getCachedUser.and.returnValue(undefined);
      });

      it('should return empty string', () => {
        expect(service.LoggedInUserEmail).toEqual('');
      });
    });
  });

  describe('LoggedInUserName', () => {
    describe('when authenticated', () => {
      beforeEach(() => {
        context.getCachedToken.and.returnValue('fake-token');
        context.getCachedUser.and.returnValue({userName: 'fake-user', profile: {name: 'Fake Username'}});
      });

      it('should return the userName from the cachedUser in the context', () => {
        expect(service.LoggedInUserName).toEqual('Fake Username');
      });
    });

    describe('when not authenticated', () => {
      beforeEach(() => {
        context.getCachedToken.and.returnValue(undefined);
        context.getCachedUser.and.returnValue(undefined);
      });

      it('should return empty string', () => {
        expect(service.LoggedInUserName).toEqual('');
      });
    });
  });

  describe('login', () => {
    it('should call login on the context', () => {
      service.login();

      expect(context.login).toHaveBeenCalledTimes(1);
    });
  });

  describe('logout', () => {
    it('should call logout on the context', () => {
      service.logout();

      expect(context.logOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('GetResourceForEndpoint', () => {
    it('should return null when called with empty string', () => {
      expect(service.GetResourceForEndpoint('')).toBeNull();
    });

    describe('when called with non-empty string', () => {
      it('should get the resource from the context ', () => {
        service.GetResourceForEndpoint('fake-url');
        expect(context.getResourceForEndpoint).toHaveBeenCalledWith('fake-url');
      });

      it('should return the clientId from adalConfig when the response from context is falsy', () => {
        context.getResourceForEndpoint.and.returnValue(undefined);
        expect(service.GetResourceForEndpoint('fake-url')).toEqual(clientId);
      });

      it('should return the result when the response from context is truthy', () => {
        context.getResourceForEndpoint.and.returnValue('fake-resource');
        expect(service.GetResourceForEndpoint('fake-url')).toEqual('fake-resource');
      });
    });
  });

  describe('RenewToken', () => {
    it('should get the resource and clear the cache on context', () => {
      spyOn(service, 'GetResourceForEndpoint').and.returnValue('fake-resource');

      const result = service.RenewToken('fake-url');
      expect(service.GetResourceForEndpoint).toHaveBeenCalledWith('fake-url');
      expect(context.clearCacheForResource).toHaveBeenCalledWith('fake-resource');
    });
  });

  describe('acquireToken', () => {
    const observer = jasmine.createSpyObj<Observer<string>>(['next', 'error', 'complete']);

    describe('when an error occurs', () => {
      beforeEach(() => {
        context.acquireToken.and.callFake((resource, cb) => {
          cb('fake error', undefined, undefined);
        });

        spyOn(service, 'GetResourceForEndpoint').and.returnValue('fake-resource');

        service.acquireToken('fake-url').subscribe(observer);
      });

      it('should emit the error', () => {
        expect(observer.error).toHaveBeenCalledWith('fake error');
      });

      it('should call .error() on the context', () => {
        expect(context.error).toHaveBeenCalledWith('Error when acquiring token for resource: fake-resource', 'fake error');
      });
    });

    describe('when no error occurs', () => {
      beforeEach(() => {
        context.acquireToken.and.callFake((resource, cb) => {
          cb(null, 'fake-token', undefined);
        });

        service.acquireToken('fake-url').subscribe(observer);
      });

      it('should emit the token', () => {
        expect(observer.next).toHaveBeenCalledWith('fake-token');
      });
    });
  });

  describe('getToken', () => {
    beforeEach(() => {
      spyOn((window as any).localStorage, 'getItem');
      spyOn((window as any).sessionStorage, 'getItem');
    });

    describe('when a resource exists for the url', () => {
      beforeEach(() => {
        context.getResourceForEndpoint.and.returnValue('fake-resource')
      });

      it('calls the sessionStorage.getItem with a key based on the resource', () => {
        service.getToken('some-url');

        expect((window as any).sessionStorage.getItem).toHaveBeenCalledWith('adal.access.token.keyfake-resource');
      });
    });

    describe('when no resource exists for the url', () => {
      beforeEach(() => {
        context.getResourceForEndpoint.and.returnValue(null);
      });

      it('calls sessionStorage.getItem with adal.idtoken', () => {
        service.getToken('some-url');

        expect((window as any).sessionStorage.getItem).toHaveBeenCalledWith('adal.idtoken');
      });
    });

    describe('when storage method is set to localStorage in adalConfig', () => {
        beforeEach(() => {
            context.getResourceForEndpoint.and.returnValue(null);
            config.cacheLocation.and.returnValue('localStorage');
        });


        // this test is disabled because I could not figure out how to change the cacheLocation on config
        xit('calls localStorage.getItem', () => {
          service.getToken('some-url');

          expect((window as any).localStorage.getItem).toHaveBeenCalledWith('adal.idtoken');
        });
    });
  });
});
