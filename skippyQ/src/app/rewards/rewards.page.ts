import { Component, OnInit } from '@angular/core';
import { Voucher } from '../shared/services/models/voucher';
import { RewardService } from '../shared/services/reward.service';
import { VoucherService } from '../shared/services/voucher.service';
import { Reward } from '../shared/services/models/reward';
import { AuthService } from '../shared/services/auth.service';
import { ValidatorsService } from '../shared/services/validators.service';
import { AlertController, ModalController } from '@ionic/angular';
import { QrcodePage } from '../qrcode/qrcode.page';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.page.html',
  styleUrls: ['./rewards.page.scss'],
})
export class RewardsPage implements OnInit {
public segment = 'allVouchers'
vouchers: Voucher[]=[];
userRewards!: Reward;
myVouchers: Voucher[]=[];

  constructor(private authService: AuthService, private rewardService: RewardService, 
    private voucherService: VoucherService, private validatorService: ValidatorsService,
    private alertController: AlertController, private modalController: ModalController) { }

  async ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.email) {
      try {
        this.userRewards = await this.rewardService.getUserRewards(currentUser.email);
      } catch (error) {
        console.error('Error fetching user rewards:', error);
      }
    } else {
      console.log('Could not get current user');
    }

    await this.voucherService.getVouchers().subscribe(data => {
      this.vouchers = data;
      console.log('All vouchers: ', this.vouchers);
      this.myVouchers = ([] as Voucher[]).concat(...this.userRewards.voucherID.map(userVoucherId =>
        this.vouchers.filter((voucher: Voucher) => voucher.voucherID === userVoucherId)
      ));
      console.log('User vouchers: ', this.myVouchers);
    });
  }

  async addVoucher(voucherId: string, brand: string, value: number, pointsRequired: number){
    const alert = await this.alertController.create({
      header: brand + ' $' + value + ' voucher',
      message: 'Do you want to redeem this voucher for ' + pointsRequired + ' points?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Redeem',
          handler: async () => {
            try {
              // Check if the user has enough points
              if (this.userRewards.points >= pointsRequired) {
                this.rewardService.addVoucher(this.userRewards.userEmail, voucherId, pointsRequired)
                this.validatorService.presentToast('Voucher added successfully', 'success');
              }
              else {
                this.validatorService.presentToast('Insufficient points to redeem voucher', 'danger');
              }
            } catch (error) {
              this.validatorService.presentToast('Voucher could not be redeemed, ' + error, 'danger');
            }
          },
        },
      ],
    });
    await alert.present();
  
  }

  async useVoucher(voucherID: string, brand: string, value: number){
      const modal = await this.modalController.create({
        component: QrcodePage, 
        componentProps: {
          id: voucherID,
          brand: brand,
          value: value
        },
        cssClass: 'custom-modal-class',
      });
  
      return await modal.present();
  }

  refresh($event: { target: { complete: () => void; }; }) {
    $event.target.complete();
    this.ngOnInit();
  }

  segmentChanged(event: any) {
    this.segment = event.detail.value;
  }
  
}
