import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditGroupPageRoutingModule } from './edit-group-routing.module';

import { EditGroupPage } from './edit-group.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditGroupPageRoutingModule
  ],
  declarations: [EditGroupPage]
})
export class EditGroupPageModule {}
