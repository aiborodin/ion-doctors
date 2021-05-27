import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminDashboardPage } from './admin-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardPage,
    children: [
      {
        path: 'users',
        children: [
          {
            path: '',
            loadChildren: () => import('../users/users.module').then(m => m.UsersPageModule)
          }
        ]
      },
      {
        path: 'doctors',
        children: [
          {
            path: '',
            loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminDashboardPageRoutingModule {}
