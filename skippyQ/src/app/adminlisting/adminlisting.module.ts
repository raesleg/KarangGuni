import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminlistingPageRoutingModule } from './adminlisting-routing.module';

import { AdminlistingPage } from './adminlisting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminlistingPageRoutingModule
  ],
  declarations: [AdminlistingPage]
})
export class AdminlistingPageModule {}
