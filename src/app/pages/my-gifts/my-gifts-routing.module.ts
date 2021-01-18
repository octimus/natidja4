import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyGiftsPage } from './my-gifts.page';

const routes: Routes = [
  {
    path: '',
    component: MyGiftsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyGiftsPageRoutingModule {}
