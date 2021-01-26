import { NgModule } from '@angular/core';
import { MomentPipe } from './moment/moment.pipe';


@NgModule({
declarations: [MomentPipe],
imports: [],
exports: [MomentPipe],
})

export class PipesModule {}