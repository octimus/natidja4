import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { IonicModule } from '@ionic/angular';

import { EcolagesPageRoutingModule } from './ecolages-routing.module';

import { EcolagesPage } from './ecolages.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    EcolagesPageRoutingModule
  ],
  declarations: [EcolagesPage]
})
export class EcolagesPageModule {}
