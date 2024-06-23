import { TestBed } from '@angular/core/testing';

import { GameRenderService } from './game-render.service';

describe('GameRenderService', () => {
  let service: GameRenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameRenderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
