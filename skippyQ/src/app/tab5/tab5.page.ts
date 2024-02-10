import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { AdminService } from '../shared/services/admin.service';
import { Profile } from '../shared/services/models/profile';
import { ActionSheetController, AlertController, IonSearchbar, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Product } from '../shared/services/models/product';
import { ProductService } from '../shared/services/product.service';

@Component({
  selector: 'app-tab5',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss']
})
export class Tab5Page {

  profile: Profile[] = [];
  filteredusers: Profile[] = [];
  userName: string | undefined;

  @ViewChild('searchBar', {static: false}) searchBar: IonSearchbar;

  constructor(
    private adminService : AdminService,
    private productService: ProductService,
    private alertCtrl: AlertController, 
    private actionSheetCtrl: ActionSheetController,
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router
  ) {}

  search(event){
    const text = event.target.value;
    this.adminService.getProfile().subscribe((allProfile: Profile[]) => {
      if (text && text.trim() !== '') {
        this.filteredusers = this.profile.filter(
          item => item.email.toLowerCase().includes(text.toLowerCase())
        );
      } else {
        this.filteredusers = this.profile
      }
    });  
    
  }

  refresh($event){
    this.searchBar.value = '';
    $event.target.complete();
    this.adminService.getProfile().subscribe((allProfile: Profile[]) => {
        this.filteredusers = this.profile
      })
    }

  canDismiss = async () => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure you want to suspend account?',
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


  async delete(item: Profile){

    const Banned_By = this.userName
    console.log(Banned_By)

    let alert = await this.alertCtrl.create({
      header: 'Reasons for Account Suspension',
      inputs: [
        {
          name: 'reasons',
          type: 'textarea',
          placeholder: 'State Reasons',
        },
      ],        
      buttons: [
      {
        text: 'OK',
        handler: async (data) => {
          const reasons = data.reasons || '';
          if (reasons === '') {
            const errorAlert = await this.alertCtrl.create({
              header: 'Error',
              message: 'Reasons must be stated',
              buttons: ['OK'],
            });
            errorAlert.present();
            return; 
          } 
          
            try {   
              this.canDismiss().then(async (confirmed) => {
                if (confirmed) {
                  await this.adminService.Banned(item, reasons, Banned_By).then(async () => {
                    console.log(item)
                    console.log(item.email)
                    this.adminService.delete(item)
                  });
                  console.log('reasons', reasons)
                  const toast = await this.toastController.create({
                    message: 'Account has been removed',
                    duration: 2000,
                    position: 'top',
                    color: 'primary'
                  });
                  toast.present();
          
                }
              });
               
          } catch (error) {
            console.error('Failed', error);
          }
        }
      }
    ],        
  });
  alert.present().then(() => {
  });
  }


  canDismissLogOut = async () => {
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
    this.canDismissLogOut().then((confirmed) => {
      if (confirmed) {
        // this.authService.clearUserData()
        console.log('cleared')
        this.authService.logout();
        this.router.navigate(['login']);
          }
    });
  }


  async ngOnInit() {

    this.adminService.getProfile()
    .subscribe(data => {
      this.profile = data.filter(item => item.isAdmin !== true);
      this.filteredusers = this.profile
      console.log(this.filteredusers)
    })

    this.authService.observeAuthState(user => {
      if (user && user.email) {
        // If a user is logged in, get the user profile
        this.authService.getUserProfile(user.email).then((profile) => {
          if (profile) {
            this.userName = profile.name;        

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
  
}
