import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [

      {
        path: 'dashboard',
        loadChildren: () => import('../pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'account',
        loadChildren: () => import('../pages/account/account.module').then(m => m.AccountPageModule)
      },
      {
        path: 'deposit',
        loadChildren: () => import('../pages/deposit/deposit.module').then(m => m.DepositPageModule)
      },
      {
        path: 'withdraw',
        loadChildren: () => import('../pages/withdraw/withdraw.module').then(m => m.WithdrawPageModule)
      },
      {
        path: 'gift',
        loadChildren: () => import('../pages/gift/gift.module').then(m => m.GiftPageModule)
      },

    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
