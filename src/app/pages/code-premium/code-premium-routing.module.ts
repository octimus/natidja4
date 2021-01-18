import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodePremiumPage } from './code-premium.page';

const routes: Routes = [
  {
    path: '',
    component: CodePremiumPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CodePremiumPageRoutingModule {}
