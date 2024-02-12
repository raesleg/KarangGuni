import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
//import { BrowserQRCodeReader } from '@zxing/library';

@Component({
  selector: 'app-bin-locator',
  templateUrl: './bin-locator.page.html',
  styleUrls: ['./bin-locator.page.scss'],
})
export class BinLocatorPage implements OnInit, AfterViewInit {

  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  qrCodeImageSrc: string | ArrayBuffer | null = null;
  qrResultString: string = '';
  cameraStarted: boolean = false;
  videoStream: MediaStream | null = null;
  isScanning: boolean = false; // To track if scanning is in progress
  //private codeReader: BrowserQRCodeReader | null = null;

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // Now it's safe to use videoElement here if needed for initialization
  }

  async startCamera() {
    try {
      this.cameraStarted = true; // Move this before the getUserMedia call to ensure the video element is in the DOM.
      await this.waitForVideoViewInit(); // Wait for the video element to be available in the DOM.
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoElement.nativeElement.srcObject = stream;
      this.videoStream = stream;
    } catch (err) {
      this.cameraStarted = false;
      console.error("Error starting camera:", err);
    }
  }

  private waitForVideoViewInit(): Promise<void> {
    return new Promise(resolve => {
      if (this.videoElement) {
        resolve();
      } else {
        setTimeout(() => resolve(this.waitForVideoViewInit()), 50);
      }
    });
  }


  stopCamera() {
    if (this.videoStream) {
      const tracks = this.videoStream.getTracks();
      tracks.forEach(track => track.stop());
      this.cameraStarted = false;
      this.videoElement.nativeElement.srcObject = null;
      this.videoStream = null;
    }
  }

  // scanCode() {
  //   this.cameraStarted = true;
  //   this.isScanning = true;
  //   const codeReader = new BrowserQRCodeReader();
  //   codeReader.listVideoInputDevices()
  //     .then(videoInputDevices => {
  //       const deviceId = videoInputDevices[0].deviceId;
  //       codeReader.decodeOnceFromVideoDevice(deviceId, this.videoElement.nativeElement)
  //         .then(result => {
  //           this.qrResultString = result.getText();
  //           this.stopCamera();
  //           // Handle the QR code result here
  //           this.displayFile(this.qrResultString);
  //         })
  //         .catch(err => {
  //           console.error(err);
  //         });
  //     })
  //     .catch(err => {
  //       console.error(err);
  //     });
  // }

  // stopScanning() {
  //   if (this.videoStream) {
  //     // Stop all tracks on the video stream
  //     this.videoStream.getTracks().forEach(track => track.stop());
  //   }
  //   if (this.codeReader) {
  //     this.codeReader.reset(); // Reset the QR Code reader
  //     this.codeReader = null; // Clear the codeReader after resetting
  //   }
  //   // Set both scanning flags to false
  //   this.cameraStarted = false;
  //   this.isScanning = false;
  // }


  // displayFile(fileIdentifier: string) {
  //   // Here you would add the logic to retrieve and display the file
  //   // For example, if the identifier is a URL to an image:
  //   this.qrCodeImageSrc = fileIdentifier; // This would display the image if it's directly accessible
  // }

  // isImageFile(url: string): boolean {
  //   return /\.(jpg|jpeg|png|gif)$/.test(url);
  // }

  // isPdfFile(url: string): boolean {
  //   return /\.pdf$/.test(url);
  // }

  // isTextFile(url: string): boolean {
  //   // Assuming the QR code result is just plain text and not a URL
  //   return !this.isImageFile(url) && !this.isPdfFile(url);
  // }

  // onFileChange(event: Event) {
  //   // Reset the QR code result to ensure the old result is cleared
  //   this.qrResultString = '';
  //   this.qrCodeImageSrc = null; // Also clear the image source if needed

  //   const input = event.target as HTMLInputElement;
  //   const file = input.files ? input.files[0] : null;
  //   if (!file) {
  //     console.error('No file selected!');
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onload = (e: ProgressEvent<FileReader>) => {
  //     if (e.target?.result) {
  //       this.qrCodeImageSrc = e.target.result as string;
  //       // The rest of your existing logic
  //       setTimeout(() => {
  //         this.decodeQRCode(this.qrCodeImageSrc as string);
  //       }, 2000); // Wait for 2 seconds before attempting to decode
  //     } else {
  //       console.error('FileReader did not produce a result.');
  //     }
  //   };
  //   reader.readAsDataURL(file);
  // }

  // private decodeQRCode(imageSrc: string) {
  //   this.qrResultString = '';

  //   const imgElement = new Image();
  //   imgElement.src = imageSrc;
  //   imgElement.onload = () => {
  //     const codeReader = new BrowserQRCodeReader();
  //     codeReader.decodeFromImageElement(imgElement).then(result => {
  //       this.qrResultString = result.getText();
  //       // Process the result here
  //     }).catch(err => {
  //       console.error('Error decoding QR code:', err);
  //     });
  //   };
  // }

}