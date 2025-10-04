import { TestBed } from '@angular/core/testing';

import { Terapias } from './terapias';

describe('Terapias', () => {
  let service: Terapias;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Terapias);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
