import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParamsCandidatPage } from './params-candidat.page';

const routes: Routes = [
  {
    path: '',
    component: ParamsCandidatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParamsCandidatPageRoutingModule {}
