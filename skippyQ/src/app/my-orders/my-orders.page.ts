import { Component, OnInit } from '@angular/core';
import { NotifPage } from '../notif/notif.page';
import { CartPage } from '../cart/cart.page';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { Product } from '../shared/services/models/product';
import { ProductService } from '../shared/services/product.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
})
export class MyOrdersPage implements OnInit {

  unopenedNotifCount: number = 0;
  buyercart: Product[] = [];

  myorders: Product[] = [];
  filteredProducts: Product[] = [];
  notification: Product[] = [];
  cart: Product[] = [];
  cartItemCount = 0
  user: string | undefined;
  userName: string | undefined;
  userid: string | undefined;
  email: string;

  constructor(
    private modalCtrl: ModalController, 
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private authService: AuthService,
    private productService: ProductService
  ) { }

  async ngOnInit() {
    this.authService.observeAuthState(user => {
      if (user && user.email) {
        // If a user is logged in, get the user profile
        this.authService.getUserProfile(user.email).then((profile) => {
          if (profile) {
            this.userName = profile.name;
            this.userid = profile.userID;
            
            console.log('User Name:', this.userName);
            console.log('userid', this.userid)

            this.productService.getProducts()
            .subscribe(data => {
              this.myorders = data.filter(item => item.buyeruserid === this.userid && item.status == "Sold");
              this.notification = data.filter(item => item.selleruserid === this.userid && item.status == "Sold" && item.isShipped !== "True");
              this.unopenedNotifCount = this.notification.length;
              console.log(this.myorders)
            })
        
            this.productService.getCart()
            .subscribe(data => {
              this.cart = data;
              console.log('cart og', this.cart)
              this.buyercart = this.cart.filter(item => item.buyeruserid === this.userid);
              console.log('bueyrcart',this.buyercart)
              // console.log('cart', this.cart)
            })
        
          } else {
            console.log('User profile not found');
          }
        }).catch(error => {
          console.error('Error fetching user profile:', error);
        });
      } else {
        console.log('No user logged in');
      }
    });

  }

  async openCart() {
    let modal = await this.modalCtrl.create({
      component: CartPage,
      cssClass: 'cart-modal'
    });
    modal.onWillDismiss().then(() => {
      // this.fab.nativeElement.classList.remove('animated', 'bounceOutLeft')
      // this.animateCSS('bounceInLeft');
    });
    modal.present();
  }
  async openNotification() {

    let modal = await this.modalCtrl.create({
      component: NotifPage,
      cssClass: 'cart-modal'
    });
    modal.onWillDismiss().then(() => {
    });
    modal.present();
  }

  canDismiss = async () => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure to Log Out?',
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    return role === 'confirm';
  };

  yourlisting() {
    setTimeout(() => {
      this.router.navigate(['tabs/listing']);
    }, 50); // Adjust the delay time as needed
  }
  
  navigateback() {
    setTimeout(() => {
      this.router.navigate(['tabs/tab2']);
    }, 50); // Adjust the delay time as needed
  }

  navigateback2() {
    setTimeout(() => {
      this.router.navigate(['tabs/myorders']);
    }, 50); // Adjust the delay time as needed
  }


  
  logout() {
    this.canDismiss().then((confirmed) => {
      if (confirmed) {
        // this.authService.clearUserData()
        console.log('cleared')
        this.authService.logout();
        this.router.navigate(['login']);
          }
    });
  }



}
