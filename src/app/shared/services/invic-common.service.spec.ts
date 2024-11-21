import { TestBed } from '@angular/core/testing';

import { InvicCommonService } from './invic-common.service';

describe('InvicCommonService', () => {
  let service: InvicCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvicCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
