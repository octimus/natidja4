import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AffiliatePageRoutingModule } from './affiliate-routing.module';

import { AffiliatePage } from './affiliate.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    AffiliatePageRoutingModule
  ],
  declarations: [AffiliatePage]
})
export class AffiliatePageModule {}
