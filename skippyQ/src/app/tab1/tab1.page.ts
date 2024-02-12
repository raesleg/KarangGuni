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

  constructor(private authService: AuthService, private router: Router) {}


  async ngOnInit() {

    this.authService.observeAuthState(user => {
      if (user && user.email) {
        // If a user is logged in, get the user profile
        this.authService.getUserProfile(user.email).then((profile) => {
          if (profile) {
            this.userName = profile.name;
            console.log('User Name:', this.userName);
          } else {
            console.log('User profile not found');
          }
        }).catch(error => {
          console.error('Error fetching user profile:', error);
        });
      } else {
        console.log('No user logged in');
      }
    });
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
