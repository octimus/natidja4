import { NgModule } from '@angular/core';
import { MomentPipe } from './moment/moment.pipe';
import { TextHtmlPipe } from './text-pipe/text-html.pipe';


@NgModule({
declarations: [MomentPipe, TextHtmlPipe],
imports: [],
exports: [MomentPipe, TextHtmlPipe],
})

export class PipesModule {}