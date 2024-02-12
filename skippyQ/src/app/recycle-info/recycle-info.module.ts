import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecycleInfoPageRoutingModule } from './recycle-info-routing.module';

import { RecycleInfoPage } from './recycle-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecycleInfoPageRoutingModule
  ],
  declarations: [RecycleInfoPage]
})
export class RecycleInfoPageModule {}
