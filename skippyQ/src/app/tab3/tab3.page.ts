import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
userName: string | undefined;
image: string | undefined;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.email) {
      try {
        this.authService.getUserProfile(currentUser.email).then((profile) => {
          // Use the retrieved profile to get the name
          if (profile) {
            this.userName = profile.name;
            console.log('User Name:', this.userName);
            this.image = profile.image;
            console.log(this.image);
          } else {
            console.log('User profile not found');
          }
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    } else {
      console.log('Could not get current user');
    }
  }
  
}
