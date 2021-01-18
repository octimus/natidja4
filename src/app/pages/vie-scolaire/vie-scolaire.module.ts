import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VieScolairePageRoutingModule } from './vie-scolaire-routing.module';

import { VieScolairePage } from './vie-scolaire.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VieScolairePageRoutingModule
  ],
  declarations: [VieScolairePage]
})
export class VieScolairePageModule {}
