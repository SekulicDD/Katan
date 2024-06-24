import { ElementRef, HostListener, Injectable } from '@angular/core';
import {
  Application,
  Assets,
  Container,
  Graphics,
  Sprite,
  Texture,
} from 'pixi.js';
import { BoardRenderService } from './board-render.service';

@Injectable({
  providedIn: 'root',
})
export class GameRenderService {
  private app: Application = new Application();
  private uiContainer: Container = new Container();
  private textures: Record<string, Texture> = {};
  private boardService!: BoardRenderService;
  private bg!: Graphics;

  constructor() {
    this.boardService = new BoardRenderService(this.app);
  }

  getApp(): Application {
    return this.app;
  }

  getBoardContainer(): Container {
    return this.boardService.getBoardContainer();
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

    this.boardService.init(div);
    this.app.stage.addChild(this.uiContainer);

    await this.loadAssets();

    this.onResize();
  }

  private createPanableBg() {
    this.bg = new Graphics();
    this.bg.rect(0, 0, this.app.renderer.width, this.app.renderer.height);
    this.bg.fill('#1F2937');
    this.bg.interactive = true;
    this.bg.on(
      'pointerdown',
      this.boardService.onDragStart.bind(this.boardService)
    );
    this.bg.on(
      'pointermove',
      this.boardService.onDragMove.bind(this.boardService)
    );
    this.bg.on(
      'pointerup',
      this.boardService.onDragEnd.bind(this.boardService)
    );
    this.bg.on(
      'pointerupoutside',
      this.boardService.onDragEnd.bind(this.boardService)
    );
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

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.boardService.onResize();
  }

  @HostListener('wheel', ['$event'])
  onZoom(event: WheelEvent) {
    this.boardService.onZoom(event);
  }
}
