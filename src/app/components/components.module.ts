import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileComponentComponent } from './file-component/file-component.component';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { FlipCardComponent } from './flip-card/flip-card.component';
import { PipesModule } from '../pipes/pipes.module';



@NgModule({
  schemas:[NO_ERRORS_SCHEMA],
  declarations: [FileComponentComponent, FlipCardComponent],
  exports: [FileComponentComponent, FlipCardComponent],
  imports: [
    CommonModule,
    PipesModule,
    NgxIonicImageViewerModule
  ]
})
export class ComponentsModule { }
