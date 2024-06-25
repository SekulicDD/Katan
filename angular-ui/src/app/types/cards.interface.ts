export type CardType = 'resource' | 'development';
export interface Card {
  name: string;
  count: number;
  type: CardType;
}

export interface ResourceCards {
  brick: number;
  wood: number;
  sheep: number;
  wheat: number;
  ore: number;
}

export interface DevelopmentCards {
  knight: number;
  monopoly: number;
  roadBuilding: number;
  yearOfPlenty: number;
  victoryPoint: number;
}
