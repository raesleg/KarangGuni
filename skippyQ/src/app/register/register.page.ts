import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
registerForm: FormGroup;

  constructor() {
    this.registerForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    }); }
  

  ngOnInit() {
  }

}
