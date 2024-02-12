import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditRecycleInfoPage } from './edit-recycle-info.page';

const routes: Routes = [
  {
    path: '',
    component: EditRecycleInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditRecycleInfoPageRoutingModule {}
