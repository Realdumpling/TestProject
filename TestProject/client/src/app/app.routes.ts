import { Routes } from '@angular/router';
import { LoginPage } from './login-page/login-page';
import { AuthLayout } from './shared/layouts/auth-layout/auth-layout';
import { SiteLayout } from './shared/layouts/site-layout/site-layout';
import { RegisterPage } from './register-page/register-page';
import { AuthGuard } from './shared/classes/auth.guard';
import { OverviewPage } from './overview-page/overview-page';
import { AnalyticsPage } from './analytics-page/analytics-page';
import { HistoryPage } from './history-page/history-page';
import { OrderPage } from './order-page/order-page';
import { CategoriesPage } from './categories-page/categories-page';
import { CategoriesForm } from './categories-page/categories-form/categories-form';
import { OrderCategories } from './order-page/order-categories/order-categories';
import { OrderPositions } from './order-page/order-positions/order-positions';

export const routes: Routes = [
  {
    path: '', component: AuthLayout, children: [
      { path: '', redirectTo: '/login', pathMatch: 'full'},
      { path: 'login', component: LoginPage },
      { path: 'register', component: RegisterPage }
    ]
  },
  {
    path: '', component: SiteLayout, canActivate: [AuthGuard], children: [
      { path: 'overview', component: OverviewPage },
      { path: 'analytics', component: AnalyticsPage },
      { path: 'history', component: HistoryPage },
      { path: 'order', component: OrderPage, children: [{ path: '', component: OrderCategories }, { path: ':id', component: OrderPositions }] },
      { path: 'categories', component: CategoriesPage },
      { path: 'categories/new', component: CategoriesForm },
      { path: 'categories/:id', component: CategoriesForm }
    ]
  }
];
