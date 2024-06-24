import { Injectable } from '@angular/core';
import { Application, Container } from 'pixi.js';

@Injectable({
  providedIn: 'root',
})
export class BoardRenderService {
  private boardContainer: Container = new Container();
  private div!: HTMLElement;
  private scale = 1;
  private zoomSpeed = 0.07;
  private isDragging: boolean = false;
  private previousX: number = 0;
  private previousY: number = 0;

  constructor(private app: Application) {}

  init(div: HTMLElement) {
    this.div = div;
    this.centerBoardContainer();
    this.app.stage.addChild(this.boardContainer);
  }

  getBoardContainer(): Container {
    return this.boardContainer;
  }

  centerBoardContainer() {
    this.boardContainer.x = this.app.screen.width / 5;
    this.boardContainer.y = this.app.screen.height / 4;
  }

  onResize() {
    if (this.div) {
      this.app.renderer.resize(this.div.clientWidth, this.div.clientHeight);
      this.centerBoardContainer();
    }
  }

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
