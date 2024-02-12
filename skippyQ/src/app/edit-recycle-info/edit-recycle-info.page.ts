import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecycleService } from '../shared/services/recycle.service';
import { RecycleInfo } from '../shared/services/models/recycleInfo';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-edit-recycle-info',
  templateUrl: './edit-recycle-info.page.html',
  styleUrls: ['./edit-recycle-info.page.scss'],
})
export class EditRecycleInfoPage implements OnInit {
  category: string;
  info: RecycleInfo;
  recycleInfoForm: FormGroup;
  
  constructor(private route: ActivatedRoute, 
    private recycleService: RecycleService,
    private router: Router,
    private fb: FormBuilder) {

    this.category = this.route.snapshot.params['id'];

    this.recycleInfoForm = this.fb.group({
      disclaimer: this.fb.array([]),
      types: this.fb.array([]),
      notOk: this.fb.array([]),
      //images: this.fb.array([])
    });
  }

  ngOnInit() {
    this.recycleService.getRecycleInfoById(this.category).then((info) => {
      if (info) {
        this.info = info;
        console.log(this.info);

        // Assuming this.info has the same structure as your form
        this.recycleInfoForm.patchValue(this.info);

        // If the disclaimer, types, notok, and images are arrays inside this.info,
        // you might need to iterate through them to populate the FormArrays
        this.populateFormArrays('disclaimer');
        this.populateFormArrays('types');
        this.populateFormArrays('notOk');
        this.populateFormArrays('images');
    }
  });
}

  get disclaimerFormArray() {
    return this.recycleInfoForm.get('disclaimer') as FormArray;
  }

  get typesFormArray() {
    return this.recycleInfoForm.get('types') as FormArray;
  }

  get notOkFormArray() {
    return this.recycleInfoForm.get('notOk') as FormArray;
  }

  // get imagesFormArray() {
  //   return this.recycleInfoForm.get('images') as FormArray;
  // }

  // Add item to a specific array
  addItem(arrayName: string) {
    const formArray = this.recycleInfoForm.get(arrayName) as FormArray;
    formArray.push(this.fb.control(''));
  }

  // Remove item from a specific array
  removeItem(arrayName: string, index: number) {
    const formArray = this.recycleInfoForm.get(arrayName) as FormArray;
    formArray.removeAt(index);
  }

  populateFormArrays(arrayName: string) {
    const formArray = this.recycleInfoForm.get(arrayName) as FormArray;
    const infoArray = this.info[arrayName] as string[]; // Assuming the array is of strings

    // Ensure formArray is initialized
    if (formArray) {
      // Clear existing controls in the formArray
      while (formArray.length !== 0) {
        formArray.removeAt(0);
      }

      // Push new controls based on infoArray
      if (infoArray !== null) {
        infoArray.forEach(item => {
          formArray.push(this.fb.control(item));
        });
      }
    }
  }

  async update() {
    // Validate the form before updating
    if (this.recycleInfoForm.valid) {
      // Update the form values to match the data structure of RecycleInfo
      const updatedInfo: RecycleInfo = this.recycleInfoForm.value;

      // Update the database
      try {
        await this.recycleService.updateRecycleInfo(this.category, updatedInfo);
        console.log('Recycle Info updated successfully.');

        // Optionally, navigate to another page after successful update
        this.router.navigate(['/text-sort']);
      } catch (error) {
        console.error('Error updating recycle info:', error);
      }
    } else {
      console.log('Form is not valid. Please check the form fields.');
    }
  }

  // onFileSelected(event: any, index: number) {
  //   const files = event.target.files;
  //   if (files && files.length > 0) {
  //     const imageUrls = [];
  //     for (let i = 0; i < files.length; i++) {
  //       const file = files[i];
  //       const imageUrl = URL.createObjectURL(file);
  //       imageUrls.push(imageUrl);
  //     }
  //     this.selectedImages[index] = imageUrls;
  //   }
  // }
}
