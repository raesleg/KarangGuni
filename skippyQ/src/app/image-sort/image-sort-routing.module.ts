import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImageSortPage } from './image-sort.page';

const routes: Routes = [
  {
    path: '',
    component: ImageSortPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImageSortPageRoutingModule {}
