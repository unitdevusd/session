import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { FiltersPageModule } from '../filters/filters.module';
// import { RatingPageModule } from 'src/app/rating/rating.module';
// import { SharedSpaceTypeSliderComponent } from 'src/app/component/shared-space-type-slider/shared-space-type-slider.component';
import { UnitListingComponent } from 'src/app/component/unit-listing/unit-listing.component';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Tab1PageRoutingModule,
    FiltersPageModule,
    // RatingPageModule
  ],
  entryComponents: [],
  declarations: [
    Tab1Page,
    // SharedSpaceTypeSliderComponent,
    UnitListingComponent
  ]
})
export class Tab1PageModule {}
