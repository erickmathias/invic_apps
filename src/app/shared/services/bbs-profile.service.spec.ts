import { TestBed } from '@angular/core/testing';

import { BbsProfileService } from './bbs-profile.service';

describe('BbsProfileService', () => {
  let service: BbsProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BbsProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
