import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

import { Application } from 'pixi.js';
import { GameBoardComponent } from './game-board/game-board.component';
import { CommonModule } from '@angular/common';

import { GameRenderService } from '../../services/game-render.service';
import { GameUiComponent } from './game-ui/game-ui.component';

@Component({
  selector: 'app-game-main',
  standalone: true,
  imports: [GameBoardComponent, CommonModule, GameUiComponent],
  templateUrl: './game-main.component.html',
  styleUrl: './game-main.component.scss',
})
export class GameMainComponent {
  app!: Application;
  isLoaded: boolean = false;

  @ViewChild('gameContainer', { static: true }) gameContainer?: ElementRef;

  constructor(private gameRenderService: GameRenderService) {}

  ngOnInit(): void {
    this.gameRenderService.init(this.gameContainer?.nativeElement).then(() => {
      this.app = this.gameRenderService.getApp();
      this.isLoaded = true;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.gameRenderService.onResize(event);
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    this.gameRenderService.onZoom(event);
  }
}
