import { TestBed } from '@angular/core/testing';

import { BoardRenderService } from './board-render.service';

describe('BoardRenderService', () => {
  let service: BoardRenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardRenderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
