import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../shared/services/models/product';
import { PaymentService } from '../shared/services/payment.service';
import { AlertController} from '@ionic/angular';
import { ProductService } from '../shared/services/product.service';
import { Trans } from '../shared/services/models/trans';
import { Cart } from '../shared/services/models/cart';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  amount: number;
  user: string = ""
  transactionId = ""
  buyeruserid: string;
  buyeruserName: string;
  create_time: Date;
  trans: Trans[] = [];
  cart: Cart[] = [];
  buyercart: Cart[] = [];  

  @ViewChild('paymentRef', {static:true}) paymentRef!: ElementRef;
  constructor(
    private paymentService: PaymentService,
    private productService: ProductService, 
    private authService: AuthService,
    private router: Router, 
    private route: ActivatedRoute,
    private alertCtrl: AlertController
  ) { }

  ngOnInit(): void {

    this.authService.observeAuthState(user => {
      if (user && user.email) {
        // If a user is logged in, get the user profile
        this.authService.getUserProfile(user.email).then((profile) => {
          if (profile) {
            this.buyeruserid = profile.userID;
            this.buyeruserName = profile.name;
            console.log('details1', this.buyeruserid, this.buyeruserName);

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

    this.amount = +this.route.snapshot.paramMap.get('total');
    this.user = this.route.snapshot.paramMap.get('user');    

    window.paypal.Buttons(
      {
        style:{
          layout: 'horizontal',
          color:'blue',
          shape:'rect',
          label:'paypal',
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount:{
                  value: (this.amount).toString(),
                  currency_code: 'SGD'
                }
              }
            ]
          })
        },
        onApprove: (data: any, actions: any, item: Product) => {
          return actions.order.capture().then(async (details : any) =>{
            if (details.status === 'COMPLETED'){
              this.paymentService.transactionID = details.id;
              this.transactionId = this.paymentService.transactionID
              this.create_time = details.create_time
              console.log(this.create_time)
              console.log('trans id', this.transactionId)
              console.log('buyeridpayment', this.buyeruserid)

              this.productService.addtoTrans(this.create_time, 'SGD', this.amount, this.buyeruserid, this.transactionId, this.buyercart)
              this.productService.updateBuyer(item, this.buyeruserid)

              this.router.navigate(['tabs/tab2']).then(async () => {
                this.transactionId = details.id
                console.log('trans2', this.transactionId)
                let alert = await this.alertCtrl.create({
                  header: 'Transaction is successful.',
                  message: this.transactionId,
                  buttons: ['OK']
                });
                alert.present().then(() => {
                  console.log(this.buyercart['productid'])
                  console.log(this.user)
                  this.productService.removeCartAll(this.buyercart['productid'], this.user);
                });
              })
            }
          });
        },
        onError: (error: any) => {
          console.log(error)
        }
      }
    ).render(this.paymentRef.nativeElement);
  }

  cancel(){
    this.router.navigate(['tabs/tab2'])
  }

}
