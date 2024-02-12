import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { positiveNumber } from '../shared/services/positiveNumber';
import { Product } from '../shared/services/models/product';
import { ProductService } from '../shared/services/product.service';
import { Route, Router } from '@angular/router';
import { ActionSheetController, IonSearchbar, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from '../shared/services/auth.service';
import { CartPage } from '../cart/cart.page';
import { Profile } from '../shared/services/models/profile';
import { Cart } from '../shared/services/models/cart';
import { NotifPage } from '../notif/notif.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  products: Product[] = [];
  cart: Product[] = [];
  categories: string[];
  notification: Product[] = [];
  user: string | undefined;
  filteredProducts: Product[] = [];
  buyercart: Product[] = [];
  selectedCategory: string;

  cartItemCount = 0
  userName: string | undefined;
  segmentValue: string = 'all';

  shippingAddress: string | undefined;
  buyeruserid: string;
  buyeruserName: string;
  unopenedNotifCount: number = 0;

  productidarray = []


  @ViewChild('searchBar', {static: false}) searchBar: IonSearchbar;

  constructor(
    private productService: ProductService, 
    private authService: AuthService,
    private toastController: ToastController, 
    private router: Router, 
    private modalCtrl: ModalController, 
    private actionSheetCtrl: ActionSheetController) {
    
    this.categories = ['All','Price (High - Low)','Price (Low - High)','Electronics', 'Home Appliances', 'Beauty', 'Healthcare', 'Furniture', 'Toys & Games', 'Sports', 'Books', 'Clothing', 'Others']; //add category seelct options use *ngFor in html
  }

  filterProducts(event: any) {
    const selectedCategory = event.detail.value;

    console.log(selectedCategory)

    if (selectedCategory && selectedCategory !== null && selectedCategory !== 'All' && selectedCategory !== 'Price (High - Low)' && selectedCategory !== 'Price (Low - High)') {
      this.filteredProducts = this.products.filter(product => product.category === selectedCategory);
      console.log('yes')
    } else if (selectedCategory && selectedCategory === 'Price (High - Low)'){
      this.filteredProducts = this.products.slice().sort((a, b) => b.price - a.price);
      console.log('ex')
    } else if (selectedCategory && selectedCategory === 'Price (Low - High)'){
      this.filteredProducts = this.products.slice().sort((a, b) => a.price - b.price);
      console.log('cheap')
    } else if (selectedCategory === null || selectedCategory === 'All'){
      this.filteredProducts = this.products;
      console.log('no')
    } else {
      this.filteredProducts = this.products
    }
  }

    //toast message popup
  async addToCart(item:Product, productid: string){

    console.log('cart1', this.buyercart)

    if (this.buyeruserid){

    if (this.buyercart.length === 0){
      console.log("empty")
      const toast = await this.toastController.create({
        message: item.name + ' added to cart',
        duration: 2000,
        position: 'top',
        color: 'primary'
      });
      toast.present();
      console.log('item',item)
      this.productService.addtoCart(item, this.buyeruserid);  

    } else {
      for (const i of this.buyercart) {
        console.log(i['productid'])
        let productidarray = i['productid']
  
        console.log(productidarray)
        console.log('buyeruserid', this.buyeruserid)
        // console.log('productid', productid)
        // console.log('itemid', item.id)

        const itemExistsInCart = this.buyercart.some((i) => i['productid'] === item.id);
        if (!itemExistsInCart){
          console.log('buyerbuyer',this.buyercart)
          // if (item.id !== productidarray){
            const toast = await this.toastController.create({
              message: item.name + ' added to cart',
              duration: 2000,
              position: 'top',
              color: 'primary'
            });
            toast.present();
            console.log('item',item)
            this.productService.addtoCart(item, this.buyeruserid);  
          // }
          } else {
              const toast = await this.toastController.create({
                message: item.name + ' is already in the cart',
                duration: 2000,
                position: 'top',
                color: 'danger'
              });
              toast.present();
            }
          }
        }
          
          } else {
          console.log('id invalid')
        }
    
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

  search(event){
    //get text typed by user in search bar
    const text = event.target.value;
    //get all products again from service
    this.productService.getProducts().subscribe((allProducts: Product[]) => {
      if (text && text.trim() !== '') {
        // use all products to filter
        this.filteredProducts = this.products.filter(
          item => item.name.toLowerCase().includes(text.toLowerCase())
        );
      } else {
        // blank text, clear search, show all products
        this.filteredProducts = this.products;
      }
    });  
    
  }

  refresh($event){
    this.searchBar.value = '';
    this.selectedCategory = ''
    $event.target.complete();
    this.productService.getProducts().subscribe((allProducts: Product[]) => {
        this.filteredProducts = this.products
      })
    }
  
  async ngOnInit() {

    this.authService.observeAuthState(user => {
      if (user && user.email) {
        // If a user is logged in, get the user profile
        this.authService.getUserProfile(user.email).then((profile) => {
          if (profile) {
            this.shippingAddress = profile.shippingAddress;
            this.buyeruserid = profile.userID;
            this.buyeruserName = profile.name;
            console.log('details1', this.shippingAddress, this.buyeruserid, this.buyeruserName);

            this.productService.getProducts()
            .subscribe(data => {
              this.products = data.filter(item => item.selleruserid !== this.buyeruserid && item.status == "Available");
              this.notification = data.filter(item => item.selleruserid === this.buyeruserid && item.status == "Sold" && item.isShipped !== "True");
              this.unopenedNotifCount = this.notification.length;
              this.filteredProducts = this.products
              
              console.log(this.products)
            })
        
            this.productService.getCart()
            .subscribe(data => {
              this.cart = data;
              console.log('cart og', this.cart)
              this.buyercart = this.cart.filter(item => item.buyeruserid === this.buyeruserid);
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
    //   const profile = await this.authService.getUserProfile(this.user);
          
    //     if (profile) {
    //       this.shippingAddress = profile.shippingAddress;
    //       this.buyeruserid = profile.userID;
    //       this.buyeruserName = profile.name;
    //       console.log('details1', this.shippingAddress, this.buyeruserid, this.buyeruserName);
    //     } else {
    //       console.log('User profile not found');
    //     }

    // } catch (error) {
    //   console.error('Error fetching user profile:', error);
    // }

    // this.productService.getProducts()
    // .subscribe(data => {
    //   this.products = data.filter(item => item.selleruserid !== this.buyeruserid && item.status != "Sold");
    //   this.filteredProducts = this.products
      
    //   console.log(this.products)
    // })

    // this.productService.getCart()
    // .subscribe(data => {
    //   this.cart = data;
    //   console.log('cart og', this.cart)
    //   this.buyercart = this.cart.filter(item => item.buyeruserid === this.buyeruserid);
    //   console.log('bueyrcart',this.buyercart)
    //   // console.log('cart', this.cart)
    // })
  }


  delete(item: Product){
    this.productService.delete(item)
  }

  // yourlisting(){
  //   this.router.navigate(['tabs/listing']);
  // }

  // navigateback(){
  //   this.router.navigate(['tabs/tab2']);
  // }

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
