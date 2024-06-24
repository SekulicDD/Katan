import { ElementRef, HostListener, Injectable } from '@angular/core';
import {
  Application,
  Assets,
  Container,
  Graphics,
  Sprite,
  Texture,
} from 'pixi.js';

@Injectable({
  providedIn: 'root',
})
export class GameRenderService {
  private app: Application = new Application();
  private boardContainer: Container = new Container();
  private textures: Record<string, Texture> = {};
  private div!: HTMLElement;

  private isDragging: boolean = false;
  private bg!: Graphics;

  previousX: number = 0;
  previousY: number = 0;

  private scale = 1;
  private zoomSpeed = 0.07;

  constructor() {}

  getApp(): Application {
    return this.app;
  }

  getBoardContainer(): Container {
    return this.boardContainer;
  }

  getTextures(): Record<string, Texture> {
    return this.textures;
  }

  async init(div: HTMLElement): Promise<void> {
    await this.app.init({
      background: 'grey',
      resizeTo: div,
      resolution: window.devicePixelRatio,
      autoDensity: true,
    });
    div.appendChild(this.app.canvas);
    this.createPanableBg();
    this.app.stage.addChild(this.bg);

    this.app.stage.addChild(this.boardContainer);

    await this.loadAssets();

    this.div = div;

    this.onResize();
  }

  private createPanableBg() {
    this.bg = new Graphics();
    this.bg.rect(0, 0, this.app.renderer.width, this.app.renderer.height);
    this.bg.fill('#1F2937');
    this.bg.interactive = true;
    this.bg.on('pointerdown', this.onDragStart.bind(this));
    this.bg.on('pointermove', this.onDragMove.bind(this));
    this.bg.on('pointerup', this.onDragEnd.bind(this));
    this.bg.on('pointerupoutside', this.onDragEnd.bind(this));
  }

  private async loadAssets(): Promise<any> {
    Assets.add({ alias: 'woodTexture', src: 'images/wood-texture1.png' });

    Assets.add({ alias: 'brickField', src: 'images/brick-field.png' });
    Assets.add({ alias: 'desertField', src: 'images/desert-field.png' });
    Assets.add({ alias: 'forestField', src: 'images/forest-field.png' });
    Assets.add({ alias: 'rockField', src: 'images/rock-field.png' });
    Assets.add({ alias: 'sheepField', src: 'images/sheep-field.png' });
    Assets.add({ alias: 'wheatField', src: 'images/wheat-field.png' });

    Assets.add({ alias: 'brickCard', src: 'images/brick-card.jpg' });
    Assets.add({ alias: 'woodCard', src: 'images/wood-card.jpg' });
    Assets.add({ alias: 'oreCard', src: 'images/ore-card.jpg' });
    Assets.add({ alias: 'sheepCard', src: 'images/sheep-card.jpg' });
    Assets.add({ alias: 'wheatCard', src: 'images/wheat-card.jpg' });
    this.textures = await Assets.load([
      'brickField',
      'desertField',
      'forestField',
      'rockField',
      'sheepField',
      'wheatField',
      'woodTexture',
      'brickCard',
      'woodCard',
      'oreCard',
      'sheepCard',
      'wheatCard',
    ]);
  }

  centerBoardContainer() {
    this.boardContainer.x = this.app.screen.width / 5;
    this.boardContainer.y = this.app.screen.height / 4;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    if (this.div) {
      this.app.renderer.resize(this.div.clientWidth, this.div.clientHeight);
      this.centerBoardContainer();
    }
  }

  @HostListener('wheel', ['$event'])
  onZoom(event: WheelEvent) {
    const delta = event.deltaY || 0;
    const zoom = delta > 0 ? 1 - this.zoomSpeed : 1 + this.zoomSpeed;

    const oldScale = this.scale;
    this.scale *= zoom;
    this.scale = Math.max(1, Math.min(this.scale, 1.35));

    this.boardContainer.scale.set(this.scale);

    const mouseOffsetX = (event.x - this.boardContainer.x) / oldScale;
    const mouseOffsetY = (event.y - this.boardContainer.y) / oldScale;

    this.boardContainer.scale.set(this.scale);
    this.boardContainer.x -= mouseOffsetX * (this.scale - oldScale);
    this.boardContainer.y -= mouseOffsetY * (this.scale - oldScale);
    this.repositionBoard();
  }

  onDragStart = (event: any) => {
    this.isDragging = true;
    let current = event.data.global;
    this.previousX = current.x;
    this.previousY = current.y;
  };

  onDragEnd = () => {
    this.isDragging = false;
  };

  onDragMove = (event: any) => {
    if (this.isDragging) {
      const { x, y } = event.data.global;
      this.moveBoard(x - this.previousX, y - this.previousY);
      this.previousX = x;
      this.previousY = y;
    }
  };

  private moveBoard(deltaX: number, deltaY: number) {
    const { newX, newY } = this.calculateNewPosition(deltaX, deltaY);
    this.boardContainer.x = newX;
    this.boardContainer.y = newY;
  }

  private calculateNewPosition(deltaX: number, deltaY: number) {
    const newX = this.clamp(
      this.boardContainer.x + deltaX,
      0,
      this.div.clientWidth - this.boardContainer.width - 40
    );
    const newY = this.clamp(
      this.boardContainer.y + deltaY,
      this.boardContainer.height / 4,
      this.div.clientHeight + 40 - this.boardContainer.height
    );

    return { newX, newY };
  }

  private repositionBoard() {
    const { newX, newY } = this.calculateNewPosition(0, 0);

    this.boardContainer.x = newX;
    this.boardContainer.y = newY;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}
