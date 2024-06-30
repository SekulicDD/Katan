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
import { UiRenderService } from './ui-render.service';

@Injectable({
  providedIn: 'root',
})
export class GameRenderService {
  private app: Application = new Application();
  private textures: Record<string, Texture> = {};
  private bg!: Graphics;

  private div!: HTMLElement;

  private boardRenderService!: BoardRenderService;
  private uiRenderService!: UiRenderService;

  constructor() {
    this.boardRenderService = new BoardRenderService(this.app);
    this.uiRenderService = new UiRenderService(this.app);
  }

  getApp(): Application {
    return this.app;
  }

  getBoardContainer(): Container {
    return this.boardRenderService.getBoardContainer();
  }

  getUiContainer(): Container {
    return this.uiRenderService.getUiContainer();
  }

  getTextures(): Record<string, Texture> {
    return this.textures;
  }

  getHexagonSize(): number {
    return this.boardRenderService.getHexagonSize();
  }

  getBottomBarHeight(): number {
    return this.uiRenderService.getBottomBarHeight();
  }

  getDiv(): HTMLElement {
    return this.div;
  }

  async init(div: HTMLElement): Promise<void> {
    this.div = div;
    await this.app.init({
      background: 'grey',
      resizeTo: div,
      resolution: window.devicePixelRatio,
      autoDensity: true,
    });
    div.appendChild(this.app.canvas);
    this.createPanableBg();
    this.app.stage.addChild(this.bg);

    this.boardRenderService.init(div, this.getBottomBarHeight());

    this.uiRenderService.init(div);

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
      this.boardRenderService.onDragStart.bind(this.boardRenderService)
    );
    this.bg.on(
      'pointermove',
      this.boardRenderService.onDragMove.bind(this.boardRenderService)
    );
    this.bg.on(
      'pointerup',
      this.boardRenderService.onDragEnd.bind(this.boardRenderService)
    );
    this.bg.on(
      'pointerupoutside',
      this.boardRenderService.onDragEnd.bind(this.boardRenderService)
    );
  }

  private async loadAssets(): Promise<any> {
    const assetList: { alias: string; src: string }[] = [
      { alias: 'woodTexture', src: 'images/wood-texture1.png' },
      { alias: 'brickField', src: 'images/brick-field.png' },
      { alias: 'desertField', src: 'images/desert-field.png' },
      { alias: 'forestField', src: 'images/forest-field.png' },
      { alias: 'rockField', src: 'images/rock-field.png' },
      { alias: 'sheepField', src: 'images/sheep-field.png' },
      { alias: 'wheatField', src: 'images/wheat-field.png' },

      { alias: 'brickCard', src: 'images/brick-card.jpg' },
      { alias: 'woodCard', src: 'images/wood-card.jpg' },
      { alias: 'oreCard', src: 'images/ore-card.jpg' },
      { alias: 'sheepCard', src: 'images/sheep-card.jpg' },
      { alias: 'wheatCard', src: 'images/wheat-card.jpg' },

      { alias: 'avatar', src: 'images/avatar.png' },
      { alias: 'trophy', src: 'images/trophy.png' },
      { alias: 'army', src: 'images/army.png' },
      { alias: 'longest-road', src: 'images/longest-road.png' },
      { alias: 'card-dev', src: 'images/card-dev.png' },
      { alias: 'card-resource', src: 'images/card-resource.png' },

      { alias: 'knight-ico', src: 'images/knight-ico.png' },
      { alias: 'card-ico', src: 'images/card-ico.png' },
      { alias: 'dev-card-ico', src: 'images/dev-card-ico.png' },
      { alias: 'road-ico', src: 'images/road-ico.png' },
    ];

    for (const asset of assetList) {
      Assets.add(asset);
    }

    this.textures = await Assets.load(assetList.map((asset) => asset.alias));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.boardRenderService.onResize();
  }

  @HostListener('wheel', ['$event'])
  onZoom(event: WheelEvent) {
    this.boardRenderService.onZoom(event);
  }
}
