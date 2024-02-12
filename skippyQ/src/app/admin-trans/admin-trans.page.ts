import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../shared/services/admin.service';
import { ToastController } from '@ionic/angular';
import { Trans } from '../shared/services/models/trans';
import { ProductService } from '../shared/services/product.service';
import { Product } from '../shared/services/models/product';

@Component({
  selector: 'app-admin-trans',
  templateUrl: './admin-trans.page.html',
  styleUrls: ['./admin-trans.page.scss'],
})
export class AdminTransPage implements OnInit {

  transID: string="";
  trans: Trans;
  products: Product[] = [];

  constructor(
    private route: ActivatedRoute, 
    private adminService: AdminService,
    private productService: ProductService
  ) {
    this.transID = this.route.snapshot.params['id'];
    console.log('id',this.transID)

    this.adminService.getTransById(this.transID)
    .then((trans: Trans) => {
      this.trans = trans;
      console.log(trans)

      for (const productId of trans.productIds) {
        console.log(productId)
        this.productService.getProductByID(productId)
        .subscribe(data => {
        this.products.push(data);
        console.log(this.products)
      });
      }
    })
    .catch(error => {
      console.error('Error fetching trans:', error);
      // Handle error as needed
    });
  }

  ngOnInit() {
  }

}
