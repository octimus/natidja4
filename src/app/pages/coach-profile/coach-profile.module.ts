import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoachProfilePageRoutingModule } from './coach-profile-routing.module';

import { CoachProfilePage } from './coach-profile.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ComponentsModule,
    CoachProfilePageRoutingModule
  ],
  declarations: [CoachProfilePage]
})
export class CoachProfilePageModule {}
