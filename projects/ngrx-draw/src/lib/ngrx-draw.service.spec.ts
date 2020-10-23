import { TestBed } from '@angular/core/testing';

import { NgrxDrawService } from './ngrx-draw.service';

describe('NgrxDrawService', () => {
  let service: NgrxDrawService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgrxDrawService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
