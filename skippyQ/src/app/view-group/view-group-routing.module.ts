import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewGroupPage } from './view-group.page';

const routes: Routes = [
  {
    path: '',
    component: ViewGroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewGroupPageRoutingModule {}
