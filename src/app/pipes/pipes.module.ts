import { NgModule } from '@angular/core';
import { MomentPipe } from './moment/moment.pipe';
import { TextHtmlPipe } from './text-pipe/text-html.pipe';
import { MoneyPipe } from './money/money.pipe';


@NgModule({
declarations: [MomentPipe, TextHtmlPipe, MoneyPipe],
imports: [],
exports: [MomentPipe, TextHtmlPipe, MoneyPipe],
})

export class PipesModule {}