import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoursDetailsPageRoutingModule } from './cours-details-routing.module';

import { CoursDetailsPage } from './cours-details.page';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { FileComponentComponent } from 'src/app/components/file-component/file-component.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxIonicImageViewerModule,
    PipesModule,
    CoursDetailsPageRoutingModule
  ],
  entryComponents: [FileComponentComponent],
  declarations: [CoursDetailsPage]
})
export class CoursDetailsPageModule {}
