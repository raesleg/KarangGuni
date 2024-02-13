import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Group } from '../shared/services/models/group';
import { FirebaseGroupsService } from '../shared/services/firebase-groups.service';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.page.html',
  styleUrls: ['./add-group.page.scss'],
})
export class AddGroupPage implements OnInit {
  submitted: boolean = false;
  addGroupForm: FormGroup;
  image: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: FirebaseGroupsService
  ) {
    this.addGroupForm = new FormGroup({
      photo: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      about: new FormControl('', [Validators.required]),
    });
  }

  handleFileInput(event: any) {
    const fileInput = event.target;
    const file = fileInput.files && fileInput.files.length > 0 ? fileInput.files[0] : null;

    if (file) {
      const photoFormControl = this.addGroupForm.get('photo');
      if (photoFormControl) {
        photoFormControl.setValue(file);
      } else {
        console.error('FormGroup control "photo" not found.');
      }
    } else {
      console.error('No file selected.');
    }
  }

  ngOnInit() {}

  create() {
    console.log('create function called');
    this.submitted = true;

    if (this.addGroupForm.valid) {
      console.log('Form is valid');

      const file = this.addGroupForm.value.photo;

      // Use the Firebase Storage REST API to upload the file
      const storagePath = `group-photos/${new Date().getTime()}${file.name}`;
      const storageUrl = "https://firebasestorage.googleapis.com/v0/b/karang-guni-d3f15.appspot.com/o/${encodeURIComponent(storagePath)}?alt=media";

      const formData = new FormData();
      formData.append('file', file);

      // Perform the file upload using fetch
      fetch(storageUrl, {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          const downloadURL = data.downloadTokens
            ? `https://firebasestorage.googleapis.com/v0/b/karang-guni-d3f15.appspot.com/o/${encodeURIComponent(storagePath)}?alt=media&token=${data.downloadTokens}`
            : null;

          if (downloadURL) {
            // Now you can use downloadURL as needed (e.g., store it in Firestore)
            this.groupService.create({
              name: this.addGroupForm.value.name,
              about: this.addGroupForm.value.about,
              image: downloadURL,
              imagePath: '',
              id: '',
              creator: '',
              members: []
            });

            console.log('Group created successfully');
            this.router.navigate(['tabs/tab4']);
          } else {
            console.error('Failed to get download URL after upload.');
          }
        })
        .catch(error => {
          console.error('Error uploading file:', error);
        });
    }
  }
}