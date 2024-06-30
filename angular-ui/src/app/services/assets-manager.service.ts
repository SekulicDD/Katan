import { Injectable } from '@angular/core';
import { Assets, Texture } from 'pixi.js';

@Injectable({
  providedIn: 'root',
})
export class AssetsManagerService {
  constructor() {}

  private textures: Record<string, Texture> = {};

  async loadAssets(): Promise<any> {
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

  getTexture(alias: string): Texture {
    return this.textures[alias];
  }

  getAllTextures(): Record<string, Texture> {
    return this.textures;
  }
}
