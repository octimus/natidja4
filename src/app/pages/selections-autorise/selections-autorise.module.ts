import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectionsAutorisePageRoutingModule } from './selections-autorise-routing.module';

import { SelectionsAutorisePage } from './selections-autorise.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectionsAutorisePageRoutingModule
  ],
  declarations: [SelectionsAutorisePage]
})
export class SelectionsAutorisePageModule {}
