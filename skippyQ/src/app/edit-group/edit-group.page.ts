import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../shared/services/models/group';
import { FirebaseGroupsService } from '../shared/services/firebase-groups.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.page.html',
  styleUrls: ['./edit-group.page.scss'],
})
export class EditGroupPage implements OnInit {
  editGroupForm: FormGroup; 
  groupId: string;
  group: Group|undefined;
  groupImage: string|undefined;
  submitted:boolean =false;

  constructor(private route: ActivatedRoute, private router: Router, private groupService: FirebaseGroupsService) { 
    this.groupId = this.route.snapshot.params['id'];
    //this.group = this.groupService.getGroupById(this.groupId);
    //this.groupImage =this.group!.image;
    this.group = new Group('','0','');

    this.editGroupForm= new FormGroup({
      name: new FormControl('', [Validators.required]),
      about: new FormControl('',[Validators.required]),


    });

    this.groupService.getGroupById(this.groupId)
 .then(data => {
 this.group = data;
 if (this.group) {
 this.groupImage = this.group.image;
 this.editGroupForm.controls['name'].setValue(this.group.name);

   this.editGroupForm.controls['about'].setValue(this.group.about);


 }
 }); 

  }

  ngOnInit() {
  }

  update() {
    console.log('Update function called');
    this.submitted = true;
    if (this.editGroupForm.valid){
    const grp = new Group(
      this.editGroupForm.value.name,
      this.editGroupForm.value.about,
      this.editGroupForm.value.image,
      this.groupId);
    this.groupService.update(grp)
    this.router.navigate(['tabs/tab4']);
  }
  }


}
