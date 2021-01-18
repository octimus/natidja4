import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidatEditPageRoutingModule } from './candidat-edit-routing.module';

import { CandidatEditPage } from './candidat-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CandidatEditPageRoutingModule
  ],
  declarations: [CandidatEditPage]
})
export class CandidatEditPageModule {}
