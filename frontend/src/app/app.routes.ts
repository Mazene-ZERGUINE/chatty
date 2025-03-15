import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./core/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'community',
    loadComponent: () =>
      import('./features/community/community.component').then(
        (m) => m.CommunityComponent,
      ),
    canActivate: [AuthGuard],
  },
];
