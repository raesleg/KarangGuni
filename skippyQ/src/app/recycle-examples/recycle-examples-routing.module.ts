import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecycleExamplesPage } from './recycle-examples.page';

const routes: Routes = [
  {
    path: '',
    component: RecycleExamplesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecycleExamplesPageRoutingModule {}
