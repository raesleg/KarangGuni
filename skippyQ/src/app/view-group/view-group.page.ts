import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseGroupsService } from '../shared/services/firebase-groups.service';
import { Group } from '../shared/services/models/group';
import firebase from 'firebase';
import { Event } from '../shared/services/models/event';
import { Observable } from 'rxjs';
import 'firebase/firestore';
import 'firebase/storage';


@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.page.html',
  styleUrls: ['./view-group.page.scss'],
})
export class ViewGroupPage implements OnInit {
  groupId: string;
  group: Group|undefined;
  groupImage: string|undefined;
  grpabt: string|undefined;
  grpname: string|undefined;
  isCreator: boolean   =false;
  creator: string|undefined;
  isNotMember: boolean=true;
  members: string[] | undefined;
  events: Event[]=[];



  constructor(private route: ActivatedRoute, private router: Router, private groupService: FirebaseGroupsService) {
    this.groupId = this.route.snapshot.params['id'];
    this.groupService.getEvents().subscribe(data =>{this.events =data; });

   }
   

  async ngOnInit() {
    await this.groupService.getGroupById(this.groupId).then((data) => {
      console.log('Retrieved Data: ',data);
      this.group = data;

      if (this.group) {
       
        this.groupImage = this.group.image;
        this.grpabt = this.group.about || '';
        this.grpname = this.group.name || '';
        this.creator=this.group.creator;
         this.members=this.group.members;
       // this.groupService.getMembers(this.groupId).subscribe((members)=>{
        //  this.members=members;
       // });

        const currentUser = firebase.auth().currentUser;
        if (currentUser && this.creator === currentUser.email) {
          this.isCreator = true;
        }
        if (currentUser?.email && this.group.members.includes(currentUser.email.trim().toLowerCase() as string)){
          this.isNotMember =false;
        }


        if (currentUser) {
          console.log('currentUser exists');
        
          if (currentUser.email) {
            console.log('currentUser.email exists');
        
            if (this.group.members) {
              console.log('this.group.members exists');
        
              if (this.group.members.includes(currentUser.email as string)) {
                console.log('User is a member');
                this.isNotMember = false;
              } else {
                console.log('User is NOT a member');
              }
        
            } else {
              console.log('this.group.members is null or undefined');
            }
        
          } else {
            console.log('currentUser.email is null or undefined');
          }
        
        } else {
          console.log('currentUser is null');
        }

        console.log('Current User Email:', currentUser!.email);
        console.log('Members Array:', this.members);
  
      }
    });

    

  }
  joinGroup() {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      const groupId = this.groupId;
      this.groupService.joinGroup(groupId);
      
    }
  }

  


}
