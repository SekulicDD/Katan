import { TestBed } from '@angular/core/testing';

import { UiRenderService } from './ui-render.service';

describe('UiRenderService', () => {
  let service: UiRenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiRenderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
