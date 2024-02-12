import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../shared/services/auth.service';
import { Product } from '../shared/services/models/product';
import { AdminService } from '../shared/services/admin.service';
import { ProductService } from '../shared/services/product.service';
import { Profile } from '../shared/services/models/profile';

@Component({
  selector: 'app-adminlisting',
  templateUrl: './adminlisting.page.html',
  styleUrls: ['./adminlisting.page.scss'],
})
export class AdminlistingPage implements OnInit {

  userID: string=""; 
  product: Product[] = [];
  sold: Product[] = [];
  violated: Product[] = [];
  profile: Profile[] = [];
  myorders: Product[] = [];

  constructor(
    private route: ActivatedRoute, 
    private adminService: AdminService,
    private productService: ProductService,
    private router: Router, 
    private toastController: ToastController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.userID = this.route.snapshot.params['userID'];
    console.log('id',this.userID)

    this.productService.getProducts()
    .subscribe(data => {
      this.product = data.filter(item => item.selleruserid === this.userID && item.status == "Available");
      this.myorders = data.filter(item => item.buyeruserid === this.userID && item.status == "Sold");
      this.sold = data.filter(item => item.selleruserid === this.userID && item.status == "Sold");
      this.violated = data.filter(item => item.selleruserid === this.userID && item.status == "Violated");
      
      console.log(this.product)
      console.log(this.sold)
    })
  }

  canDismisslisting = async () => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure to delete?',
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


  async delete(item: Product){

    try{

      this.canDismisslisting().then(async (confirmed) => {
        if (confirmed) {
            this.adminService.deleteListing(item)

            const toast = await this.toastController.create({
              message: 'Listing has been removed',
              duration: 2000,
              position: 'top',
              color: 'primary'
            });
            toast.present();
        }
      })
    } catch (error) {
        console.error('Failed', error);
    }
  }
  
  ngOnInit() {
     this.adminService.getUserProfile(this.userID).subscribe((profile) => {
      if (profile){
        this.profile = profile
        console.log(profile[0])
        console.log(profile)
        console.log(profile[0].ageRange)
      } else {
        console.log('Failed to return profile')
      }
    })
  }

}
