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
        // Login successful, navigate to the desired page
        this.router.navigate(['/tabs/tab1']);
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
}