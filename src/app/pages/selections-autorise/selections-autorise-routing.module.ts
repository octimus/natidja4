import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectionsAutorisePage } from './selections-autorise.page';

const routes: Routes = [
  {
    path: '',
    component: SelectionsAutorisePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectionsAutorisePageRoutingModule {}
