import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EcolagesPage } from './ecolages.page';

const routes: Routes = [
  {
    path: '',
    component: EcolagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EcolagesPageRoutingModule {}
