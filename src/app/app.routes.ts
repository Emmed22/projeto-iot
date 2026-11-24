import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'lcd',
    loadComponent: () => import('./lcd/lcd.page').then((m) => m.LcdPage),
  },
  {
    path: 'connection',
    loadComponent: () => import('./connection/connection.page').then((m) => m.ConnectionPage),
  },
];
