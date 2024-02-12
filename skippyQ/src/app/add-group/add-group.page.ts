import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../shared/services/models/group';
import { FirebaseGroupsService } from '../shared/services/firebase-groups.service';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.page.html',
  styleUrls: ['./add-group.page.scss'],
})
export class AddGroupPage implements OnInit {
  submitted: boolean=false;
  addGroupForm: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, private groupService: FirebaseGroupsService) {
    this.addGroupForm = new FormGroup({
      photo: new FormControl(''),
      name: new FormControl('',[Validators.required]),
      about: new FormControl('',[Validators.required])
    });
   }

  ngOnInit() {
  }
  create() {
    console.log('create function called');
    this.submitted = true;
    if (this.addGroupForm.valid) {
      console.log('Form is valid');
    const grp = new Group(
      this.addGroupForm.value.name,
      this.addGroupForm.value.about,
      this.addGroupForm.value.photo,
      this.addGroupForm.value.name
    );
    console.log('Group object:', grp);
    this.groupService.create(grp);
    console.log('Navigation to tabs/tab4');
    console.log(this.addGroupForm.value.photo);
    
    this.router.navigate(['tabs/tab4']);
  }
}

}
