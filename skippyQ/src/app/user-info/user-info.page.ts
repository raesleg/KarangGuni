import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { ValidatorsService } from '../shared/services/validators.service';
import { ToastController } from '@ionic/angular';
import { Profile } from '../shared/services/models/profile';
import { filter, startWith } from 'rxjs';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.page.html',
  styleUrls: ['./user-info.page.scss'],
})
export class UserInfoPage implements OnInit {
userInfoForm: FormGroup;
submitted: boolean = false;
togglePswd: boolean = false;
ageranges: string[];

userProfile!: Profile;
image: string | undefined;
// private file: File;

  constructor(private router: Router,
    private authService: AuthService,
    private validService: ValidatorsService,
    private toastController: ToastController
  ) {
    this.userInfoForm = new FormGroup(
      {
        name: new FormControl('', [Validators.required]),
        email: new FormControl(''),
        phone: new FormControl('', [Validators.required, this.validService.validPhoneNo]),
        bio: new FormControl(''),
        shippingAddress: new FormControl(''),
        ageRange: new FormControl('', [Validators.required]),
        changepwtoggle: new FormControl(''),
        password: new FormControl(''),
        cfmpassword: new FormControl('')
      },
      { validators: this.validService.matchPasswords }
    );

    this.ageranges = ['13-17', '18-29', '30-39', '40-49', '50-59', '60 And Above'];

  }

  async ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    console.log(currentUser?.email)
    if (currentUser && currentUser.email) {
      try {
        this.userProfile = await this.authService.getUserProfile(currentUser.email);
        console.log('User Profile:', this.userProfile);
  
        // Move the code that depends on userProfile inside the try block
        this.image = this.userProfile.image;
        console.log(this.image);
        this.userInfoForm.controls['name'].setValue(this.userProfile.name);
        this.userInfoForm.controls['email'].setValue(currentUser.email);
        this.userInfoForm.controls['phone'].setValue(this.userProfile.phoneNumber);
        this.userInfoForm.controls['bio'].setValue(this.userProfile.bio);
        this.userInfoForm.controls['shippingAddress'].setValue(this.userProfile.shippingAddress);
        this.userInfoForm.controls['ageRange'].setValue(this.userProfile.ageRange);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    } else {
      console.log('Could not get current user');
    }

    // Listen for password changes and perform validations
    this.userInfoForm.controls['password'].valueChanges.pipe(startWith(''),
    filter(value => value !== '')).subscribe((value) => {
      this.validatePasswordStrength(value);
      this.validatePasswordMatch();
    });

    this.userInfoForm.controls['cfmpassword'].valueChanges.pipe(startWith('')).subscribe(() => {
      this.validatePasswordMatch();
    });
  }

  // onFileChange(fileChangeEvent){
  //   this.file = fileChangeEvent.target.files[0];
  //   const reader = new FileReader();
  //   reader.readAsDataURL(this.file);
  //   reader.onload = () => {
  //     this.image = reader.result as string;
  //   };
  // }

  updateProfile() {
    this.submitted = true;
    if (this.userInfoForm.valid) {
      const updatedProfile = new Profile(
        '',
        false,
        this.userInfoForm.value.email,
        this.userInfoForm.value.phone,
        this.userInfoForm.value.name,
        this.userInfoForm.value.password,
        this.userInfoForm.value.ageRange,
        this.userInfoForm.value.bio,
        this.userInfoForm.value.shippingAddress,
      );

      this.authService.updateProfile(updatedProfile).then(() => {
        console.log('Profile updated successfully');
        this.validService.presentToast('Profile updated successfully', 'success');
      })
      .catch((error) => {
        // Handle registration errors
        console.error('Update Profile error:', error);
        this.validService.presentToast(error.message, 'danger');
      });
    }
  }

  onTogglePswdChange() {
    this.userInfoForm.controls['password'].setValue(null);
    this.userInfoForm.controls['cfmpassword'].setValue(null);
    this.userInfoForm.controls['password'].setErrors(null);
    this.userInfoForm.controls['cfmpassword'].setErrors(null);
    this.userInfoForm.updateValueAndValidity();
  }

  validatePasswordStrength(password: string) {
    const isPasswordStrong = this.validService.isPasswordStrong(password);
    if (!isPasswordStrong) {
      this.userInfoForm.controls['password'].setErrors({ weakPassword: true });
    } else {
      this.userInfoForm.controls['password'].setErrors(null);
    }
  }

  validatePasswordMatch() {
    const password = this.userInfoForm.get('password')?.value;
    const confirmPassword = this.userInfoForm.get('cfmpassword')?.value;

    if (password !== confirmPassword) {
      this.userInfoForm.controls['cfmpassword'].setErrors({ passwordMismatch: true });
    } else {
      this.userInfoForm.controls['cfmpassword'].setErrors(null);
    }
  }
}
