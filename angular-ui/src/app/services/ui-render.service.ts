import { Injectable, inject } from '@angular/core';
import { Application, Container, Graphics, Sprite, Texture } from 'pixi.js';
import { AssetsManagerService } from './assets-manager.service';

@Injectable({
  providedIn: 'root',
})
export class UiRenderService {
  uiContainer: Container = new Container();
  div!: HTMLElement;
  bottomBarHeight = 90;

  constructor(private app: Application) {}

  getUiContainer(): Container {
    return this.uiContainer;
  }

  getBottomBarHeight(): number {
    return this.bottomBarHeight;
  }

  init(div: HTMLElement) {
    this.div = div;
    this.app.stage.addChild(this.uiContainer);
  }
}
