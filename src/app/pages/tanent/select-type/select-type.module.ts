import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectTypePageRoutingModule } from './select-type-routing.module';

import { SelectTypePage } from './select-type.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectTypePageRoutingModule
  ],
  declarations: [SelectTypePage]
})
export class SelectTypePageModule {}
