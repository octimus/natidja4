import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExamSelectPage } from './exam-select.page';

const routes: Routes = [
  {
    path: '',
    component: ExamSelectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamSelectPageRoutingModule {}
