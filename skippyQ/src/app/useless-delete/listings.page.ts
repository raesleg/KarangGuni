// import { Component, OnInit } from '@angular/core';
// import { Product } from '../shared/services/models/product';
// import { ProductService } from '../shared/services/product.service';
// import { AuthService } from '../shared/services/auth.service';
// import { Router } from '@angular/router';
// import { ActionSheetController, ModalController, ToastController } from '@ionic/angular';
// import { CartPage } from '../cart/cart.page';

// @Component({
//   selector: 'app-listings',
//   templateUrl: './listings.page.html',
//   styleUrls: ['./listings.page.scss'],
// })
// export class ListingsPage implements OnInit {

//   products: Product[] = [];
//   cart: Product[] = [];
//   cartItemCount = 0
//   userName: string | undefined;

//   constructor(private productService: ProductService, private authService: AuthService, private toastController: ToastController, private router: Router,private modalCtrl: ModalController, private actionSheetCtrl: ActionSheetController) {

//     this.productService.getProducts()
//     .subscribe(data => {
//       this.products = data;

//       console.log(this.products)
//     })

//     this.productService.getCart()
//     .subscribe(data => {
//       this.cart = data;

//       console.log('cart', this.cart)
//     })

//   }

//   ngOnInit() {
//   }

//   async openCart() {
//     let modal = await this.modalCtrl.create({
//       component: CartPage,
//       cssClass: 'cart-modal'
//     });
//     modal.onWillDismiss().then(() => {
//       // this.fab.nativeElement.classList.remove('animated', 'bounceOutLeft')
//       // this.animateCSS('bounceInLeft');
//     });
//     modal.present();
//   }

//   canDismiss = async () => {
//     const actionSheet = await this.actionSheetCtrl.create({
//       header: 'Are you sure?',
//       buttons: [
//         {
//           text: 'Yes',
//           role: 'confirm',
//         },
//         {
//           text: 'No',
//           role: 'cancel',
//         },
//       ],
//     });

//     actionSheet.present();

//     const { role } = await actionSheet.onWillDismiss();

//     return role === 'confirm';
//   };


//   delete(item: Product){
//     this.canDismiss().then((confirmed) => {
//       if (confirmed) {
//         this.productService.delete(item)
//       }
//     });

//   }



// }
