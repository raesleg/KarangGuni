import { Injectable } from '@angular/core';
import { Product } from './models/product';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { Observable} from 'rxjs';
import { Cart } from './models/cart';

import * as moment from 'moment-timezone';
import { Trans } from './models/trans';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsRef = firebase.firestore().collection("products") // reading products collection in db to store it as a property
  private cartsRef = firebase.firestore().collection("cart");
  private transRef = firebase.firestore().collection("transaction");

  private storage = firebase.storage();

  constructor() { }

  getProducts(): Observable<any>{
    return new Observable((observer) => {
      this.productsRef.onSnapshot((querySnapShot) => {
        let products: Product[] = [];
        querySnapShot.forEach((doc) => {
          let data = doc.data();
          // let p = new Product(data['name'], data['price'], data['image'], data["details"], data['category'], data["userid"],doc['id']);
          // let p = new Product(data['model'], data['name'], data['price'], data['image'], data['conditions'], data['details'], data['category'], data['status'], data['sellername'], data['selleruserid'], data['buyeruserid'], data['productid'], doc['id']);
          let p = new Product(data['model'], data['name'], data['price'], data['image'], data['conditions'], data['details'], data['category'], data['status'], data['isShipped'], data['sellername'], data['selleruserid'], data['buyeruserid'], doc['id']);
          console.log('all',p)
          products.push(p);
        });
        observer.next(products);
      })
    })
  }

  getProductByID(id: string): Observable<any>{
    return new Observable((observer) => {
      this.productsRef.doc(id).get().then((doc) => {
          let data = doc.data();
          // let p = new Product(data!['name'], data!['price'], data!['image'], data!["details"], data!['category'], data!['userid'], doc!['id']);
          // let p = new Product(data!['model'], data!['name'], data!['price'], data!['image'], data!['conditions'], data!['details'], data!['category'], data!['status'], data!['sellername'], data!['selleruserid'], data!['buyeruserid'], data!['productid'], doc!['id']);
          let p = new Product(data!['model'], data!['name'], data!['price'], data!['image'], data!['conditions'], data!['details'], data!['category'], data!['status'],  data!['isShipped'], data!['sellername'], data!['selleruserid'], data!['buyeruserid'], doc!['id']);
          observer.next(p); // Notify observers with the retrieved product
      })
    })
  }
  
  add(p:Product){
    //let firebase auto generate id
    this.productsRef.add({
      model: p.model,
      name: p.name,
      price: p.price,
      image: p.image,
      conditions: p.conditions,
      details: p.details,
      category: p.category,
      status: p.status,
      isShipped: p.isShipped,
      sellername: p.sellername,
      selleruserid: p.selleruserid,
      buyeruserid: ""//,
      // productid: ""
    })
  }

  addtoCart(p:Product, buyeruserid: string){
    this.productsRef.get().then((querySnapshot) => {
      // Iterate through the documents and delete each one
      querySnapshot.forEach((doc) => {
        console.log(p.id)
        const productRef = this.productsRef.doc(p.id)
        productRef.update({ buyeruserid : buyeruserid }).then(() => {
          console.log('Successfully updated!');
              //let firebase auto generate id
        }).catch((error) => {
        console.error('Error updating buyer status: ', error);
      });
      });
    
    }).catch((error) => {
      console.error('Error getting buyer documents: ', error);
    });

    this.cartsRef.add({
      model:p.model,
      name: p.name,
      price: p.price,
      image: p.image,
      conditions: p.conditions,
      details: p.details,
      category: p.category,
      status: p.status,
      isShipped: p.isShipped,
      sellername: p.sellername,
      selleruserid: p.selleruserid,
      buyeruserid: buyeruserid,
      productid: p.id
    })
  }

  async addtoTrans(create_time: Date, currency: string, amount: number, buyeruserid: string, transactionid: string, items: Cart[]){
    try {

      const transactionDocRef = this.transRef.doc(transactionid);

      // Set the data for the "transaction" document
      await transactionDocRef.set({
        create_time: (moment.utc(create_time)).tz("Asia/Singapore").format("YYYY-MM-DDTHH:mm:ss"),
        // create_time: create_time,
        currency: currency,
        amount: amount,
        buyeruserid: buyeruserid
      });

      const productsCollectionRef = transactionDocRef.collection('products');

      for (const item of items){
        console.log('prodid',item.productid)
        if (item.id){
          await productsCollectionRef.doc(item.productid).set({
          })
        }
      }

      console.log('Transaction and subcollections added successfully.');
      
    } catch (error) {
      console.error('Error adding transaction and subcollections:', error);
      throw error;
    } 
  }

  updateShipment(p: Product) {

    this.productsRef.get().then((querySnapshot) => {
      // Iterate through the documents and delete each one
      querySnapshot.forEach((doc) => {
        console.log(p.id)
        const productRef = this.productsRef.doc(p.id)
        productRef.update({ isShipped : "True" }).then(() => {
          console.log('Successfully updated!');
        }).catch((error) => {
        console.error('Error updating shipment status: ', error);
      });
      });
    }).catch((error) => {
      console.error('Error getting documents: ', error);
    });
  }


  updateBuyer(p: Product, buyeruserid: string) {

    this.productsRef.get().then((querySnapshot) => {
      // Iterate through the documents and delete each one
      querySnapshot.forEach((doc) => {
        console.log(p.id)
        const productRef = this.productsRef.doc(p.id)
        productRef.update({ buyeruserid : buyeruserid }).then(() => {
          console.log('Successfully updated!');
        }).catch((error) => {
        console.error('Error updating buyer status: ', error);
      });
      });
    }).catch((error) => {
      console.error('Error getting buyer documents: ', error);
    });
  }

  // updateBuyer(p: Product, buyeruserid: string) {  
  //   // Get the documents based on the query
  //   this.productsRef.get().then((querySnapshot) => {
  //     // Iterate through the documents and delete each one
  //     querySnapshot.forEach((doc) => {

  //       const Data = doc.data() as { productid: string };
  //       const productId = Data.productid;
  //       console.log(productId)

  //       const productRef = this.productsRef.doc(productId)
  //       productRef.update({ buyeruserid: buyeruserid }).then(() => {
  //         console.log('Buyer status successfully updated!');
  //     }).catch((error) => {
  //       console.error('Error updating buyer status: ', error);
  //     });
  //     });
  //   }).catch((error) => {
  //     console.error('Error getting documents: ', error);
  //   });
  // }


  delete(p: Product) {
    const ref = this.productsRef.doc(p.id);
    ref.get().then(doc => {
      if (doc.exists)
      ref.delete();
    })
  }

  update(p: Product){
    console.log(p.id)
    const ref = this.productsRef.doc(p.id);
    console.log(ref)
    ref.update({
      model: p.model,
      name: p.name,
      price: p.price,
      image: p.image,
      conditions: p.conditions,
      details: p.details,
      category: p.category,
      status: p.status,
      isShipped: p.isShipped
    });
  }

  async uploadImage(file: File): Promise<string> {
    const storageRef = this.storage.ref();
    const imageRef = storageRef.child(`images/${file.name}`);
    await imageRef.put(file);
    return await imageRef.getDownloadURL();
  }

  getCart(): Observable<any>{
    return new Observable((observer) => {
      this.cartsRef.onSnapshot((querySnapShot) => {
        let cart: Cart[] = [];
        // let cart: Product[] = [];

        querySnapShot.forEach((doc) => {
          let data = doc.data();
          let p = new Cart(data['model'], data['name'], data['price'], data['image'], data['conditions'], data['details'], data['category'], data['status'], data['isShipped'], data['sellername'], data['selleruserid'], data['buyeruserid'], data['productid'],doc['id']);
          // let p = new Product(data['model'], data['name'], data['price'], data['image'], data['conditions'], data['details'], data['category'], data['status'], data['sellername'], data['selleruserid'], data['buyeruserid'], doc['id']);
          console.log('cart',p)

          cart.push(p);
        });
        observer.next(cart);
      })
    })
  }

  removeCart(p: Product) {

    this.productsRef.get().then((querySnapshot) => {
      // Iterate through the documents and delete each one
      querySnapshot.forEach((doc) => {
        console.log(p)
        const productRef = this.productsRef.doc(p['productid'])
        productRef.update({ buyeruserid : "" }).then(() => {
          console.log('Successfully updated!');

          const ref = this.cartsRef.doc(p.id);
          console.log('lol',p.id)
          ref.get().then(doc => {
            if (doc.exists)
            ref.delete();
          })      
  
          }).catch((error) => {
            console.error('Error removing document: ', error);
          });
      });
      }).catch((error) => {
        console.error('Error getting buyer documents: ', error);
      });
  }

  removeCartAll(p: Product, buyeruserid: string) {
    // Use a query to find documents with the specified buyeruserid

    const query = this.cartsRef.where('buyeruserid', '==', buyeruserid);
  
    // Get the documents based on the query
    query.get().then((querySnapshot) => {
      // Iterate through the documents and delete each one
      querySnapshot.forEach((doc) => {

        const cartData = doc.data() as { productid: string };
        const productId = cartData.productid;

        const productRef = this.productsRef.doc(productId)
        productRef.update({ status: 'Sold' }).then(() => {
          console.log('Product status successfully updated!');
        doc.ref.delete().then(() => {
          console.log('Document successfully deleted!');
        }).catch((error) => {
          console.error('Error removing document: ', error);
        });
      }).catch((error) => {
        console.error('Error updating product status: ', error);
      });
      });
    }).catch((error) => {
      console.error('Error getting documents: ', error);
    });
  }
}
