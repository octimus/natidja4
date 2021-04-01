import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoachSearchPage } from './coach-search.page';

const routes: Routes = [
  {
    path: '',
    component: CoachSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoachSearchPageRoutingModule {}
