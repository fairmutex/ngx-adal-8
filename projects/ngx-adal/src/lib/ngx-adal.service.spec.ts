import { TestBed } from '@angular/core/testing';

import { NgxAdalService } from './ngx-adal.service';

describe('NgxAdalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxAdalService = TestBed.get(NgxAdalService);
    expect(service).toBeTruthy();
  });
});
