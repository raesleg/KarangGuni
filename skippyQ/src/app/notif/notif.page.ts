import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../shared/services/product.service';
import { AuthService } from '../shared/services/auth.service';
import { ModalController, ToastController } from '@ionic/angular';
import { Product } from '../shared/services/models/product';
import { AdminService } from '../shared/services/admin.service';
import { Profile } from '../shared/services/models/profile';
import { Trans } from '../shared/services/models/trans';

@Component({
  selector: 'app-notif',
  templateUrl: './notif.page.html',
  styleUrls: ['./notif.page.scss'],
})
export class NotifPage implements OnInit {

  sold: Product[] = [];
  // notification: Product[] = [];
  profile: Profile[] = [];
  buyprofiles: Profile[] = [];
  trans: Trans[] = [];
  selleruserid: string ="";
  buyeruserid: string = "";
  unopenedNotifCount: number = 0;

  constructor(
    private productService: ProductService,
    // private alertCtrl: AlertController, 
    // private actionSheetCtrl: ActionSheetController,
    private authService: AuthService,
    private router: Router,
    private modalCtrl: ModalController,
    private adminService: AdminService
  ) {

  }

  ngOnInit() {

    this.authService.observeAuthState(user => {
      if (user && user.email) {
        // If a user is logged in, get the user profile
        this.authService.getUserProfile(user.email).then((profile) => {
          if (profile) {
            this.selleruserid = profile.userID;
            console.log('seller_Details', this.selleruserid);

            this.productService.getProducts()
            .subscribe(data => {
              // this.notification = data.filter(item => item.selleruserid === this.selleruserid && item.status == "Sold" && item.isShipped !== "True");
              this.sold = data.filter(item => item.selleruserid === this.selleruserid && item.status == "Sold");

            this.sold.forEach(product => {
              if (product.buyeruserid) {
                // Access the buyeruserid of each sold product
                this.buyeruserid = product.buyeruserid;
                console.log(this.buyeruserid);

                // Now you can use this.buyeruserid in other parts of your code
                this.adminService.getUserProfile(this.buyeruserid).subscribe((buyprofile) => {
                  if (buyprofile) {
                    // this.profile = profile;
                    // console.log(profile[0]);
                    // console.log(profile);
                    // console.log(profile[0].ageRange);
                    this.buyprofiles.push(buyprofile)
                    // this.unopenedNotifCount += this.notification.length;
                    console.log(this.buyprofiles)
                  } else {
                    console.log('Failed to return profile');
                  }
                });
              }
            });

            console.log(this.sold);
          });
        
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

  shipped(item: Product){
    this.productService.updateShipment(item)
  }

  close() {
    this.modalCtrl.dismiss();
  }


}
