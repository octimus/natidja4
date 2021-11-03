import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReferalPageRoutingModule } from './referal-routing.module';

import { ReferalPage } from './referal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReferalPageRoutingModule
  ],
  declarations: [ReferalPage]
})
export class ReferalPageModule {}
