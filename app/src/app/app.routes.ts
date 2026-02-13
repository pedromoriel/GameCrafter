import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';
import { RootRedirectComponent } from './core/components/root-redirect.component';
import { UserRole } from './core/services/user.service';

export const routes: Routes = [
  {
    path: '',
    component: RootRedirectComponent
  },
  {
    path: 'auth',
    loadComponent: () => import('./modules/auth/auth.component').then(m => m.AuthComponent),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        canActivate: [publicGuard],
        loadComponent: () => import('./modules/auth/pages/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        canActivate: [publicGuard],
        loadComponent: () => import('./modules/auth/pages/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'select-plan',
    loadComponent: () => import('./modules/auth/pages/select-plan.component').then(m => m.SelectPlanComponent)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./modules/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'editor',
    canActivate: [authGuard],
    loadComponent: () => import('./modules/editor/editor.component').then(m => m.EditorComponent)
  },
  {
    path: 'learning',
    canActivate: [authGuard],
    loadComponent: () => import('./modules/learning/learning.component').then(m => m.LearningComponent),
    data: { role: UserRole.FREE }
  },
  {
    path: 'levels',
    redirectTo: 'learning',
    pathMatch: 'full'
  },
  {
    path: 'asset-store',
    canActivate: [authGuard],
    loadComponent: () => import('./modules/asset-store/asset-store.component').then(m => m.AssetStoreComponent),
    data: { role: UserRole.PREMIUM }
  },
  {
    path: 'community',
    canActivate: [authGuard],
    loadComponent: () => import('./modules/community/community.component').then(m => m.CommunityComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./modules/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./modules/forbidden/forbidden.component').then(m => m.ForbiddenComponent)
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

