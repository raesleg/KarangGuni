import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecycleExamplesPageRoutingModule } from './recycle-examples-routing.module';

import { RecycleExamplesPage } from './recycle-examples.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecycleExamplesPageRoutingModule
  ],
  declarations: [RecycleExamplesPage]
})
export class RecycleExamplesPageModule {}
