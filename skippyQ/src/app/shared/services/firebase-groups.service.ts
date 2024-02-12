import { Injectable } from '@angular/core';
import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/storage';

import { Observable } from 'rxjs';
import { Group } from './models/group';
import { Event } from './models/event';


@Injectable({
  providedIn: 'root'
})
export class FirebaseGroupsService {
  private groupsRef = firebase.firestore().collection("groups");
  private eventsRef = firebase.firestore().collection("events");

getEvents(): Observable<any>{
  return new Observable((observer)=>{
    this.eventsRef.onSnapshot((querySnapshot)=>{
      let events : Event[]=[];
      querySnapshot.forEach((doc) => {
        let data =doc.data();
        let p = new Event(data['name'], data['about'], data['date'], data['location'], data['status'],data['Pgroup'],doc['id']);

        events.push(p);

      });
      observer.next(events);
    });
  });
}

  getGroups(): Observable<any> {
    return new Observable((observer) => {
    this.groupsRef.onSnapshot((querySnapshot) => {
    let groups: Group[] = [];
    querySnapshot.forEach((doc) => {
    let data = doc.data();
    let p = new Group(data['name'], data['about'], data['image'],
   doc['id'],data['creator'],data['members']);

   if (data['image']) {
    p.imagePath = data['image'];
    const imageRef =
   firebase.storage().ref().child(data['image']);
    imageRef.getDownloadURL()
    .then(url => {
    p.image = url;
    }).catch(error => {
    console.log('Error: Read image fail ' + error);
    });
    }
   
    groups.push(p);
    });
    observer.next(groups);
    });
    });
    } 
    // try {
    //   const querySnapshot = await this.groupsRef.doc(id).get();
      
    //   if (querySnapshot){
    //     const data = querySnapshot.data() as Group;
    //     return Promise.resolve(data);
    //   } else {
    //     console.log('Reward with ID $(id) not found in Group collection')
    //     return Promise.resolve({} as Group);
    //   } 
    // }
    //   catch (error) {
    //     console.error('Error getting user rewards', error);
    //     throw error;
    // }
    getGroupById(id: string): Promise<Group> {
      return this.groupsRef.doc(id).get().then((doc) => {
         console.log('Firestore Document Data:', doc.data());

         if (doc.exists) {
          const data = doc.data() as Group;

          if (data!['image']) {
            data.imagePath = data!['image'];
            const imageRef = firebase.storage().ref().child(data!['image']);
            imageRef.getDownloadURL()
            .then(url => {
            data.image = url;
            // Tell the subscriber that image is updated
      
            console.log('Image is ' + data.image);
            }).catch(error => {
              console.log('Error: Read image fail ' + error);
            });
          }
          return data;
        } else {
          console.log('Group ID ${id} not found in Group collection');
          return {} as Group;
        }
      // let data = doc.data();
      // let p = new Group(data!['name'], data!['about'], data!['image'], doc!['id'],data!['creator'],data!['members']);

      // console.log('Members Array:',data!['members']);
      // console.log(data!['image']);
  
      // If there's image, read from Firebase Storage
         
      });
      }

      update(g: Group){
        const currentUser = firebase.auth().currentUser;
        if (currentUser){
        const ref = this.groupsRef.doc(g.id);
        ref.update({
          name: g.name,
          about: g.about,
        }); 
      } else{ 
        console.error('No user is logged in')
      }
        
      }

      delete(g: Group){
        const ref = this.groupsRef.doc(g.id);
        ref.get().then(doc=>{
          if (doc.exists)
          ref.delete(); 
        });
      }

      create(g: Group) {
        const currentUser = firebase.auth().currentUser;

        if (currentUser){
          this.groupsRef.add({
          name: g.name,
          about: g.about,
          image: g.image,
          creator: currentUser.email,
          members: [currentUser.email],
      });
    } else{ 
      console.error('No user is logged in')
    }
      }

    createE(groupId: string,e: Event){
      this.eventsRef.add({
        name: e.name,
        about: e.about,
        date: e.date,
        location: e.location,
        status: e.status,
        Pgroup: groupId 
      })
    }
    
    joinGroup(groupId: string) {
      const currentUser = firebase.auth().currentUser;
      console.log('Current User:', currentUser);
      console.log('Group ID:', groupId);
    
      if (currentUser) {
        const groupRef = this.groupsRef.doc(groupId);
    
        groupRef.update({
          members: firebase.firestore.FieldValue.arrayUnion(currentUser.email),
        })
        .then(() => {
          console.log('User joined group successfully.');
        })
        .catch((error) => {
          console.error('Error joining group:', error);
        });
      }
    }

    approveEvent(eventId: string) {
      const eventRef = this.eventsRef.doc(eventId);
  
      eventRef.update({
        status: 'approved'
      });
    }

    rejectEvent(eventId: string) {
      const eventRef = this.eventsRef.doc(eventId);
  
      eventRef.update({
        status: 'rejected'
      });
    }

    pendEvent(eventId: string) {
      const eventRef = this.eventsRef.doc(eventId);
  
      eventRef.update({
        status: 'pending'
      });
    }
    deleteE(eventId:string){
      const ref = this.eventsRef.doc(eventId);
      ref.get().then(doc=>{
        if (doc.exists)
        ref.delete(); 
      });
    }

    getMembers(groupId: string): Observable<string[]> {
      return new Observable((observer) => {
        this.groupsRef
          .doc(groupId)
          .get()
          .then((doc) => {
            const data = doc.data();
            if (data && data['members']) {
              observer.next(data['members'] as string[]);
            } else {
              observer.next([]);
            }
          })
          .catch((error) => {
            console.error('Error getting members:', error);
            observer.next([]);
          });
      });
    }


    

  constructor() { }
}
