import { Component, OnInit } from '@angular/core';
import { RecycleService } from '../shared/services/recycle.service';
import { ActivatedRoute } from '@angular/router';
import { RecycleInfo } from '../shared/services/models/recycleInfo';
import { AuthService } from '../shared/services/auth.service';
import { ModalController } from '@ionic/angular';
import { RecycleExamplesPage } from '../recycle-examples/recycle-examples.page';

@Component({
  selector: 'app-recycle-info',
  templateUrl: './recycle-info.page.html',
  styleUrls: ['./recycle-info.page.scss'],
})
export class RecycleInfoPage implements OnInit {
category: string;
info: RecycleInfo;
currentIndex: number = 0;
slideOpts = {
  initialSlide: 1,
  speed: 400,
};
isAdmin: boolean = false;

  constructor(private route: ActivatedRoute, private recycleService: RecycleService,
    private modalController: ModalController) {

    this.category = this.route.snapshot.params['id'];
    this.recycleService.getRecycleInfoById(this.category).then((info) => {
      if (info) {
        this.info = info;
        console.log(this.info);
      }
    });
  }

  ngOnInit() {
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.info.images.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.info.images.length) % this.info.images.length;
  }

  async openModal(view: string, examples: string[]) {
    const modal = await this.modalController.create({
      component: RecycleExamplesPage, 
      componentProps: {
        view: view,
        examples: examples, // Pass your data to the modal component
      },
      cssClass: 'custom-modal-class', // Add a custom class for styling
    });

    return await modal.present();
  }
  
}
