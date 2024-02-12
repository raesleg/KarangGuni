import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../shared/services/models/product';
import { positiveNumber } from '../shared/services/positiveNumber';
import { ProductService } from '../shared/services/product.service';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
})
export class EditProductPage implements OnInit {

  updateForm: FormGroup;
  product: Product |undefined;
  productId: string=""; //defining productId as a empty string
  category: string[]|undefined;
  conditions: string[]|undefined;
  submitted: boolean = false;
  selectedImage: File | undefined;
  image: string | undefined;
  selleruserName: string | undefined;
  selleruserid: string | undefined;

  constructor(
    private route: ActivatedRoute, 
    private productService: ProductService, 
    private router: Router, 
    private toastController: ToastController,
    private authService: AuthService
    ) {
    this.productId = this.route.snapshot.params['id'];
    console.log('id',this.productId)
    this.category = ['Electronics', 'Home Appliances', 'Beauty', 'Healthcare', 'Furniture', 'Toys & Games', 'Sports', 'Books', 'Clothing', 'Others']; //add category seelct options use *ngFor in html
    this.conditions = ['Brand New', 'Used']
    this.updateForm = new FormGroup({
      model: new FormControl('', [Validators.required]), //VALIDATORS REQUIRED
      name: new FormControl('', [Validators.required]), //VALIDATORS REQUIRED
      price: new FormControl(0, [positiveNumber, Validators.required]),
      image: new FormControl('', [Validators.required]), //VALIDATORS REQUIRED
      conditions: new FormControl('None', [Validators.required]),
      details: new FormControl('', [Validators.required]), //VALIDATORS REQUIRED
      category: new FormControl('None', [Validators.required])
    })
   }

   async ngOnInit() {
    this.authService.observeAuthState(user => {
      if (user && user.email) {
        // If a user is logged in, get the user profile
        this.authService.getUserProfile(user.email).then((profile) => {
          if (profile) {
            this.selleruserid = profile.userID
            this.selleruserName = profile.name;
            console.log('Seller User Name:', this.selleruserName);

            this.productService.getProductByID(this.productId)
            .subscribe(data => {
             this.product = data;

              console.log(data)
              if (this.product) {
                this.updateForm.controls['model'].setValue(this.product.model)
                this.updateForm.controls['name'].setValue(this.product.name);
                this.updateForm.controls['price'].setValue(this.product.price);
                this.updateForm.controls['image'].setValue(this.product.image)
                this.updateForm.controls['conditions'].setValue(this.product.conditions)
                this.updateForm.controls['details'].setValue(this.product.details);
                this.updateForm.controls['category'].setValue(this.product.category);
              }});
            
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

  private readFileAsDataURL(file: File): void {
    const reader = new FileReader();
  
    reader.onloadend = () => {
      // 'result' contains the data URL
      this.image = reader.result as string;
    };
  
    reader.readAsDataURL(file);
  }

  onFileSelected(event : any): void {
    this.selectedImage = event.target.files[0];
    const file: File = event.target.files[0];
    this.readFileAsDataURL(file);
  }

  async update() {
    this.submitted = true;

    if(this.updateForm.valid){ //only add if form is valid

      console.log('check id', this.productId)
      if (this.selectedImage) {
        this.productService.uploadImage(this.selectedImage).then(async (downloadUrl) => {
          console.log('Image uploaded. Download URL:', downloadUrl);

          const prod = new Product(
            this.updateForm.value.model,
            this.updateForm.value.name,
            this.updateForm.value.price,
            downloadUrl,// this.updateForm.value.image,
            this.updateForm.value.conditions,
            this.updateForm.value.details, 
            this.updateForm.value.category,
            "Available",
            "False",
            this.selleruserName,
            this.selleruserid,
            "",
            // "",
            this.productId); //p.id needs to be defined
          this.productService.update(prod);

          console.log(this.productId)
          console.log(prod)

          const toast = await this.toastController.create({
            message: prod.name + 'has been added to listing',
            duration: 2000,
            position: 'top',
            color: 'primary'
          });
          toast.present();
      
          this.router.navigate(['tabs/tab2']);
        })
      } else {
        const prod = new Product(
          this.updateForm.value.model,
          this.updateForm.value.name,
          this.updateForm.value.price,
          this.updateForm.value.image,// this.updateForm.value.image,
          this.updateForm.value.conditions,
          this.updateForm.value.details, 
          this.updateForm.value.category,
          "Available",
          "False",
          this.selleruserName,
          this.selleruserid,
          "",
          // "",
          this.productId); //p.id needs to be defined
        
        this.productService.update(prod);
        // this.router.navigate(['tabs/tab2']);
        this.router.navigate(['tabs/tab2'], { queryParams: { segment: 'listing' } }); // Pass segment as a parameter

        console.log(prod)

        const toast = await this.toastController.create({
          message: prod.name + ' has been updated',
          duration: 2000,
          position: 'top',
          color: 'primary'
        });
        toast.present();
    

      }
    } else {
      console.log('form not valid')
    }
  }
}