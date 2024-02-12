import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditRecycleInfoPageRoutingModule } from './edit-recycle-info-routing.module';

import { EditRecycleInfoPage } from './edit-recycle-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditRecycleInfoPageRoutingModule
  ],
  declarations: [EditRecycleInfoPage]
})
export class EditRecycleInfoPageModule {}
