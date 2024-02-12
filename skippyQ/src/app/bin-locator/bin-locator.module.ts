import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BinLocatorPageRoutingModule } from './bin-locator-routing.module';

import { BinLocatorPage } from './bin-locator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BinLocatorPageRoutingModule
  ],
  declarations: [BinLocatorPage]
})
export class BinLocatorPageModule {}
