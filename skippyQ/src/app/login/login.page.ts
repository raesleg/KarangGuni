import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(private router: Router) {
    this.loginForm = new FormGroup({
      phone: new FormControl(''),
      password: new FormControl('')
    }); }

  ngOnInit() {
  }

  login() {
    this.router.navigate(['/tabs/tab1']);
  }
}
