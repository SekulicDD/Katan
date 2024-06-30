import { HostListener, Injectable } from '@angular/core';
import { Application, Container, Graphics } from 'pixi.js';
import { BoardRenderService } from './board-render.service';
import { UiRenderService } from './ui-render.service';

@Injectable({
  providedIn: 'root',
})
export class GameRenderService {
  private app: Application = new Application();
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

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.boardRenderService.onResize();
  }

  @HostListener('wheel', ['$event'])
  onZoom(event: WheelEvent) {
    this.boardRenderService.onZoom(event);
  }
}
