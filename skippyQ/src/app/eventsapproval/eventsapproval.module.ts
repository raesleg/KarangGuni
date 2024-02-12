import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventsapprovalPageRoutingModule } from './eventsapproval-routing.module';

import { EventsapprovalPage } from './eventsapproval.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventsapprovalPageRoutingModule
  ],
  declarations: [EventsapprovalPage]
})
export class EventsapprovalPageModule {}
