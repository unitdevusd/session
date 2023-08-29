import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../../unitTabs/tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../../unitTabs/tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../../unitTabs/tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../../unitTabs/profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'my-spaces',
        loadChildren: () => import('../../unitTabs/my-spaces/my-spaces.module').then( m => m.MySpacesPageModule)
      },
      {
        path: 'tab4',
        loadChildren: () => import('../../unitTabs/tab4/tab4.module').then( m => m.Tab4PageModule)
      },
      // {
      //   path: 'admin-dash',
      //   loadChildren: () => import('../../unitTabs/admin-dash/admin-dash.module').then( m => m.AdminDashPageModule)
      // },
      {
        path: 'settings',
        loadChildren: () => import('../../unitTabs/settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: '',
        redirectTo: '/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
