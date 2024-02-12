import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommunityHubPage } from './communityhub.page';
import { CommunityHubPageRoutingModule } from './communityhub-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule, ReactiveFormsModule,
    CommunityHubPageRoutingModule
  ],
  declarations: [CommunityHubPage]
})
export class CommunityHubPageModule {}
