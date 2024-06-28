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

  hexSize = this.gameRenderService.getHexagonSize();
  bottomBarHeight = this.gameRenderService.getBottomBarHeight();

  constructor(private gameRenderService: GameRenderService) {}

  ngOnInit(): void {
    this.drawBoard(this.hexSize, this.hexSize);
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

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const cell = board[i][j];

        if (cell == 0) continue;

        let xHex = j * hexWidth;
        let yHex = i * (hexHeight * 0.75);
        if (i % 2 == 1) xHex += hexWidth * 0.5;

        // const woodSprite = this.createWoodSprite(width, height);
        // woodSprite.x = xHex + hexWidth / 2;
        // woodSprite.y = yHex + hexHeight / 2;
        // this.boardContainer.addChild(woodSprite);

        const hex = this.createHexagon(width, xHex, yHex);
        this.boardContainer.addChild(hex);
        //woodSprite.mask = hex;

        //hexagon image
        const woodGap = 14;
        const fieldSprite = this.createFieldImage(
          hexWidth - woodGap,
          hexHeight - woodGap,
          xHex + woodGap / 2,
          yHex + woodGap / 2
        );
        this.boardContainer.addChild(fieldSprite);
      }
    }

    const bounds = this.boardContainer.getLocalBounds();

    this.boardContainer.pivot.set(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2
    );

    this.boardContainer.position.set(
      this.div.clientWidth / 2,
      (this.div.clientHeight - this.bottomBarHeight) / 2
    );
  }

  private createWoodSprite(width: number, height: number): Sprite {
    const sprite = Sprite.from(this.textures['woodTexture']);
    sprite.width = width;
    sprite.height = height;
    sprite.anchor = 0.5;
    sprite.rotation = Math.PI / (Math.random() * 3);
    return sprite;
  }

  private generateHexagonVertices(radius: number) {
    const vertices = [];
    for (let i = 0; i < 6; i++) {
      const angle = ((2 * Math.PI) / 6) * i + Math.PI / 6;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      vertices.push({ x: x, y: y });
    }
    return vertices;
  }

  private createHexagon(size: number, x: number, y: number) {
    const hexagonMask = new Graphics();
    const sideLen = size / 2;
    const vert = this.generateHexagonVertices(sideLen);
    hexagonMask.poly(vert).fill('grey');
    hexagonMask.stroke(1); //fixes gaps
    hexagonMask.x = x + hexagonMask.width / 2;
    hexagonMask.y = y + hexagonMask.height / 2;

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

    return sprite;
  }
}
