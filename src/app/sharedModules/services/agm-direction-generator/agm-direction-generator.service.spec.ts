import { TestBed } from '@angular/core/testing';

import { AgmDirectionGeneratorService } from './agm-direction-generator.service';

describe('AgmDirectionGeneratorService', () => {
  let service: AgmDirectionGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgmDirectionGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
