import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, LoadingController, ToastController } from '@ionic/angular';
import * as tf from '@tensorflow/tfjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import * as tmImage from '@teachablemachine/image';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image-sort',
  templateUrl: './image-sort.page.html',
  styleUrls: ['./image-sort.page.scss'],
})
export class ImageSortPage implements OnInit {
  @ViewChild('webcamContainer') webcamContainer: ElementRef;
  @ViewChild('labelContainer') labelContainer: ElementRef;
  isLiveCtnSelected: boolean = false;

  liveModel;
  webcam;
  maxPredictions;
  currentPrediction: any;
  predictions: { className: string; probability: number }[] = [];
  // the link to your model provided by Teachable Machine export panel
  URL = "https://teachablemachine.withgoogle.com/models/6a_z-JlMz/";
  fileModel: tf.LayersModel;
  selectedFile: File;
  img = '';
  photo: string;
  classLabels: string[] = ["Paper", "Glass", "Plastic", "E-waste", "Cardboard", "Multi", "Metal"]
  
    constructor(
      public loadingController: LoadingController,
      public toastController: ToastController,
      private actionSheetController: ActionSheetController,
      public router: Router
    ) { }
  
    async ngOnInit() {
      // Load your Teachable Machine model File input
      const modelURL = '/assets/tm/model.json';
      this.fileModel = await tf.loadLayersModel(modelURL);
      this.maxPredictions = this.fileModel.outputs[0].shape[1];
    }

    async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePhoto(CameraSource.Photos);
          },
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePhoto(CameraSource.Camera);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async takePhoto(source: CameraSource) {
    if (source === CameraSource.Camera) {
      // Initialize the webcam when using the camera
      await this.startCamera();
      this.isLiveCtnSelected = true;
    } else {
      // Use the Capacitor Camera API for non-camera sources
      const options = {
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: source,
      };
  
      const image = await Camera.getPhoto(options);
  
      if (image) {
        const imageData = image.dataUrl;
        this.img = imageData;
        this.predictFile();
      } else {
        // Handle case where the user cancels the camera action
      }
    }
  }


//---------------------WEBCAM METHOD------------------

  // Load the image model and setup the webcam
  async startCamera() {
    if (!this.webcamContainer || !this.labelContainer) {
      console.error('Webcam container or label container not found.');
      return;
    }
    const modelURL = this.URL + "model.json";
    const metadataURL = this.URL + "metadata.json";

    // load the model and metadata
    this.liveModel = await tmImage.load(modelURL, metadataURL);
    this.maxPredictions = this.liveModel.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    this.webcam = new tmImage.Webcam(350, 400, flip); // width, height, flip
    await this.webcam.setup(); // request access to the webcam
    await this.webcam.play();
    window.requestAnimationFrame(() => this.loop());

    // append elements to the DOM
    this.webcamContainer.nativeElement.appendChild(this.webcam.canvas);
    for (let i = 0; i < this.maxPredictions; i++) { // and class labels
      this.labelContainer.nativeElement.appendChild(document.createElement("div"));
    }
  }

  loop() {
    this.webcam.update(); // update the webcam frame
    this.predictLive();
    window.requestAnimationFrame(() => this.loop());
  }

  // run the webcam image through the image model
  async predictLive() {
    // predict can take in an image, video, or canvas HTML element
    if (!this.liveModel || !this.webcam) {
      console.error('Model or webcam not initialized.');
      return;
    }

    // predict can take in an image, video, or canvas HTML element
    const prediction = await this.liveModel.predict(this.webcam.canvas);
    if (!this.labelContainer) {
      console.error('Label container not found.');
      return;
    }
    for (let i = 0; i < this.maxPredictions; i++) {
      const classPrediction =
        prediction[i].className + ": " + prediction[i].probability.toFixed(2);
      this.labelContainer.nativeElement.childNodes[i].innerHTML = classPrediction;
    } 
    // Store the prediction with the highest probability
    const maxProbabilityIndex = prediction.findIndex(p => p.probability === Math.max(...prediction.map(p => p.probability)));
    this.currentPrediction = prediction[maxProbabilityIndex].className;
  }

  async capturePrediction() {
    if (this.currentPrediction) {
      // Navigate to another page with the captured prediction
      // You should replace 'your-other-page' with the actual route/path of the other page
      this.router.navigate(['/recycle-info/', this.currentPrediction]);
    } else {
      // Handle the case where there is no prediction available
      console.error('No prediction available.');
    }
  }


//---------------------- FILE METHOD ---------------------------
  resetImage() {
    this.img = '';  // Reset image
  }

  async predictFile() {
    try {
      // Ensure the model is loaded
      if (!this.fileModel) {
        console.error('Model not loaded.');
        return;
      }
  
      // Load the image
      const img = new Image();
      img.src = this.img;
  
      // Wait for the image to load
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
      });
  
      // Resize the image to match the expected input size of your model
      const resizedImg = this.resizeImage(img, 224, 224);
  
      // Preprocess the image and convert it to a tensor
      const tensor = tf.browser.fromPixels(resizedImg).toFloat().expandDims();
      console.log('Resized Image Shape:', resizedImg.width, resizedImg.height);
      console.log('Tensor Shape:', tensor.shape);
      // Normalize the pixel values to the range [0, 1]
      tensor.div(tf.scalar(255));
  
      // Make the prediction using the model
      const prediction = this.fileModel.predict(tensor) as tf.Tensor;
      const probabilities = prediction.dataSync() as Float32Array;
  
      // Display or use the prediction probabilities as needed
      console.log('Prediction Probabilities:', probabilities);
  
      const maxProbabilityIndex = probabilities.indexOf(Math.max(...probabilities));
      this.currentPrediction = maxProbabilityIndex + 1; // Assuming class indexing starts from 1
      console.log(`Predicted Class: ${this.currentPrediction}`);

      if (this.classLabels && Array.isArray(this.classLabels)) {
        const predictedLabel = this.classLabels[this.currentPrediction - 1];
    
        if (predictedLabel !== undefined) {
          console.log(`Predicted Label: ${predictedLabel}`);
          this.router.navigate(['/recycle-info/', predictedLabel]).then(() => {
            this.resetImage();
          });

        } else {
          console.error('Invalid predicted label:', predictedLabel);
        }
      } else {
        console.error('Invalid or undefined classLabels array.');
      }

    } catch (error) {
      console.error('Error during prediction:', error);
    }
  }
  
  resizeImage(img: HTMLImageElement, newWidth: number, newHeight: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
    return canvas;
  }  

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000,
    });
    toast.present();
  }
}
