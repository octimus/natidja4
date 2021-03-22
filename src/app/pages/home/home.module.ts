import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    NgxIonicImageViewerModule,
    HomePageRoutingModule,
    ComponentsModule,
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
