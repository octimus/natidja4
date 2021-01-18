import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExamSelectPageRoutingModule } from './exam-select-routing.module';

import { ExamSelectPage } from './exam-select.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExamSelectPageRoutingModule
  ],
  declarations: [ExamSelectPage]
})
export class ExamSelectPageModule {}
