import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  constructor(private toastController: ToastController) { }

  matchPasswords(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value; //form input name must be the same
    const confirmPassword = control.get('cfmpassword')?.value;
    // console.log('Password:', password);
    // console.log('Confirm Password:', confirmPassword);
  
    return password === confirmPassword ? null : { 'passwordMismatch': true };
  }

  isPasswordStrong(password: string) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
  }

  validPhoneNo(control: AbstractControl): { [key: string]: boolean } | null {
    const phonePattern = /^\d{8}$/; // Assuming an 8-digit phone number format

    const isInvalid = !phonePattern.test(control.value);

    return isInvalid ? { 'invalidPhone': true } : null;
  }

  async presentToast(msg: string, color: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000, // Display for 3 seconds
      position: 'top',
      color: color,
      cssClass: 'custom-toast', // Add a custom class for further styling if needed
    });

    toast.present();
  }
}


