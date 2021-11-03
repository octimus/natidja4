import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SlidersPageRoutingModule } from './sliders-routing.module';

import { SlidersPage } from './sliders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SlidersPageRoutingModule
  ],
  declarations: [SlidersPage]
})
export class SlidersPageModule {}
