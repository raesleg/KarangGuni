import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { Profile } from '../shared/services/models/profile';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
userName: string | undefined;

  constructor(private authService: AuthService, private router: Router) {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.email) {
      try {
        this.authService.getUserProfile(currentUser.email).then((profile) => {
          // Use the retrieved profile to get the name
          if (profile) {
            this.userName = profile.name;
            console.log('User Name:', this.userName);
          } else {
            console.log('User profile not found');
          }
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    } else {
      console.log('Could not get current user');
    }}

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
