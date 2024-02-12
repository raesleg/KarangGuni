import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseGroupsService } from '../shared/services/firebase-groups.service';
import { Event } from '../shared/services/models/event';

@Component({
  selector: 'app-add-events',
  templateUrl: './add-events.page.html',
  styleUrls: ['./add-events.page.scss'],
})
export class AddEventsPage implements OnInit {
  groupId: string;

  submitted: boolean=false;
  addEventForm: FormGroup;
  constructor(private route: ActivatedRoute, private router: Router, private eventService: FirebaseGroupsService) { 
    this.groupId = this.route.snapshot.params['id'];
    this.addEventForm = new FormGroup({
      name: new FormControl('',[Validators.required]),
      about: new FormControl('',[Validators.required]),
      date: new FormControl('',[Validators.required]),
      location: new FormControl('',[Validators.required]),
      
    });
  }

  ngOnInit() {
  }
  createE() {
    console.log('create function called');
    this.submitted = true;
    if (this.addEventForm.valid) {
      console.log('Form is valid');
    const groupId = this.groupId;
    const evt = new Event(
      this.addEventForm.value.name,
      this.addEventForm.value.about,
      this.addEventForm.value.date,
      this.addEventForm.value.location,
      'pending'
    );

    this.eventService.createE(groupId, evt);
   
    
    this.router.navigate(['tabs/tab4']);
  }
}

}
