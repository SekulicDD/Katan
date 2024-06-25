import { Component } from '@angular/core';
import { GameMainComponent } from '../game-main/game-main.component';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [GameMainComponent],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss',
})
export class LobbyComponent {}
