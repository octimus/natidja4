import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileComponentComponent } from './file-component/file-component.component';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { FlipCardComponent } from './flip-card/flip-card.component';
import { PipesModule } from '../pipes/pipes.module';
import { FireWorkComponent } from './fire-work/fire-work.component';
import { CheckListComponent } from './check-list/check-list.component';
import { CoachDetailsComponent } from './coach-details/coach-details.component';



@NgModule({
  schemas:[NO_ERRORS_SCHEMA],
  declarations: [FileComponentComponent, FlipCardComponent, FireWorkComponent, CheckListComponent, CoachDetailsComponent],
  exports: [FileComponentComponent, FlipCardComponent, FireWorkComponent, CheckListComponent, CoachDetailsComponent],
  imports: [
    CommonModule,
    PipesModule,
    NgxIonicImageViewerModule
  ]
})
export class ComponentsModule { }
