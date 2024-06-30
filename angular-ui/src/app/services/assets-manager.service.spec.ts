import { TestBed } from '@angular/core/testing';

import { AssetsManagerService } from './assets-manager.service';

describe('AssetsManagerService', () => {
  let service: AssetsManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetsManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
