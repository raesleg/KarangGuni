import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { Profile } from '../shared/services/models/profile';
import { ToastController } from '@ionic/angular';
import { ValidatorsService } from '../shared/services/validators.service';
import { startWith } from 'rxjs';
import { RewardService } from '../shared/services/reward.service';
import { Reward } from '../shared/services/models/reward';

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
    private rewardService: RewardService,
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

      const newReward = new Reward(
        '',
        this.registerForm.value.email,
        0,
        []
      )

      this.authService.register(newProfile).then((userCredential) => {
          const uid = userCredential.user?.uid;

          // Create empty reward doc for new user w their email
          this.rewardService.createReward(newReward);

          console.log('User ID:', uid);
          this.validService.presentToast('Account created successfully', 'success');
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
