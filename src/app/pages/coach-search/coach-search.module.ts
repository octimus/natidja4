import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoachSearchPageRoutingModule } from './coach-search-routing.module';

import { CoachSearchPage } from './coach-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoachSearchPageRoutingModule
  ],
  declarations: [CoachSearchPage]
})
export class CoachSearchPageModule {}
