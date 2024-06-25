import { Component, Input, OnInit } from '@angular/core';

import {
  Application,
  Color,
  Container,
  Graphics,
  Rectangle,
  Sprite,
} from 'pixi.js';
import { GameRenderService } from '../../../services/game-render.service';
import { BoardRenderService } from '../../../services/board-render.service';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
})
export class GameBoardComponent implements OnInit {
  app: Application = this.gameRenderService.getApp();
  boardContainer: Container = this.gameRenderService.getBoardContainer();
  textures = this.gameRenderService.getTextures();
  @Input() div!: HTMLElement;

  constructor(private gameRenderService: GameRenderService) {}

  ngOnInit(): void {
    this.drawBoard(144, 144);
  }

  private drawBoard(width: number, height: number) {
    const hexWidth = width * 0.87;
    const hexHeight = height;

    const board = [
      [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    ];

    const totalWidth = 5 * hexWidth;
    const totalHeight = 5 * hexHeight - (3 * hexHeight) / 4;

    this.boardContainer.x = this.div.clientWidth / 2;
    this.boardContainer.y = this.div.clientHeight / 2;
    this.boardContainer.pivot.x = totalWidth / 2;
    this.boardContainer.pivot.y = totalHeight / 2;

    const startX = -totalWidth / 2;

    for (let i = 0; i < board.length; i++) {
      // Calculate initial x position for the row
      let rowStartX = startX;
      if (i % 2 == 1) rowStartX += hexWidth * 0.5;
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 0) {
          continue;
        }

        //wood sprite
        const woodSprite = this.createHexSprite(
          hexWidth * 1.3,
          hexHeight * 1.3
        );
        woodSprite.x = rowStartX + j * hexWidth;
        woodSprite.y = i * (hexHeight * 0.75);

        woodSprite.rotation = (Math.PI / Math.random()) * 3;
        this.boardContainer.addChild(woodSprite);

        //hexagon mask
        const mask = this.createHexagonMask(width, woodSprite.x, woodSprite.y);
        woodSprite.mask = mask;
        this.boardContainer.addChild(mask);

        //hexagon image
        const fieldSprite = this.createFieldImage(
          hexWidth - 14,
          hexHeight - 14,
          woodSprite.x,
          woodSprite.y
        );
        this.boardContainer.addChild(fieldSprite);
      }
    }
  }

  private createHexSprite(width: number, height: number): Sprite {
    const sprite = Sprite.from(this.textures['woodTexture']);
    sprite.width = width;
    sprite.height = height;
    sprite.anchor.set(0.5);
    return sprite;
  }

  private generateHexagonVertices(radius: number) {
    const vertices = [];
    for (let i = 0; i < 6; i++) {
      const angle = ((2 * Math.PI) / 6) * i;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      vertices.push({ x: x, y: y });
    }
    return vertices;
  }

  private createHexagonMask(size: number, x: number, y: number) {
    const hexagonMask = new Graphics();
    const sideLen = size / 2;
    const vert = this.generateHexagonVertices(sideLen);
    hexagonMask.poly(vert).fill('red');
    hexagonMask.stroke(1); //fixes gaps
    hexagonMask.x = x;
    hexagonMask.y = y;
    hexagonMask.pivot.x = 0.5;
    hexagonMask.pivot.y = 0.5;
    hexagonMask.rotation = Math.PI / 6;
    return hexagonMask;
  }

  private createFieldImage(
    width: number,
    height: number,
    x: number,
    y: number
  ) {
    const fields = [
      'rockField',
      'forestField',
      'brickField',
      'desertField',
      'sheepField',
      'wheatField',
    ];
    const sprite = Sprite.from(
      this.textures[fields[Math.floor(Math.random() * fields.length)]]
    );
    sprite.width = width;
    sprite.height = height;
    sprite.x = x;
    sprite.y = y;
    sprite.anchor.set(0.5);
    return sprite;
  }
}
