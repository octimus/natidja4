import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyGiftsPageRoutingModule } from './my-gifts-routing.module';

import { MyGiftsPage } from './my-gifts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyGiftsPageRoutingModule
  ],
  declarations: [MyGiftsPage]
})
export class MyGiftsPageModule {}
