import { TestBed } from '@angular/core/testing';

import { FirebaseCheckService } from './firebase-check.service';

describe('FirebaseCheckService', () => {
  let service: FirebaseCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
