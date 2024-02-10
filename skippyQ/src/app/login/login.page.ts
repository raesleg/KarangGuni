import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(private router: Router, private authService: AuthService, private toastController: ToastController) {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    }); }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
      .then(() => {

        this.authService.observeAuthState(user => {
          if (user && user.email) {
            // If a user is logged in, get the user profile
            this.authService.getUserProfile(user.email).then((profile) => {
              if (profile && user.email !== undefined) {
                console.log(profile)
                if (profile && profile.isAdmin) {
                  // If the user is an admin, navigate to the admin page
                  this.router.navigate(['/tabs/tab5']);
                } else if(profile && !profile.isAdmin) {
                  // If the user is not an admin, navigate to the regular user page
                  this.router.navigate(['/tabs/tab1']);
                }
              } else {
                console.log('User profile not found');
              }
            }).catch(error => {
              console.error('Error fetching user profile:', error);
              console.error('Login error:', error.message);// Display a toast message for the error
              this.presentToast2();      
            });
          } else {
            console.log('No user logged in');
          }
        });
      })
      .catch(error => {
        // Handle login errors
        console.error('Login error:', error.message);// Display a toast message for the error
        this.presentToast();
      });
  }
  
  async presentToast() {
    const toast = await this.toastController.create({
      message: "Invalid email or password",
      duration: 3000, // Display for 3 seconds
      position: 'top',
      color: 'danger'
    });
  
    toast.present();
  }

  async presentToast2() {
    const toast = await this.toastController.create({
      message: "Account does not exist",
      duration: 3000, // Display for 3 seconds
      position: 'top',
      color: 'danger'
    });
  
    toast.present();
  }

}