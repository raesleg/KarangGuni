import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminlistingPage } from './adminlisting.page';

const routes: Routes = [
  {
    path: '',
    component: AdminlistingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminlistingPageRoutingModule {}
