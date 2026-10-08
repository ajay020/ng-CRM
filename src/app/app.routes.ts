import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Leads } from './pages/leads/leads';
import { Customers } from './pages/customers/customers';
import { Deals } from './pages/deals/deals';
import { Tasks } from './pages/tasks/tasks';
import { LeadDetails } from './pages/leads/lead-details/lead-details';
import { CustomerDetails } from './pages/customers/customer-details/customer-details';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard],
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'leads',
        component: Leads,
      },
      {
        path: 'leads/:id',
        component: LeadDetails,
      },
      {
        path: 'customers',
        component: Customers,
      },
      {
        path: 'customers/:id',
        component: CustomerDetails,
      },
      {
        path: 'deals',
        component: Deals,
      },
      {
        path: 'tasks',
        component: Tasks,
      },
    ],
  },
];
