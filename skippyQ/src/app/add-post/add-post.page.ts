import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Post } from '../shared/services/models/post';
import { FirebasePostService } from '../shared/services/firebase-post.service';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { PerspectiveService } from '../shared/services/perspective.service';
import { Camera } from '@capacitor/camera';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
})
export class AddPostPage implements OnInit {
  segment: string = 'all';
  currentDate = new Date();
  addPostForm: FormGroup;
  submitted: boolean = false;
  selectedImageFile: File | null = null;
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  cameraStarted = false;
  mediaStream: MediaStream | null = null;
  capturedImage: string | null = null; // This will hold the image data URL for preview
  username: string = '';

  constructor(private router: Router, private postService: FirebasePostService, private perspectiveService: PerspectiveService, private userService: UserService) {
    this.addPostForm = new FormGroup ({
      // username: new FormControl('', Validators.required),
      // post_id: new FormControl('', Validators.required), // ID is required
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(10), // Minimum length for description
        Validators.maxLength(500)  // Maximum length for description
      ])
    });
   }

   async ngOnInit() {
    try {
      const userData = await this.userService.getUserData();
      this.username = userData?.name || 'Default Username'; // Fallback to 'Default Username' if not found
    } catch (error) {
      console.error('Error fetching user data:', error);
      this.username = 'Default Username'; // Fallback in case of an error
    }
  }
  

  async add() {
    this.submitted = true;
    if (this.addPostForm.valid) {
      const description = this.addPostForm.value.description;
  
    // Since the username is already fetched on component initialization, use it directly
    if (!this.username || this.username === 'Default Username') {
      console.error('Username not found for the provided email.');
      return;
    }

  
      // Now proceed with the rest of your post creation logic, using the fetched username
      const post = new Post(
        this.currentDate.toISOString(),
        description,
        'auto-generated-post-id', // Assuming you're generating post IDs differently or Firebase does it for you
        this.username,
        false, // liked status
      );
  
      // If there's an image to upload, do so, then add the post
      if (this.selectedImageFile) {
        const imageUrl = await this.postService.uploadFile(this.selectedImageFile);
        post.imageUrl = imageUrl;
      }
  
      try {
        await this.postService.add(post);
        console.log('Post added successfully');
        // Navigate to the posts page or reset the form as needed
        this.router.navigate(['tabs/tab2']);
      } catch (error) {
        console.error('Error during post submission:', error);
      }
    }
  }
  
  

  onImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.selectedImageFile = fileInput.files[0];
    }
  }

  startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          this.cameraStarted = true; // This will show the video element
          this.videoElement.nativeElement.srcObject = stream;
          this.mediaStream = stream;
        })
        .catch(err => {
          console.error("Error starting camera:", err);
        });
    } else {
      console.error("Camera not supported on this browser.");
    }
  }

  captureImage() {
    if (this.cameraStarted) {
      const video = this.videoElement.nativeElement;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/jpeg');
        this.capturedImage = dataUrl; // Set image data URL for preview

        // Create a blob from the data URL to upload
        fetch(dataUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'capture.jpeg', { type: 'image/jpeg' });
            this.selectedImageFile = file; // Set the file for upload
            this.stopCamera();
          });
      }
    }
  }

  stopCamera() {
    if (this.mediaStream) {
      const tracks = this.mediaStream.getTracks();
      tracks.forEach(track => track.stop());
      this.cameraStarted = false;
    }
  }

  handleImageUpload(file: File) {
    // Call the now public uploadFile method from your FirebasePostService
    this.postService.uploadFile(file).then(imageUrl => {
      // Handle the uploaded image URL
      // ... rest of your code for handling the upload
    }).catch(error => {
      console.error('Error uploading image:', error);
    });
  }
}