import { Component, Input, OnInit } from '@angular/core';
import {
  Application,
  BitmapText,
  Color,
  Container,
  Graphics,
  Sprite,
  Text,
  Texture,
} from 'pixi.js';
import { GameRenderService } from '../../../services/game-render.service';
import { AssetsManagerService } from '../../../services/assets-manager.service';

@Component({
  selector: 'app-ui-player-info',
  standalone: true,
  imports: [],
  templateUrl: './ui-player-info.component.html',
  styleUrl: './ui-player-info.component.scss',
})
export class UiPlayerInfoComponent implements OnInit {
  app: Application = this.gameRenderService.getApp();
  uiContainer: Container = this.gameRenderService.getUiContainer();
  playerInfoContainer: Container = new Container();
  div: HTMLElement = this.gameRenderService.getDiv();

  height: number = 80 * 2 + 15;
  width: number = 580;

  constructor(
    private gameRenderService: GameRenderService,
    private assetService: AssetsManagerService
  ) {}

  ngOnInit(): void {
    this.initComponent();
  }

  private initComponent() {
    this.playerInfoContainer.y =
      this.div.clientHeight -
      this.gameRenderService.getBottomBarHeight() -
      this.height -
      25;

    this.playerInfoContainer.x = this.div.clientWidth - this.width - 25;
    this.uiContainer.addChild(this.playerInfoContainer);
    this.drawPlayers();
  }

  private drawPlayers() {
    let playerSettings = {
      playerIndex: 0,
      color: new Color('red'),
      name: 'DonexX',
    };

    const width = 78;
    const height = 82;

    this.drawPlayerInfo(playerSettings, 0, 0, width, height);
    playerSettings.playerIndex = 1;
    playerSettings.color = new Color('#1070FF');
    playerSettings.name = 'Wraith';
    this.drawPlayerInfo(playerSettings, width * 3.65 + 25, 0, width, height);
    playerSettings.playerIndex = 2;
    playerSettings.color = new Color('#299E00');
    playerSettings.name = 'Seselj';
    this.drawPlayerInfo(playerSettings, 0, width + 15, width, height);
    playerSettings.playerIndex = 3;
    playerSettings.color = new Color('#AD00FF');
    playerSettings.name = 'SpaceBrown';
    this.drawPlayerInfo(
      playerSettings,
      width * 3.65 + 25,
      width + 15,
      width,
      height
    );
  }

  private drawPlayerIcon(
    x: number,
    y: number,
    player: playerSettings,
    width: number,
    height: number
  ) {
    const iconContainer = new Graphics()
      .rect(x, y, width, height)
      .fill('black');
    iconContainer.alpha = 0.3;

    const avatar = Sprite.from(this.assetService.getTexture('avatar'));
    const avatarSize = width - 50;

    avatar.width = avatarSize;
    avatar.height = avatarSize;
    avatar.tint = player.color;
    avatar.anchor.set(0.5);
    avatar.position.set(x + width / 2, y + height / 2 - 10);

    const text = this.createText(x, y, width, 20, '3');
    const textBounds = text.getLocalBounds();
    text.position.set(x + width / 2 - textBounds.width / 2, y + height / 2 + 8);
    this.playerInfoContainer.addChild(iconContainer, avatar, text);
  }

  private drawPlayerName(
    x: number,
    y: number,
    player: playerSettings,
    width: number,
    height: number
  ) {
    const iconContainer = new Graphics()
      .rect(x, y, width, height)
      .fill('black');
    iconContainer.alpha = 0.3;

    const text = this.createText(x, y - height * 1.2, width, 18, player.name);

    this.playerInfoContainer.addChild(iconContainer, text);
  }

  private drawPlayerInfo(
    playerSettings: playerSettings,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.drawPlayerIcon(x, y, playerSettings, width, height);

    const secondWindowX = x + width + 5;

    this.drawPlayerName(secondWindowX, y, playerSettings, 188, height);

    const iconSize = 22;
    let iconX = secondWindowX + 20;

    this.drawIcon('card-ico', iconX, y, iconSize, playerSettings.color, 3);
    iconX += 40;
    this.drawIcon('dev-card-ico', iconX, y, iconSize, playerSettings.color, 2);
    iconX += 40;
    this.drawIcon('knight-ico', iconX, y, iconSize, playerSettings.color, 1);
    iconX += 40;
    this.drawIcon('road-ico', iconX, y, iconSize, playerSettings.color, 6);
  }

  private drawIcon(
    iconName: string,
    x: number,
    y: number,
    size: number,
    color: Color,
    value: number
  ) {
    const sprite = Sprite.from(this.assetService.getTexture(iconName));
    sprite.width = size;
    sprite.height = size;
    sprite.tint = color;
    sprite.x = x;
    sprite.y = y + size * 1.4;

    const text = this.createText(x, y + size * 1.6, size, 18, value.toString());

    this.playerInfoContainer.addChild(sprite, text);
  }

  private createText(
    x: number,
    y: number,
    size: number,
    fontSize: number,
    value: string
  ): BitmapText {
    const text = new BitmapText({
      text: value,
      style: {
        fontSize: fontSize,
        align: 'center',
      },
    });
    const textBounds = text.getLocalBounds();
    text.position.set(x + size / 2 - textBounds.width / 2, y + size / 2 + 8);
    return text;
  }
}

interface playerSettings {
  playerIndex: number;
  color: Color;
  name: string;
}
