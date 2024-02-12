import { Component, OnInit } from '@angular/core';
import { Product } from '../shared/services/models/product';
import { Router } from '@angular/router';
import { ProductService } from '../shared/services/product.service';
import { AlertController, ModalController, ToastController, ActionSheetController } from '@ionic/angular';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  cart: Product[] = [];
  buyercart: Product[] = []
  user: string | undefined;
  shippingAddress: string | undefined;
  buyeruserid: string;
  buyeruserName: string;
  hasNoItems: boolean;

  constructor(
    private productService: ProductService, 
    private authService: AuthService, 
    private modalCtrl: ModalController, 
    private toastController: ToastController, 
    private alertCtrl: AlertController, 
    private actionSheetCtrl: ActionSheetController,
    private router: Router) { }

  private async fetchUserProfile() {
    try {
      const profile = await this.authService.getUserProfile(this.user);
      if (profile) {
        console.log(profile)
        this.shippingAddress = profile.shippingAddress;
        this.buyeruserid = profile.userID;
        this.buyeruserName = profile.name;

        console.log('details', this.shippingAddress, this.buyeruserid, this.buyeruserName);
      } else {
        console.log('User profile not found');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
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
            this.user = user.email
            console.log('details1', this.shippingAddress, this.buyeruserid, this.buyeruserName, this.user);

            this.productService.getCart()
            .subscribe(data => {
              this.cart = data;
              this.buyercart = this.cart.filter(item => item.buyeruserid === this.buyeruserid);
              console.log(this.buyercart)
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

  canDismiss = async () => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure?',
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

  removeCartItem(item: Product) {
    this.canDismiss().then((confirmed) => {
      if (confirmed) {
        this.productService.removeCart(item);
        console.log('item', item)
        console.log('item2', item['productid'])
        console.log(this.buyercart['productid'])
      }
    });
  }

  getSubTotal() {
    const buyerItems = this.cart.filter(item => item.buyeruserid === this.buyeruserid);
    return buyerItems.reduce((i, j) => i + j.price, 0);
  }

  getTotal() {
    const subtotal = this.getSubTotal();
    const shipping = this.getShipping();
    const total = subtotal + shipping
    return total
  }

  getShipping() {
    const buyerItems = this.cart.filter(item => item.buyeruserid === this.buyeruserid);
    return buyerItems.length;
  }

  async edit() {
    let alert = await this.alertCtrl.create({
      header: 'Shipping Address',
      inputs: [
        {
          name: 'streetName',
          type: 'textarea',
          placeholder: 'Street Name',
        },
        {
          name: 'unitNo',
          placeholder: 'Unit No.',
        },
        {
          name: 'postalCode',
          type: 'number',
          placeholder: 'Postal Code',
          attributes: {
            maxlength: 6,
          },
        },
      ],        
      buttons: [
      {
        text: 'OK',
        handler: async (data) => {
          // Combine the input values into a single string
          // const streetName = data.streetName || '';
          // const unitNo = data.unitNo || '';
          // const postalCode = data.postalCode || '';

          const streetName = data.streetName?.trim();
          const unitNo = data.unitNo?.trim();
          const postalCode = data.postalCode?.trim();

          if (!streetName || !unitNo || !postalCode) {
            // Show an alert if any of the fields are empty
            const errorAlert = await this.alertCtrl.create({
              header: 'Error',
              message: 'All fields must be filled out.',
              buttons: ['OK'],
            });
            errorAlert.present();
            return; // Exit the handler if any field is empty
          }

          const newShippingAddress = `${streetName} ${unitNo}, ${postalCode}`;

          try {
            // Update the shipping address using authService
            console.log('email', this.user)
            await this.authService.updateShippingAddress(this.user, newShippingAddress);
            console.log(newShippingAddress)
            this.fetchUserProfile();
            const toast = await this.toastController.create({
              message: 'Shipping Address has been changed',
              duration: 2000,
              position: 'top',
              color: 'primary'
            });
            toast.present();
        
  
          } catch (error) {
            console.error('Failed to update shipping address:', error);
          }
        }
      }
    ],        
  });
  alert.present().then(() => {
  });

  }


  close() {
    this.modalCtrl.dismiss();
  }

  async checkout() {
    if (this.shippingAddress && this.shippingAddress != ""){
      const total = this.getTotal();
      const user = this.buyeruserid
      console.log('buyer id',this.buyeruserid)
      this.router.navigate(['payment', {total, user}]).then(() => {
        this.modalCtrl.dismiss()
      })
    } else {
      let alert = await this.alertCtrl.create({
        header: 'Shipping Address',
        inputs: [
          {
            name: 'streetName',
            type: 'textarea',
            placeholder: 'Street Name',
          },
          {
            name: 'unitNo',
            placeholder: 'Unit No.',
          },
          {
            name: 'postalCode',
            type: 'number',
            placeholder: 'Postal Code',
            attributes: {
              maxlength: 6,
            },
          },
        ],        
        buttons: [
        {
          text: 'OK',
          handler: async (data) => {

            const streetName = data.streetName?.trim();
            const unitNo = data.unitNo?.trim();
            const postalCode = data.postalCode?.trim();
  
            if (!streetName || !unitNo || !postalCode) {
              // Show an alert if any of the fields are empty
              const errorAlert = await this.alertCtrl.create({
                header: 'Error',
                message: 'All fields must be filled out.',
                buttons: ['OK'],
              });
              errorAlert.present();
              return; // Exit the handler if any field is empty
            }

            const newShippingAddress = `${streetName} ${unitNo}, ${postalCode}`;
              try {
              // Update the shipping address using authService
              await this.authService.updateShippingAddress(this.user, newShippingAddress);
              console.log(newShippingAddress)
              this.fetchUserProfile();
            } catch (error) {
              console.error('Failed to update shipping address:', error);
            }
          }
        }
      ],        
    });
    alert.present().then(() => {
    });

    }
  }
}