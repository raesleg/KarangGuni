import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WasteSorterPage } from './waste-sorter.page';

const routes: Routes = [
  {
    path: '',
    component: WasteSorterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WasteSorterPageRoutingModule {}
