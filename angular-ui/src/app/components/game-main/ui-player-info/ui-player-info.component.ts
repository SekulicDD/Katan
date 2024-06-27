import { Component, OnInit } from '@angular/core';
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
  textures: Record<string, Texture> = this.gameRenderService.getTextures();
  playerInfoContainer: Container = new Container();

  constructor(private gameRenderService: GameRenderService) {}

  ngOnInit(): void {
    this.initComponent();
  }

  private initComponent() {
    this.drawPlayers();
    this.uiContainer.addChild(this.playerInfoContainer);
  }

  private drawPlayers() {
    const rect = new Graphics().rect(25, 25, 320, 380).fill('black');
    rect.alpha = 0.3;

    this.playerInfoContainer.addChild(rect);

    let playerSettings = {
      playerIndex: 0,
      color: new Color('red'),
      name: 'DonexX',
      size: 45,
    };
    this.drawPlayerInfo(playerSettings);
    playerSettings.playerIndex = 1;
    playerSettings.color = new Color('blue');
    playerSettings.name = 'Wraith';
    this.drawPlayerInfo(playerSettings);
    playerSettings.playerIndex = 2;
    playerSettings.color = new Color('grey');
    playerSettings.name = 'Seselj';
    this.drawPlayerInfo(playerSettings);
    playerSettings.playerIndex = 3;
    playerSettings.color = new Color('green');
    playerSettings.name = 'SpaceBrown';
    this.drawPlayerInfo(playerSettings);
  }

  private drawPlayerIcon(x: number, y: number, size: number, color: Color) {
    const player = new Graphics().rect(x, y, size, size).fill(color);
    const avatar = Sprite.from(this.textures['avatar']);
    avatar.width = size;
    avatar.height = size;
    player.addChild(avatar);
    avatar.x = x;
    avatar.y = y;
    this.playerInfoContainer.addChild(player);
  }

  private drawIcon(
    x: number,
    y: number,
    size: number,
    postion: number,
    icon: string,
    count: number
  ) {
    const text = new BitmapText({
      text: count,
      style: {
        fontSize: 20,
        align: 'center',
      },
    });
    text.x = x + size * postion + text.width / 2 + 10;
    text.y = y - 5;
    this.playerInfoContainer.addChild(text);

    const iconSprite = Sprite.from(this.textures[icon]);
    iconSprite.width = size - 15;
    iconSprite.height = size - 15;
    iconSprite.x = x + size * postion + 5;
    iconSprite.y = y + iconSprite.height / 2 + 5;
    this.playerInfoContainer.addChild(iconSprite);
  }

  private drawPlayerInfo(playerSettings: playerSettings) {
    const x = 65;
    const y = 65 + playerSettings.playerIndex * 85;

    this.drawPlayerIcon(x - 10, y, playerSettings.size, playerSettings.color);
    this.drawIcon(x, y, playerSettings.size, 1, 'trophy', 1);
    this.drawIcon(x, y, playerSettings.size, 2, 'army', 4);
    this.drawIcon(x, y, playerSettings.size, 3, 'longest-road', 2);
    this.drawIcon(x, y, playerSettings.size, 4, 'card-dev', 5);
    this.drawIcon(x, y, playerSettings.size, 5, 'card-resource', 6);

    // const nameText = new Text({
    //   text: playerSettings.name,
    //   style: {
    //     fill: 'white',
    //     fontSize: '20px',
    //   },
    // });
    // nameText.x = 75 - (nameText.width - playerSettings.size) / 2;
    // nameText.y = 55 + playerSettings.playerIndex * 100 + playerSettings.size;
    // this.playerInfoContainer.addChild(nameText);
  }
}

interface playerSettings {
  playerIndex: number;
  color: Color;
  name: string;
  size: number;
}
