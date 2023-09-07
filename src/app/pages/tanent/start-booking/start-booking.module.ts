import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartBookingPageRoutingModule } from './start-booking-routing.module';

import { StartBookingPage } from './start-booking.page';

// Calendar UI Module
import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CalendarModule,
    StartBookingPageRoutingModule
  ],
  declarations: [StartBookingPage]
})
export class StartBookingPageModule {}
