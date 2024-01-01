import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Profile } from './models/profile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private profileRef = firebase.firestore().collection('profile');

  constructor() { }
  observeAuthState(func: firebase.Observer<any, Error> | ((a: firebase.User | null) => any))
    {
      return firebase.auth().onAuthStateChanged(func);
    }
  
  login(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  async register(profile: Profile) {
    try {
      // Step 1: Create user in Firebase Authentication
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(
        profile.email,
        profile.password
      );
  
      // Step 2: Save additional user details in Firestore
      this.profileRef.add ( {
        userID: userCredential.user?.uid,
        isAdmin: profile.isAdmin,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        name: profile.name,
        ageRange: profile.ageRange
      });
      // Optionally, you can return the userCredential or user object if needed
      return userCredential;
    } catch (error) {
      console.error('Registration error:', error);
      throw error; // Rethrow the error for the caller to handle
    }
  }
  
}
