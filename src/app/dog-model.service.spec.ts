import { TestBed } from '@angular/core/testing';

import { DogModelService } from './dog-model.service';

describe('DogModelService', () => {
  let service: DogModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DogModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
