import { Component, HostListener, OnInit } from '@angular/core';
import { Application, BitmapText, Container, Graphics, Sprite } from 'pixi.js';
import { GameRenderService } from '../../../services/game-render.service';
import { Card } from '../../../types/cards.interface';
import { CardRenderService } from '../../../services/card-render.service';

@Component({
  selector: 'app-ui-bottom-bar',
  standalone: true,
  imports: [],
  templateUrl: './ui-bottom-bar.component.html',
  styleUrl: './ui-bottom-bar.component.scss',
})
export class UiBottomBarComponent implements OnInit {
  app: Application = this.gameRenderService.getApp();
  uiContainer: Container = this.gameRenderService.getUiContainer();
  bottomBarContainer: Container = new Container();
  bottomBarHeight = this.gameRenderService.getBottomBarHeight();

  div: HTMLElement = this.gameRenderService.getDiv();

  constructor(
    private gameRenderService: GameRenderService,
    private cardRenderService: CardRenderService
  ) {}

  cards: Card[] = [
    {
      name: 'wheat',
      count: 4,
      type: 'resource',
    },
    {
      name: 'ore',
      count: 10,
      type: 'resource',
    },
    {
      name: 'wood',
      count: 3,
      type: 'resource',
    },
    {
      name: 'brick',
      count: 1,
      type: 'resource',
    },
    {
      name: 'sheep',
      count: 2,
      type: 'resource',
    },
    {
      name: 'wheat',
      count: 2,
      type: 'development',
    },
    {
      name: 'ore',
      count: 1,
      type: 'development',
    },
    {
      name: 'sheep',
      count: 3,
      type: 'development',
    },
  ];
  ngOnInit(): void {
    this.initComponent();
  }

  private initComponent() {
    this.drawBottomBar();
    this.cardRenderService.drawCardStacks(
      this.cards,
      35,
      20,
      this.bottomBarContainer
    );
    this.drawTimer(24.0);
  }

  drawBottomBar() {
    this.bottomBarContainer.x = 0;
    this.bottomBarContainer.y = this.div.clientHeight - this.bottomBarHeight;

    const bar = new Graphics()
      .rect(0, 0, this.div.clientWidth, this.bottomBarHeight)
      .fill('black');
    bar.alpha = 0.3;
    this.bottomBarContainer.addChild(bar);
    this.uiContainer.addChild(this.bottomBarContainer);
  }

  drawTimer(time: number) {
    const timerText = new BitmapText({
      text: time.toFixed(1) + 's',
      style: {
        fontSize: 30,
        align: 'center',
      },
    });
    const textBounds = timerText.getLocalBounds();
    timerText.x = this.bottomBarContainer.width / 2 - textBounds.width / 2;
    timerText.y = this.bottomBarContainer.height / 2 - textBounds.height / 2;
    this.bottomBarContainer.addChild(timerText);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.bottomBarContainer.removeChildren();
    this.initComponent();
  }
}
