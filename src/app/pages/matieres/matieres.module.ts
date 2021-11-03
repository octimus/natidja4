import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatieresPageRoutingModule } from './matieres-routing.module';

import { MatieresPage } from './matieres.page';
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
    ComponentsModule,
    MatieresPageRoutingModule
  ],
  declarations: [MatieresPage]
})
export class MatieresPageModule {}
