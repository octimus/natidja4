import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatsPageRoutingModule } from './chats-routing.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

import { ChatsPage } from './chats.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ChatsPageRoutingModule
  ],
  declarations: [ChatsPage]
})
export class ChatsPageModule {}
