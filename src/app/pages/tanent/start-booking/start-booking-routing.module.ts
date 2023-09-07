import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartBookingPage } from './start-booking.page';

const routes: Routes = [
  {
    path: '',
    component: StartBookingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartBookingPageRoutingModule {}
