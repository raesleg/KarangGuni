import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunityHubPage } from './communityhub.page';

const routes: Routes = [
  {
    path: '',
    component: CommunityHubPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityHubPageRoutingModule {}
