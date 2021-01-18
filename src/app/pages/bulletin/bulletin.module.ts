import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BulletinPageRoutingModule } from './bulletin-routing.module';

import { BulletinPage } from './bulletin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BulletinPageRoutingModule
  ],
  declarations: [BulletinPage]
})
export class BulletinPageModule {}
