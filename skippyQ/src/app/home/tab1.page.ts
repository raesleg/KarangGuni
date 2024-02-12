import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import firebase from 'firebase/app';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  userName: string = 'John Doe'; // Default name
  points: number = 0; // Initialize points
  interestGroups: any[] = [];
  specificGroupIds: string[] = ['HHlg9xJbdOHTTP02U3OT', 'iY8n9ARTcJ5avyBitdGJ'];
  vouchers: any[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService) { }

  async ngOnInit() {

    this.authService.observeAuthState(user => {
      if (user && user.email) {
        // If a user is logged in, get the user profile
        this.authService.getUserProfile(user.email).then((profile) => {
          if (profile) {
            this.userName = profile.name
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

    const userData = await this.userService.getUserData();
    if (userData) {
      this.userName = userData.name; // Assuming 'name' is the field in the Firestore document
    }

    this.points = await this.userService.getUserPoints(this.userService.getUserEmail());
    this.interestGroups = await this.userService.getSpecificInterestGroups(this.specificGroupIds);
    this.vouchers = await this.userService.getVouchers();

  }

  getImagePath(voucher: { brand: string; }): string {
    let imageName = ''; // Default image name
    if (voucher.brand.toLowerCase() === 'grab') {
      imageName = 'grab.png';
    } else if (voucher.brand.toLowerCase() === 'ntuc') {
      imageName = 'ntuc.png';
    }
    // Add more conditions if you have more brands

    return `../assets/${imageName}`;
  }

}
