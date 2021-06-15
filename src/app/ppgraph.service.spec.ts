import { TestBed } from '@angular/core/testing';

import { PpgraphService } from './ppgraph.service';

describe('PpgraphService', () => {
  let service: PpgraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PpgraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
