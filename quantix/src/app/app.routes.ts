import { Routes } from '@angular/router';
import { AuthComponent }       from './pages/auth/auth.component';
import { CalculatorComponent } from './pages/calculator/calculator.component';
import { HistoryComponent }    from './pages/history/history.component';
import { ProfileComponent }    from './pages/profile/profile.component';
import { AdminComponent }      from './pages/admin/admin.component';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '',           redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth',       component: AuthComponent },
  { path: 'calculator', component: CalculatorComponent },
  { path: 'history',    component: HistoryComponent,  canActivate: [authGuard] },
  { path: 'profile',    component: ProfileComponent,  canActivate: [authGuard] },
  { path: 'admin',      component: AdminComponent,    canActivate: [authGuard, adminGuard] },
  { path: '**',         redirectTo: 'auth' },
];