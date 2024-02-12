import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';
import { Event } from '../shared/services/models/event';
import { FirebaseGroupsService } from '../shared/services/firebase-groups.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-eventsapproval',
  templateUrl: './eventsapproval.page.html',
  styleUrls: ['./eventsapproval.page.scss'],
})
export class EventsapprovalPage implements OnInit {
  events: Event[]=[];
  filteredEvents: Event[] = [];
  selectedStatusFilter: string | null = null;

  constructor(private groupService: FirebaseGroupsService, private navCtrl: NavController) {
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

}