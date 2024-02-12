import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WasteSorterPageRoutingModule } from './waste-sorter-routing.module';

import { WasteSorterPage } from './waste-sorter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WasteSorterPageRoutingModule
  ],
  declarations: [WasteSorterPage]
})
export class WasteSorterPageModule {}
