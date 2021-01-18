import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidatEditPage } from './candidat-edit.page';

const routes: Routes = [
  {
    path: '',
    component: CandidatEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidatEditPageRoutingModule {}
