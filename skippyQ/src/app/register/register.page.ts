import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { Profile } from '../shared/services/models/profile';
import { ToastController } from '@ionic/angular';
import { ValidatorsService } from '../shared/services/validators.service';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  submitted: boolean = false;
  ageranges: string[];

  constructor(
    private router: Router,
    private authService: AuthService,
    private validService: ValidatorsService,
    private toastController: ToastController
  ) {
    this.registerForm = new FormGroup(
      {
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        phone: new FormControl('', [Validators.required, this.validService.validPhoneNo]),
        password: new FormControl('', [Validators.required]),
        cfmpassword: new FormControl('', [Validators.required]),
        ageRange: new FormControl('', [Validators.required])
      },
      { validators: this.validService.matchPasswords }
    );

    this.ageranges = ['13-17', '18-29', '30-39', '40-49', '50-59', '60 And Above'];
  }

  ngOnInit() {
    // Listen for password changes and perform validations
    this.registerForm.controls['password'].valueChanges.pipe(startWith('')).subscribe((value) => {
      this.validatePasswordStrength(value);
      this.validatePasswordMatch();
    });

    this.registerForm.controls['cfmpassword'].valueChanges.pipe(startWith('')).subscribe(() => {
      this.validatePasswordMatch();
    });
  }


  register() {
    this.submitted = true;
    if (this.registerForm.valid) {
      const newProfile = new Profile(
        '',
        false,
        this.registerForm.value.email,
        this.registerForm.value.phone,
        this.registerForm.value.name,
        this.registerForm.value.password,
        this.registerForm.value.ageRange,
        ''
      );

      this.authService.register(newProfile).then((userCredential) => {
          // Extract UID from the userCredential
          const uid = userCredential.user?.uid;

          // Do anything else you need with the UID
          console.log('User ID:', uid);

          this.router.navigate(['login']);
        })
        .catch((error) => {
          // Handle registration errors
          console.error('Registration error:', error);
          this.validService.presentToast(error.message, 'danger');
        });
    }
  }

  validatePasswordStrength(password: string) {
    const isPasswordStrong = this.validService.isPasswordStrong(password);
    if (!isPasswordStrong) {
      this.registerForm.controls['password'].setErrors({ weakPassword: true });
    } else {
      this.registerForm.controls['password'].setErrors(null);
    }
  }

  validatePasswordMatch() {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('cfmpassword')?.value;

    if (password !== confirmPassword) {
      this.registerForm.controls['cfmpassword'].setErrors({ passwordMismatch: true });
    } else {
      this.registerForm.controls['cfmpassword'].setErrors(null);
    }
  }
}
