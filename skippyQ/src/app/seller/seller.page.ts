import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../shared/services/models/product';
import { positiveNumber } from '../shared/services/positiveNumber';
import { Router } from '@angular/router';
import { ProductService } from '../shared/services/product.service';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../shared/services/auth.service';
// import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.page.html',
  styleUrls: ['./seller.page.scss'],
})
export class SellerPage implements OnInit {

  prodForm: FormGroup;
  categories: string[];
  conditions: string[];
  submitted: boolean = false;
  selectedImage: File | undefined;
  selleruserName: string | undefined;
  selleruserid: string | undefined;

  constructor(private router: Router, private productService: ProductService, private toastController: ToastController,private authService: AuthService) {
    this.categories = ['Electronics', 'Home Appliances', 'Beauty', 'Healthcare', 'Furniture', 'Toys & Games', 'Sports', 'Books', 'Clothing', 'Others']; //add category seelct options use *ngFor in html
    this.conditions = ['Brand New', 'Used']
    this.prodForm = new FormGroup({
      model: new FormControl('', [Validators.required]), //VALIDATORS REQUIRED
      name: new FormControl('', [Validators.required]), //VALIDATORS REQUIRED
      price: new FormControl(0, [positiveNumber, Validators.required]),
      conditions: new FormControl('None', [Validators.required]),
      details: new FormControl('', [Validators.required]), //VALIDATORS REQUIRED
      categories: new FormControl('None', [Validators.required])
    })

    // const currentUser = this.authService.getCurrentUser();
    // if (currentUser && currentUser.email) {
    //   try {
    //     this.authService.getUserProfile(currentUser.email).then((profile) => {
    //       // Use the retrieved profile to get the name
    //       if (profile) {
    //         this.selleruserid = profile.userID;
    //         this.selleruserName = profile.name
    //         console.log('Seller User ID:', this.selleruserid)
    //         console.log('seller name', this.selleruserName);
    //       } else {
    //         console.log('User profile not found');
    //       }
    //       return {
    //         selleruserid : this.selleruserid,
    //         sellerusername : this.selleruserName
    //       }
    //     });
    //   } catch (error) {
    //     console.error('Error fetching user profile:', error);
    //   }
    // } else {
    //   console.log('Could not get current user');
    // }

  }

  async ngOnInit() {
    this.authService.observeAuthState(user => {
      if (user && user.email) {
        // If a user is logged in, get the user profile
        this.authService.getUserProfile(user.email).then((profile) => {
          if (profile) {
            this.selleruserid = profile.userID;
            this.selleruserName = profile.name
            console.log('Seller User ID:', this.selleruserid)
            console.log('seller name', this.selleruserName);
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

  onFileSelected(event : any): void {
    this.selectedImage = event.target.files[0];
  }

  async add(){
    this.submitted = true;

    if(this.prodForm.valid){ //only add if form is valid
      if (this.selectedImage) {
        this.productService.uploadImage(this.selectedImage).then(async (downloadUrl) => {
          console.log('Image uploaded. Download URL:', downloadUrl);
      
          const prod = new Product(
            this.prodForm.value.model,
            this.prodForm.value.name,
            this.prodForm.value.price,
            downloadUrl, //image
            this.prodForm.value.conditions,
            this.prodForm.value.details,
            this.prodForm.value.categories,
            "Available",
            "False",
            this.selleruserName,
            this.selleruserid, //userid
            "",
            // this.prodForm.value.name,
            this.prodForm.value.name); //id
          console.log(prod)
          this.productService.add(prod);

          const toast = await this.toastController.create({
            message: prod.name + ' has been added to listing',
            duration: 2000,
            position: 'top',
            color: 'primary'
          });
          toast.present();
      
          this.router.navigate(['tabs/tab2']);
        })
      } else {
        const toast = await this.toastController.create({
          message: 'Product Image Required',
          duration: 2000,
          position: 'top',
          color: 'primary'
        });
        toast.present();

      }
    }

    // async onFileChange(event: any){
    //   const file = event.target.files[0];
    //   const reader = new FileReader();
    //   reader.readAsDataURL(file);
    //   reader.onload = () => {
    //     this.photo = reader.result as string;
    //   };

    //   this.imageURL = this.photo.dataUrl

    //   console.log(this.imageURL)

  
  
  }
// }


    // this.image = file.dataUrl;
    // const blob = this.dataURLtoBlob(file.dataUrl);
    // const url = await this.uploadImage(blob, file);
    // console.log(url)

  //   const path = `uploads/${new Date().getTime()}_${file.name}`;

  //   this.productService.uploadImage(file, path).subscribe(() => {
  //     // Image uploaded successfully, get the download URL
  //     this.productService.getDownloadURL(path).subscribe((url) => {
  //       // Update the form's imageUrl field
  //       this.prodForm.patchValue({ imageUrl: url });
  //     });
  //   });
  // }

  // dataURLtoBlob(dataurl: any) {
  //   var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
  //       bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  //   while(n--){
  //       u8arr[n] = bstr.charCodeAt(n);
  //   }
  //   return new Blob([u8arr], {type:mime});
  // }

  // async uploadImage(blob: any, imageData: any) {
  //   try {
  //     const currentDate = Date.now();
  //     const filePath = `productImages/${currentDate}.${imageData.format}`;
  //     const fileRef = ref(this.storage, filePath);
  //     const task = await uploadBytes(fileRef, blob);
  //     console.log('task: ', task);
  //     const url = getDownloadURL(fileRef);
  //     return url;
  //   } catch(e) {
  //     throw(e);
  //   }    
  // }

  // addDocument(path: any, data: any) {
  //   const dataRef = collection(this.firestore, path);
  //   return addDoc(dataRef, data);
  // }

// }
}
