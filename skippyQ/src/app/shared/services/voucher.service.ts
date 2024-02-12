import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Voucher } from './models/voucher';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  private voucherRef = firebase.firestore().collection('vouchers');

  constructor() { }

  getVouchers(): Observable<any> {
    return new Observable((observer) => {
      this.voucherRef.onSnapshot((querySnapshot) => {
        let vouchers: Voucher[] = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          let v = new Voucher(doc['id'], data['brand'], data['value'], data['pointsRequired'], data['image']);
          // If there's image, read from Firebase Storage
          if (data['image']) {
            v.imagePath = data['image'];
            const imageRef = firebase.storage().ref().child(data['image']);
            imageRef.getDownloadURL().then(url => {
              v.image = url;
            }).catch(error => {
              console.log('Error: Read image fail ' + error);
            });
          }
          vouchers.push(v);
        });
        observer.next(vouchers);
      });
    });
  }
}