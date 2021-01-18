import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardPaymentPageRoutingModule } from './card-payment-routing.module';

import { CardPaymentPage } from './card-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CardPaymentPageRoutingModule
  ],
  declarations: [CardPaymentPage]
})
export class CardPaymentPageModule {}
