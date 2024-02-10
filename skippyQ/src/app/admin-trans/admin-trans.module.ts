import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminTransPageRoutingModule } from './admin-trans-routing.module';

import { AdminTransPage } from './admin-trans.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminTransPageRoutingModule
  ],
  declarations: [AdminTransPage]
})
export class AdminTransPageModule {}
