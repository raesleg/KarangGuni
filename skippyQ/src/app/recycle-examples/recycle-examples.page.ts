import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-recycle-examples',
  templateUrl: './recycle-examples.page.html',
  styleUrls: ['./recycle-examples.page.scss'],
})
export class RecycleExamplesPage implements OnInit {
  @Input() view: string;
  @Input() examples: string[] = [];

  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }

  ngOnInit() {
  }

}
