import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectTypePage } from './select-type.page';

const routes: Routes = [
  {
    path: '',
    component: SelectTypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectTypePageRoutingModule {}
