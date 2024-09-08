import { TestBed } from '@angular/core/testing';

import { NativeServiceService } from './native-service.service';

describe('NativeServiceService', () => {
  let service: NativeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NativeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
