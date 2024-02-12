import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewGroupPageRoutingModule } from './view-group-routing.module';

import { ViewGroupPage } from './view-group.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewGroupPageRoutingModule
  ],
  declarations: [ViewGroupPage]
})
export class ViewGroupPageModule {}
