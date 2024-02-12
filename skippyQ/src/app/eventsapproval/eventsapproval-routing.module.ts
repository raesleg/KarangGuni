import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventsapprovalPage } from './eventsapproval.page';

const routes: Routes = [
  {
    path: '',
    component: EventsapprovalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsapprovalPageRoutingModule {}
