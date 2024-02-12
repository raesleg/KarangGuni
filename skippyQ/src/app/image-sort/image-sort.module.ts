import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImageSortPageRoutingModule } from './image-sort-routing.module';

import { ImageSortPage } from './image-sort.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageSortPageRoutingModule
  ],
  declarations: [ImageSortPage]
})
export class ImageSortPageModule {}
