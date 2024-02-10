import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminTransPage } from './admin-trans.page';

const routes: Routes = [
  {
    path: '',
    component: AdminTransPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminTransPageRoutingModule {}
