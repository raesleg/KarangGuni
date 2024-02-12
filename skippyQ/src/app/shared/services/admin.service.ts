import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Profile } from './models/profile';
import { Observable } from 'rxjs';
import { Product } from './models/product';
import { Trans } from './models/trans';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private profileRef = firebase.firestore().collection('profile');
  private productsRef = firebase.firestore().collection("products") // reading products collection in db to store it as a property
  private bannedRef = firebase.firestore().collection("banned");
  private transRef = firebase.firestore().collection("transaction");

  constructor() { }

  getProfile(): Observable<any>{
    return new Observable((observer) => {
      this.profileRef.onSnapshot((querySnapShot) => {
        let profile: Profile[] = [];
        querySnapShot.forEach((doc) => {
          let data = doc.data();
          let p = new Profile(data['userID'], data['isAdmin'],  doc['id'], data['phoneNumber'], data['name'], data["password"], data['ageRange'],data['shippingAddress'], data['image']);
          if (data['bio']) p.bio = data['bio'];
          console.log('all',p)
          profile.push(p);
        });
        observer.next(profile);
      })
    })
  }

  getProfileByID(id: string): Observable<any>{
    return new Observable((observer) => {
      this.profileRef.doc(id).get().then((doc) => {
          let data = doc.data();
          let p = new Profile(data!['userID'], data!['isAdmin'], doc!['id'], data!['phoneNumber'], data!['name'], data!["password"], data!['ageRange'], data!['shippingAddress'], data!['image']);
          if (data!['bio']) p.bio = data!['bio'];
          console.log('allid',p)

          observer.next(p); // Notify observers with the retrieved product
      })
    })
  }

  getAllTrans(): Observable<any> {
    return new Observable(observer => {
      firebase.firestore().collection('transaction').orderBy('create_time').onSnapshot(collection => {
        let array: Trans[] = [];
        collection.forEach(async doc => {
          try {
            let trans = new Trans(doc.data()['create_time'], doc.data()['currency'], doc.data()['amount'], doc.data()['buyeruserid'], doc.id);
            array.push(trans);

            let dbitems = await firebase.firestore().collection('transaction/' + doc.id + '/products').get();
            let productIds = dbitems.docs.map(itemDoc => itemDoc.id);
            trans.productIds = productIds; 
            
            console.log(trans)
            console.log(productIds)
          } catch (error) {
            console.error('Error processing document:', error);
          }
        });
        observer.next(array);
      });
    });
  }

  getTransById(id: string) {
    // Read document '/loans/<id>'
    return firebase.firestore().collection('transaction').doc(id).get().then(doc => {
      let trans = new Trans(doc.data()!['create_time'], doc.data()!['currency'], doc.data()!['amount'], doc.data()!['buyeruserid'], doc!['id']);
      // Read subcollection '/loans/<id>/items'
      return firebase.firestore().collection('transaction/' + id + '/products').get().then(collection => {

      //   let dbitems = await firebase.firestore().collection('transaction/' + doc.id + '/products').get();
      //   let productIds = dbitems.docs.map(itemDoc => itemDoc.id);
      //   trans.productIds = productIds; 
        
      //   console.log(trans)
      //   console.log(productIds)
      // } catch (error) {
      //   console.error('Error processing document:', error);
      // }

        collection.forEach(doc => {
            // Assuming each document in the subcollection has an 'id' property
            let productId = doc.id;
    
            // Add the product ID to the trans object
            trans.productIds.push(productId);
          });
    
          // Return the trans object with product IDs
          return trans;      
        });
    });
  }

  // getTransbyBuyer(buyeruserid: string): Observable<any> {
  //   // Use a query to find documents with the specified buyeruserid
  //   const query = this.profileRef.where('buyeruserid', '==', buyeruserid);
  
  //   // Return an observable
  //   return new Observable((observer) => {
  //     query.get().then((querySnapshot) => {
  //       const trans = [];
  //       querySnapshot.forEach((doc) => {
  //         const transData = doc.data() as { buyeruserid: string };
  //         trans.push(transData);
  //       });
  //       observer.next(trans);
  //     }).catch((error) => {
  //       observer.error(error);
  //     });
  //   });
  // }

  async Banned(p: Profile, reasons: string, Banned_By: string){
    try {

      const BannedDocRef = this.bannedRef.doc(p.userID);

      // Set the data for the "transaction" document
      await BannedDocRef.set({
        isAdmin: p.isAdmin,
        email: p.email,
        phoneNumber: p.phoneNumber,
        name: p.name,
        ageRange: p.ageRange,
        shippingAddress: p.shippingAddress,
        reasons: reasons,
        Banned_By: Banned_By
      });
      
    } catch (error) {
      console.error('Error adding transaction and subcollections:', error);
      throw error;
    }
  }

  delete(p: Profile) {
    const ref = this.profileRef.doc(p.email);
    ref.get().then(doc => {
      if (doc.exists)
      ref.delete();
    })
  }

  deleteListing(p: Product) {

    this.productsRef.get().then((querySnapshot) => {
      // Iterate through the documents and delete each one
      querySnapshot.forEach((doc) => {
        console.log(p.id)
        const productRef = this.productsRef.doc(p.id)
        productRef.update({ status: 'Violated' }).then(() => {
          console.log('Product status successfully updated!');
        }).catch((error) => {
        console.error('Error updating product status: ', error);
      });
      });
    }).catch((error) => {
      console.error('Error getting documents: ', error);
    });
  }

  // async getUserProfile(email: string): Promise<Profile> {
  //   const profileCollection = this.profileRef;
  
  //   return profileCollection.doc(email).get().then(async (doc) => {
  //     if (doc.exists) {
  //       const data = doc.data() as Profile;

  //       if (data['imagePath']) {
  //         const imageDownloadURL = await this.getImageDownloadURL(data['imagePath']);
  //         data.image = imageDownloadURL; // Add the imageURL to the profile data
  //       }
  //       return data;
  //     } else {
  //       console.log(`User with email ${email} not found in the "profile" collection`);
  //       // Returning an empty Profile object
  //       // return {} as Profile;
  //       // Alternatively, you can throw an error
  //       throw new Error(`Account does not exist`);
  //     }
  //   }).catch((error) => {
  //     console.error('Error getting user info:', error);
  //     // You might want to throw an error here as well
  //     throw error;
  //   });
  // }


  // getUserProfile(userID: string) {
  //   // Use a query to find documents with the specified buyeruserid

  //   const query = this.profileRef.where('userID', '==', userID);
  
  //   // Get the documents based on the query
  //   query.get().then((querySnapshot) => {
  //     // Iterate through the documents and delete each one
  //     querySnapshot.forEach((doc) => {

  //       const cartData = doc.data() as { userID: string };
  //       const userID = cartData.userID;

  //       return cartData

  //     //   const profileRef = this.profileRef.doc(userID)
  //     //   productRef.update({ status: 'Sold' }).then(() => {
  //     //     console.log('Product status successfully updated!');
  //     //   doc.ref.delete().then(() => {
  //     //     console.log('Document successfully deleted!');
  //     //   }).catch((error) => {
  //     //     console.error('Error removing document: ', error);
  //     //   });
  //     // }).catch((error) => {
  //     //   console.error('Error updating product status: ', error);
  //     // });
  //     });
  //   }).catch((error) => {
  //     console.error('Error getting documents: ', error);
  //   });
  // }

  getUserProfile(userID: string): Observable<any> {
    // Use a query to find documents with the specified buyeruserid
    const query = this.profileRef.where('userID', '==', userID);
  
    // Return an observable
    return new Observable((observer) => {
      query.get().then((querySnapshot) => {
        const profiles = [];
        querySnapshot.forEach((doc) => {
          const profileData = doc.data() as { userID: string };
          profiles.push(profileData);
        });
        observer.next(profiles);
      }).catch((error) => {
        observer.error(error);
      });
    });
  }
  


  // getListingByID(selleruserid: string): Observable<any>{
  //   return new Observable((observer) => {
  //     this.productsRef.doc(selleruserid).get().then((doc) => {
  //         let data = doc.data();
  //         let p = new Product(data!['model'], data!['name'], data!['price'], data!['image'], data!['conditions'], data!['details'], data!['category'], data!['status'], data!['sellername'], data!['selleruserid'], data!['buyeruserid'], doc!['id']);
  //         observer.next(p); // Notify observers with the retrieved product
  //     })
  //   })
  //}

}
