import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecycleInfoPage } from './recycle-info.page';

const routes: Routes = [
  {
    path: '',
    component: RecycleInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecycleInfoPageRoutingModule {}
