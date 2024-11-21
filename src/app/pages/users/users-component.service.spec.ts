import { TestBed } from '@angular/core/testing';

import { UsersComponentService } from './users-component.service';

describe('UsersComponentService', () => {
  let service: UsersComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
