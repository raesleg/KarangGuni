import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TextSortPageRoutingModule } from './text-sort-routing.module';

import { TextSortPage } from './text-sort.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TextSortPageRoutingModule
  ],
  declarations: [TextSortPage]
})
export class TextSortPageModule {}
