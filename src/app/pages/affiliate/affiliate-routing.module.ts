import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AffiliatePage } from './affiliate.page';

const routes: Routes = [
  {
    path: '',
    component: AffiliatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AffiliatePageRoutingModule {}
