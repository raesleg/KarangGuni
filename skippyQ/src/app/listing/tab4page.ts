import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Product } from '../shared/services/models/product';
import { ProductService } from '../shared/services/product.service';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { ActionSheetController, IonSearchbar, ModalController, ToastController } from '@ionic/angular';
import { CartPage } from '../cart/cart.page';
import { NotifPage } from '../notif/notif.page';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  notification: Product[] = [];
  cart: Product[] = [];
  buyercart: Product[] = [];
  cartItemCount = 0
  user: string | undefined;
  userName: string | undefined;
  userid: string | undefined;
  email: string;
  unopenedNotifCount: number = 0;

  @ViewChild('searchBar', {static: false}) searchBar: IonSearchbar;

  constructor(private productService: ProductService, private authService: AuthService, private toastController: ToastController, private router: Router,private modalCtrl: ModalController, private zone: NgZone, private actionSheetCtrl: ActionSheetController) {

    // this.productService.getProducts()
    // .subscribe(data => {
    //   this.products = data;

    //   console.log(this.products)
    // })

    // this.user = this.authService.getUserData();
    // console.log('email', this.user)


  }

  search(event){
    //get text typed by user in search bar
    const text = event.target.value;
    //get all products again from service
    this.productService.getProducts().subscribe((allProducts: Product[]) => {
      if (text && text.trim() !== '') {
        // use all products to filter
        this.products = allProducts.filter(
          item => item.name.toLowerCase().includes(text.toLowerCase())
        );
      } else {
        // blank text, clear search, show all products
        this.products = allProducts;
      }
    });  
  }

  refresh($event){
    this.searchBar.value = '';
    $event.target.complete();
    this.productService.getProducts().subscribe((allProducts: Product[]) => {
        this.products = allProducts;
      })
    }

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
              this.products = data.filter(item => item.selleruserid === this.userid && item.status == "Available");
              this.notification = data.filter(item => item.selleruserid === this.userid && item.status == "Sold" && item.isShipped !== "True");
              this.unopenedNotifCount = this.notification.length;
              this.filteredProducts = this.products
              
              console.log(this.filteredProducts)
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

    // try {
    //   this.authService.getUserProfile(this.user).then((profile) => {
    //     // Use the retrieved profile to get the name
    //     if (profile) {
    //       this.userName = profile.name;
    //       this.userid = profile.userID;
          
    //       console.log('User Name:', this.userName);
    //       console.log('userid', this.userid)
    //     } else {
    //       console.log('User profile not found');
    //     }
    //   });
    // } catch (error) {
    //   console.error('Error fetching user profile:', error);
    // }

    // this.productService.getProducts()
    // .subscribe(data => {
    //   this.products = data.filter(item => item.selleruserid === this.userid && item.status != "Sold");
    //   this.filteredProducts = this.products
      
    //   console.log(this.filteredProducts)
    // })

    // this.productService.getCart()
    // .subscribe(data => {
    //   this.cart = data;
    //   console.log('cart og', this.cart)
    //   this.buyercart = this.cart.filter(item => item.buyeruserid === this.userid);
    //   console.log('bueyrcart',this.buyercart)
    //   // console.log('cart', this.cart)
    // })


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

  yourlisting(){
    this.zone.run(() => {
      this.router.navigate(['tabs/listing']);
    });  }

  navigateback(){
    this.zone.run(() => {
      this.router.navigate(['tabs/tab2']);
    });
  }

  navigateback2() {
    setTimeout(() => {
      this.router.navigate(['tabs/myorders']);
    }, 50); // Adjust the delay time as needed
  }

  canDismiss = async () => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure to delete listing?',
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


  delete(item: Product){
    this.canDismiss().then(async (confirmed) => {
      if (confirmed) {
        this.productService.delete(item)

        const toast = await this.toastController.create({
          message: item.name + ' has been removed',
          duration: 2000,
          position: 'top',
          color: 'primary'
        });
        toast.present();

      }
    });

  }

  canDismissLogout = async () => {
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

  logout() {
    this.canDismissLogout().then((confirmed) => {
      if (confirmed) {
        this.authService.logout();
        // this.authService.clearUserData()
        this.router.navigate(['login']);
          }
    });
  }


}
