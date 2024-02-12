import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';
import { Event } from '../shared/services/models/event';
import { FirebaseGroupsService } from '../shared/services/firebase-groups.service';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-eventsapproval',
  templateUrl: './eventsapproval.page.html',
  styleUrls: ['./eventsapproval.page.scss'],
})
export class EventsapprovalPage implements OnInit {
  events: Event[]=[];
  filteredEvents: Event[] = [];
  selectedStatusFilter: string | null = null;

  constructor(
    private groupService: FirebaseGroupsService,
    private actionSheetCtrl: ActionSheetController,
    private authService: AuthService,
    private router: Router
    ) {
    this.groupService.getEvents().subscribe(data =>{this.events =data; 
      });
  }

  ngOnInit() {
  }

  approveEvent(eventId: string) {
    this.groupService.approveEvent(eventId);
  }

  rejectEvent(eventId: string) {
    this.groupService.rejectEvent(eventId);
  }

  pendEvent(eventId: string){
    this.groupService.pendEvent(eventId);
  }

  filterEvents() {
    console.log('Selected Status Filter first:', this.selectedStatusFilter);
    console.log('Filtered Events:', this.filteredEvents);
    if (this.selectedStatusFilter === "all") {
      this.filteredEvents = this.events;

      
    } else {

    this.filteredEvents = this.events.filter((event) => event.status === this.selectedStatusFilter);
    
  }
  console.log('Filtered Events after filtering:', this.filteredEvents);
  }

  deleteEvent(eventId: string) {
    this.groupService.deleteE(eventId);
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