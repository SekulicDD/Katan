import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LobbyComponent } from './lobby/lobby.component';
import { RoomComponent } from './room/room.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'lobby',
    component: LobbyComponent,
  },
  {
    path: 'room/:id',
    component: RoomComponent,
  },
];
