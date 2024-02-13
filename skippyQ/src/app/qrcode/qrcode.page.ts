import { Component, Input, OnInit, Directive, ElementRef, HostListener } from '@angular/core';
import { ModalController } from '@ionic/angular';
//import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})

export class QrcodePage implements OnInit {
  @Input() id: string;
  @Input() brand: string;
  @Input() value: 0;
  contentToCopy: string;

  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }

  ngOnInit() {
    if (this.brand === 'Grab') {
      this.contentToCopy = this.generateRandomId();
    }
  }

  generateRandomId(): string {
    // Generate a random string (5 characters)
    const randomString = Math.random().toString(36).substr(2, 5);

    const timestamp = Date.now();
    // Combine timestamp and random string to create the ID
    const randomId = `${timestamp}${randomString}`;

    return randomId;
  }
}