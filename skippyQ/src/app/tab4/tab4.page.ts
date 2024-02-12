import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { GroupService } from '../shared/services/group.service';
import { Group } from '../shared/services/models/group';
import { FirebaseGroupsService } from '../shared/services/firebase-groups.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page {
  groups: Group[] =[];
  isAdministrator = false;

  constructor(private groupService: FirebaseGroupsService,private modalController: ModalController, private alertCtrl:AlertController) {
    //this.groups = this.groupService.getGroups();

   this.groupService.getGroups().subscribe(data =>{this.groups =data; });
   }

   async delete(item: Group) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Deletion',
      message: `Are you sure you want to delete ${item.name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Delete operation canceled');
          }
        },
        {
          text: 'Delete',
          handler: async () => {
            try {
              await this.groupService.delete(item);
              console.log('Group deleted successfully');
            } catch (error) {
              console.error('Error deleting group:', error);
              // Handle error (e.g., show an alert to the user)
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
  search(event: any) {
    const text = event.target.value.toLowerCase();
  
    this.groupService.getGroups().subscribe(allGroups => {
      if (text && text.trim() !== '') {
        this.groups = allGroups.filter((item: Group) => item.name.toLowerCase().includes(text));
      } else {
        this.groups = allGroups;
      }
    });
  }

}
