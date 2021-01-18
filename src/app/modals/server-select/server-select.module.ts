import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServerSelectPageRoutingModule } from './server-select-routing.module';

import { ServerSelectPage } from './server-select.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServerSelectPageRoutingModule
  ],
  declarations: [ServerSelectPage]
})
export class ServerSelectPageModule {}
