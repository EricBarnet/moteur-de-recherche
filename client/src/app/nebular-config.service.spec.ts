import { TestBed } from '@angular/core/testing';

import { NebularConfigService } from './nebular-config.service';

describe('NebularConfigService', () => {
  let service: NebularConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NebularConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
