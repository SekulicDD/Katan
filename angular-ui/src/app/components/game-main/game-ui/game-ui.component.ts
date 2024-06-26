import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import {
  Application,
  BitmapText,
  Container,
  Graphics,
  Sprite,
  Texture,
} from 'pixi.js';
import { GameRenderService } from '../../../services/game-render.service';
import { Card } from '../../../types/cards.interface';

@Component({
  selector: 'app-game-ui',
  standalone: true,
  imports: [],
  templateUrl: './game-ui.component.html',
  styleUrl: './game-ui.component.scss',
})
export class GameUiComponent implements OnInit {
  app: Application = this.gameRenderService.getApp();
  uiContainer: Container = this.gameRenderService.getUiContainer();
  textures: Record<string, Texture> = this.gameRenderService.getTextures();
  bottomBarContainer: Container = new Container();
  bottomBarHeight = this.gameRenderService.getBottomBarHeight();

  @Input() div!: HTMLElement;

  constructor(private gameRenderService: GameRenderService) {}

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
    this.drawCards(this.cards);
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

  //make stack up to 4 cards with y+=3 opacity=0.4
  getCardSprite(
    name: string,
    x: number,
    y: number = 15,
    opacity: number = 1
  ): Sprite {
    const sprite = Sprite.from(this.textures[name + 'Card']);

    const aspectRatio = sprite.width / sprite.height;
    sprite.height = 70;
    sprite.width = sprite.height * aspectRatio;

    sprite.x = x;
    sprite.y = y;
    sprite.alpha = opacity;
    return sprite;
  }

  drawCardCountSprite(count: number, x: number, y: number) {
    const circle = new Graphics().circle(x, y, 14).fill('#1F2937');

    const countText = new BitmapText({
      text: count.toString(),
      style: {
        fontSize: 20,
        align: 'center',
      },
    });
    const textBounds = countText.getLocalBounds();
    countText.x = x - textBounds.width / 2;
    countText.y = y - textBounds.height / 2;

    this.bottomBarContainer.addChild(circle);
    this.bottomBarContainer.addChild(countText);
  }

  generateCardSpriteStack(name: string, stackSize: number, x: number = 50) {
    let sprites = [];

    let startY = 20;

    for (let i = 0; i < stackSize && i < 4; i++) {
      let opacity = 0.4;
      if (i == stackSize - 1 || i == 3) opacity = 1;
      sprites.push(this.getCardSprite(name, x, startY, opacity));
      startY -= 3;
    }
    return sprites;
  }

  drawCards(cards: Card[]) {
    let startX = 50;
    cards.forEach((card, index, arr) => {
      if (card.type == 'development' && arr[index - 1].type == 'resource')
        startX += 35;
      let sprites = this.generateCardSpriteStack(card.name, card.count, startX);
      while (sprites.length > 0) {
        const sprite = sprites.shift() as Sprite;
        this.bottomBarContainer.addChild(sprite);
      }
      this.drawCardCountSprite(card.count, startX, 20);
      startX += 70;
    });
  }

  drawTimer(time: number) {
    const timerText = new BitmapText({
      text: time.toFixed(1) + 's',
      style: {
        fontSize: 40,
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
