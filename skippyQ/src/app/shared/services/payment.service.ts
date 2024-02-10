import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { Product } from './models/product';
import { AuthService } from './auth.service';
import { Cart } from './models/cart';
import { Trans } from './models/trans';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  totalAmount = 0;
  transactionID = "";
  buyeruserid: string;
  buyeruserName: string;

  constructor(private authService: AuthService) { }

  // createTrans(items: Cart[],  trans: { create_time: Date, currency: string, amount: number, id:string }) {

    // Due date is 2 weeks after today 

    // let duedate = new Date(); // Today
    // duedate.setHours(0, 0, 0, 0); // Midnight
    // duedate.setDate(duedate.getDate() + 14); // 2 weeks later

    // this.authService.observeAuthState(user => {
    //   if (user && user.email) {
    //     // If a user is logged in, get the user profile
    //     this.authService.getUserProfile(user.email).then((profile) => {
    //       if (profile) {
    //         this.buyeruserid = profile.userID;
    //         this.buyeruserName = profile.name;
    //         console.log('trans info id and name buyer', this.buyeruserid, this.buyeruserName);
    //       } else {
    //         console.log('User profile not found');
    //       }
    //     }).catch(error => {
    //       console.error('Error fetching user profile:', error);
    //     });
    //   } else {
    //     console.log('No user logged in');
    //   }
    // });

    // Add to collection '/loans/<autoID>' 
    // return firebase.firestore().collection('transaction').add({
    //   create_time: trans.create_time,
    //   currency: trans.currency,
    //   amount: trans.amount
    // }).then(doc => {
    //   trans.id = doc.id;
    //   // Add to collection '/loans/<autoID>/items/'
    //   for (let item of items) {
    //     if (item.id) {
    //       // Add a new document '/loans/<autoID>/items/<itemID>'
    //       firebase.firestore().collection('transaction/' + doc.id + '/carts/').doc(item.id).set({
    //         // quantity: item.quantity
    //       });
    //     }
    //   }
    //   return trans;
    // })

  // }
}
