import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BulletinPage } from './bulletin.page';

const routes: Routes = [
  {
    path: '',
    component: BulletinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BulletinPageRoutingModule {}
