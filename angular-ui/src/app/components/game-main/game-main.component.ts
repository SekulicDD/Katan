import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

import { Application } from 'pixi.js';
import { GameBoardComponent } from './game-board/game-board.component';
import { CommonModule } from '@angular/common';

import { GameRenderService } from '../../services/game-render.service';
import { UiBottomBarComponent } from './ui-bottom-bar/ui-bottom-bar.component';
import { UiPlayerInfoComponent } from './ui-player-info/ui-player-info.component';
import { UiTradeComponent } from './ui-trade/ui-trade.component';
import { AssetsManagerService } from '../../services/assets-manager.service';

@Component({
  selector: 'app-game-main',
  standalone: true,
  imports: [
    GameBoardComponent,
    CommonModule,
    UiBottomBarComponent,
    UiPlayerInfoComponent,
    UiTradeComponent,
  ],
  templateUrl: './game-main.component.html',
  styleUrl: './game-main.component.scss',
})
export class GameMainComponent {
  app!: Application;
  isLoaded: boolean = false;

  @ViewChild('gameContainer', { static: true }) gameContainer?: ElementRef;

  constructor(
    private gameRenderService: GameRenderService,
    private assetService: AssetsManagerService
  ) {}

  ngOnInit(): void {
    this.loadGame();
  }

  private async loadGame() {
    await this.gameRenderService.init(this.gameContainer?.nativeElement);
    this.app = this.gameRenderService.getApp();
    await this.assetService.loadAssets();
    this.isLoaded = true;
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
