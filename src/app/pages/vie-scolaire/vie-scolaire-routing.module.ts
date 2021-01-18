import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VieScolairePage } from './vie-scolaire.page';

const routes: Routes = [
  {
    path: '',
    component: VieScolairePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VieScolairePageRoutingModule {}
