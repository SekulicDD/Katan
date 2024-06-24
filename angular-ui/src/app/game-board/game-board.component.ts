import { Component, OnInit } from '@angular/core';
import { GameRenderService } from '../services/game-render.service';
import {
  Application,
  Color,
  Container,
  Graphics,
  Rectangle,
  Sprite,
} from 'pixi.js';

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

  constructor(private gameRenderService: GameRenderService) {}

  ngOnInit(): void {
    this.boardContainer.x = this.app.screen.width / 3;
    this.boardContainer.y = this.app.screen.height / 4;
    this.drawCatanBoard(144, 144);
  }

  private drawCatanBoard(width: number, height: number) {
    const hexWidth = width * 0.87;
    const hexHeight = height;

    const board = [
      [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    ];
    const startX = -((board.length - 1) * hexWidth * 0.5);
    const startY = 0;

    for (let i = 0; i < board.length; i++) {
      // Calculate initial x position for the row
      let rowStartX = startX + (i % 2) * hexWidth * 0.5;
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
        woodSprite.y = startY + i * (hexHeight * 0.75);
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
