import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReferalPage } from './referal.page';

const routes: Routes = [
  {
    path: '',
    component: ReferalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferalPageRoutingModule {}
