import { Component } from '@angular/core';
import { ModalController, AlertController, ActionSheetController } from '@ionic/angular';
import { GroupService } from '../shared/services/group.service';
import { Group } from '../shared/services/models/group';
import { FirebaseGroupsService } from '../shared/services/firebase-groups.service';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page {
  groups: Group[] =[];
  isAdministrator = false;

  constructor(
    private groupService: FirebaseGroupsService,
    private alertCtrl:AlertController,
    private actionSheetCtrl: ActionSheetController,
    private authService: AuthService,
    private router: Router
    ) {

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

  canDismissLogOut = async () => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure to Log Out?',
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    return role === 'confirm';
  };

  logout() {
    this.canDismissLogOut().then((confirmed) => {
      if (confirmed) {
        console.log('cleared')
        this.authService.logout();
        this.router.navigate(['login']);
          }
    });
  }

}
