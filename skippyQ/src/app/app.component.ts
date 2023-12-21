import { Component } from '@angular/core';
import firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  platform: any;
  constructor() {
    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyAuHI89NT0-8o2zD0IoeXD1wiwuTxcHeKQ",
      authDomain: "karang-guni-d3f15.firebaseapp.com",
      projectId: "karang-guni-d3f15",
      storageBucket: "karang-guni-d3f15.appspot.com",
      messagingSenderId: "905280167915",
      appId: "1:905280167915:web:dc0aecdd837912f4ca03ae"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

  initializeApp(){

    this.platform.ready().then(() => {

  });
  }
}
