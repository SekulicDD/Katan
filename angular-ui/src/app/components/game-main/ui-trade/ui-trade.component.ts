import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Application, BitmapText, Container, Graphics, Sprite } from 'pixi.js';
import { GameRenderService } from '../../../services/game-render.service';
import { AssetsManagerService } from '../../../services/assets-manager.service';
import { CardRenderService } from '../../../services/card-render.service';
import { Card } from '../../../types/cards.interface';

@Component({
  selector: 'app-ui-trade',
  standalone: true,
  imports: [],
  templateUrl: './ui-trade.component.html',
  styleUrl: './ui-trade.component.scss',
})
export class UiTradeComponent implements OnInit {
  app: Application = this.gameRenderService.getApp();
  uiContainer: Container = this.gameRenderService.getUiContainer();
  div: HTMLElement = this.gameRenderService.getDiv();
  tradeContainer1: Container = new Container();
  tradeContainer2: Container = new Container();

  givePositions: any[] = [];
  wantPositions: any[] = [];

  giveCounters: Map<string, BitmapText> = new Map<string, BitmapText>();
  wantCounters: Map<string, BitmapText> = new Map<string, BitmapText>();

  cardsToGive: Map<string, Card> = new Map<string, Card>();
  cardsWant: Map<string, Card> = new Map<string, Card>();

  private gap = 25;
  private smallGap = 10;

  private width2 = this.gap * 6 + 60 + 60 * 0.71 * 5;
  private height2 = 60 * 2 + this.gap * 3;

  private height1 = 60 + this.smallGap * 3;

  constructor(
    private gameRenderService: GameRenderService,
    private assetService: AssetsManagerService,
    private cardRenderService: CardRenderService
  ) {}

  ngOnInit(): void {
    this.initComponent();
  }

  private initComponent() {
    this.positionContainers();

    const size = 60;
    this.drawBgs(size);

    this.drawArrows();
    this.drawAllCards();

    this.wantPositions = this.cardRenderService.drawEmptyCards(
      size + this.gap,
      this.gap,
      size,
      5,
      this.tradeContainer2
    );

    this.givePositions = this.cardRenderService.drawEmptyCards(
      size + this.gap,
      size + this.gap * 2,
      size,
      5,
      this.tradeContainer2
    );

    this.uiContainer.addChild(this.tradeContainer1);
    this.uiContainer.addChild(this.tradeContainer2);
  }

  private positionContainers() {
    this.tradeContainer2.x = this.gap;
    this.tradeContainer2.y =
      this.div.clientHeight -
      this.gameRenderService.getBottomBarHeight() -
      this.height2 -
      this.gap;

    this.tradeContainer1.x = this.gap;
    this.tradeContainer1.y =
      this.div.clientHeight -
      this.gameRenderService.getBottomBarHeight() -
      this.height2 -
      this.gap -
      this.height1;
  }

  private drawBgs(size: number) {
    const rect = new Graphics()
      .rect(0, 0, this.width2, this.height2)
      .fill('black');
    rect.alpha = 0.3;
    this.tradeContainer2.addChild(rect);

    const rect1 = new Graphics()
      .rect(0, 0, 5 * size * 0.71 + this.gap * 6, this.height1 - this.smallGap)
      .fill('black');
    rect1.alpha = 0.3;
    this.tradeContainer1.addChild(rect1);
  }

  drawArrows() {
    const arrowUp = Sprite.from(this.assetService.getTexture('arrow-up'));
    const arrowDown = Sprite.from(this.assetService.getTexture('arrow-down'));
    const size = 45;

    arrowUp.x = this.gap;
    arrowUp.tint = '#990000';
    arrowUp.y = this.height2 - size - this.gap;
    arrowUp.height = size;
    arrowUp.width = size;

    arrowDown.x = this.gap;
    arrowDown.y = this.gap;
    arrowDown.tint = '#3DA100';
    arrowDown.height = size;
    arrowDown.width = size;

    this.tradeContainer2.addChild(arrowDown, arrowUp);
  }

  private drawAllCards() {
    const cards = ['wood', 'brick', 'sheep', 'wheat', 'ore'];
    let startX = this.gap;

    for (let i = 0; i < cards.length; i++) {
      let card = this.cardRenderService.drawOneCard(
        cards[i],
        startX,
        this.smallGap,
        this.tradeContainer1
      );
      card.cursor = 'pointer';
      card.interactive = true;
      card.onpointerdown = () => this.onWantCardClick(cards[i]);
      startX += this.gap + 60 * 0.71;
    }
  }

  onCardOwnedClick(cardName: string) {
    let card: Card = {
      name: cardName,
      type: 'resource',
      count: 1,
    };

    if (!this.cardsToGive.has(card.name)) {
      this.addCardToGive(card);
    } else this.updateGiveCounter(card);
  }

  private addCardToGive(card: Card) {
    const counter = this.cardRenderService.drawCardStacks(
      [card],
      this.givePositions[this.cardsToGive.size].x,
      this.givePositions[this.cardsToGive.size].y,
      this.tradeContainer2
    )[1];
    this.cardsToGive.set(card.name, card);
    this.giveCounters.set(card.name, counter);
  }

  private updateGiveCounter(card: Card) {
    card = this.cardsToGive.get(card.name)!;
    card.count++;
    this.cardsToGive.set(card.name, card);
    let counter = this.giveCounters.get(card.name)!;
    counter.text = card.count.toString();
  }

  private onWantCardClick(cardName: string) {
    let card: Card = {
      name: cardName,
      type: 'resource',
      count: 1,
    };

    if (!this.cardsWant.has(card.name)) {
      this.addCardToWant(card);
    } else this.upWantCounter(card);
  }

  private addCardToWant(card: Card) {
    const [sprite, counter] = this.cardRenderService.drawCardStacks(
      [card],
      this.wantPositions[this.cardsWant.size].x,
      this.wantPositions[this.cardsWant.size].y,
      this.tradeContainer2
    );
    sprite.interactive = true;
    sprite.cursor = 'pointer';
    sprite.onpointerdown = () => this.downWantCounter(card.name, sprite);
    this.cardsWant.set(card.name, card);
    this.wantCounters.set(card.name, counter);
  }

  private upWantCounter(card: Card) {
    card = this.cardsWant.get(card.name)!;
    card.count++;
    this.cardsWant.set(card.name, card);
    let counter = this.wantCounters.get(card.name)!;
    counter.text = card.count.toString();
  }

  private downWantCounter(cardName: string, sprite: Sprite) {
    let card = this.cardsWant.get(cardName)!;
    card.count--;
    if (card.count == 0) {
      this.cardsWant.delete(card.name);
      let counter = this.wantCounters.get(card.name)!;
      this.tradeContainer2.removeChild(counter);
      this.wantCounters.delete(card.name);
      this.tradeContainer2.removeChild(sprite);
    } else {
      this.cardsWant.set(card.name, card);
      let counter = this.wantCounters.get(card.name)!;
      counter.text = card.count.toString();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.tradeContainer1.removeChildren();
    this.tradeContainer2.removeChildren();
    this.initComponent();
  }
}
