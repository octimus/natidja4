import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServerSelectPage } from './server-select.page';

const routes: Routes = [
  {
    path: '',
    component: ServerSelectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServerSelectPageRoutingModule {}
