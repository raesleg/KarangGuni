import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly userEmail: string = '2459nishasenthil@gmail.com';

  constructor() { }

  async getUserData(): Promise<any> {
    const db = firebase.firestore();
    const userDoc = await db.collection('profile').doc(this.userEmail).get();
    return userDoc.exists ? userDoc.data() : null;
  }

  async getUserName(email: string): Promise<string | null> {
    const db = firebase.firestore();
    const userDoc = await db.collection('profile').doc(email).get();
    return userDoc.exists ? userDoc.data()?.['name'] : null;
  }

  // UserService method to get the username by email
  async getUsernameByEmail(email: string): Promise<string> {
    const profileRef = firebase.firestore().collection('profile').doc(email);
    const doc = await profileRef.get();
    if (doc.exists) {
      const userData = doc.data();
      if (userData && 'name' in userData) {
        return userData['name'];
      } else {
        throw new Error('Name not found in profile');
      }
    } else {
      throw new Error('Profile not found');
    }
  }
  getUserEmail(): string {
    return this.userEmail;
  }

  async getUserPoints(email: string): Promise<number> {
    const db = firebase.firestore();
    const rewardRef = db.collection('reward').where('userEmail', '==', email);
    const snapshot = await rewardRef.get();
    let points = 0;
    snapshot.forEach(doc => {
      points = doc.data()?.['points']; // Assuming 'points' is the field in the reward document
    });
    return points;
  }

  async getSpecificInterestGroups(ids: string[]): Promise<any[]> {
    const db = firebase.firestore();
    let groups = [];
    for (const id of ids) {
      const docRef = await db.collection('groups').doc(id).get();
      if (docRef.exists) {
        groups.push(docRef.data());
      }
    }
    return groups;
  }

  async getVouchers(): Promise<any[]> {
    const db = firebase.firestore();
    const vouchersRef = db.collection('vouchers').limit(2); // Assuming you want to fetch only two vouchers
    const snapshot = await vouchersRef.get();
    return snapshot.docs.map(doc => doc.data());
  }

}

