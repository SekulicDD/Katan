import { Injectable } from '@angular/core';
import { BitmapText, Container, Graphics, Sprite } from 'pixi.js';
import { Card } from '../types/cards.interface';
import { AssetsManagerService } from './assets-manager.service';

@Injectable({
  providedIn: 'root',
})
export class CardRenderService {
  constructor(private assetService: AssetsManagerService) {}

  private aspectRatio: number = 0.714;

  private drawCardCountSprite(
    count: number,
    x: number,
    y: number,
    container: Container
  ) {
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

    container.addChild(circle);
    container.addChild(countText);
    return countText;
  }

  getCardSprite(
    name: string,
    x: number,
    y: number = 15,
    opacity: number = 1
  ): Sprite {
    const sprite = Sprite.from(this.assetService.getTexture(name + 'Card'));
    sprite.height = 60;
    sprite.width = sprite.height * this.aspectRatio;
    sprite.x = x;
    sprite.y = y;
    sprite.alpha = opacity;
    return sprite;
  }

  private generateCardSpriteStack(
    name: string,
    stackSize: number,
    x: number = 50,
    y: number
  ) {
    let sprites = [];
    let startY = y;
    for (let i = 0; i < stackSize && i < 4; i++) {
      let opacity = 0.4;
      if (i == stackSize - 1 || i == 3) opacity = 1;
      sprites.push(this.getCardSprite(name, x, startY, opacity));
      startY -= 3;
    }
    return sprites;
  }

  drawCardStacks(
    cards: Card[],
    startX: number,
    startY: number,
    container: Container
  ): [Sprite, BitmapText] {
    let x = startX;
    let counter: any;
    let sprite;

    cards.forEach((card, index, arr) => {
      if (card.type == 'development' && arr[index - 1].type == 'resource')
        x += 35;
      let sprites = this.generateCardSpriteStack(
        card.name,
        card.count,
        x,
        startY
      );
      while (sprites.length > 0) {
        sprite = sprites.shift() as Sprite;
        container.addChild(sprite);
      }
      counter = this.drawCardCountSprite(card.count, x, startY, container);
      x += 70;
    });
    return [sprite!, counter];
  }

  drawOneCard(
    name: string,
    x: number,
    y: number = 15,
    container: Container
  ): Sprite {
    const sprite = Sprite.from(this.assetService.getTexture(name + 'Card'));
    sprite.height = 60;
    sprite.width = sprite.height * this.aspectRatio;
    sprite.x = x;
    sprite.y = y;

    container.addChild(sprite);
    return sprite;
  }

  drawEmptyCards(
    x: number,
    y: number,
    height: number,
    count: number,
    container: Container
  ): any[] {
    let res = [];
    const width = height * this.aspectRatio;
    let startX = x;
    for (let i = 0; i < count; i++) {
      const rect = new Graphics().rect(0, 0, width, height).fill('#292E38');
      rect.x = startX;
      rect.y = y;

      container.addChild(rect);
      res.push(rect);
      startX += 25 + width;
    }

    return res;
  }
}
