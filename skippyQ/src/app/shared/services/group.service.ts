import { Injectable } from '@angular/core';
import { Group } from './models/group';


@Injectable({
  providedIn: 'root'
})
export class GroupService {
  groups: Group[]=[]

  constructor() { 
    this.groups =[
      new Group ('grp1', 'im 1', 'assets/bip1.png','1'),
      new Group ('grp2', 'im 2', 'assets/bip2.jpg','2'),
      new Group ('grp3', 'im 3', 'assets/bip3.jpg','3'),
      new Group ('grp4', 'im 4', 'assets/bip4.jpg','4'),
      new Group ('grp5', 'im 5', 'assets/bip5.avif','5'),
    ]
  }
  getGroups(): Group[] {
    return this.groups;
  }
  delete(p: Group){
    const index = this.groups.findIndex(item => item.id == p.id);
     if (index >= 0) {
     this.groups.splice(index, 1);
     }
     }
     getGroupById(id: string): Group |undefined {
      return this.groups.find(item => item.id == id);
      }

    create(p: Group){
      this.groups.push(p);
    }
}
