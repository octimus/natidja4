import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParamsCandidatPageRoutingModule } from './params-candidat-routing.module';

import { ParamsCandidatPage } from './params-candidat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParamsCandidatPageRoutingModule
  ],
  declarations: [ParamsCandidatPage]
})
export class ParamsCandidatPageModule {}
