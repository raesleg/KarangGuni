import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Observable } from 'rxjs';
import { RecycleInfo } from './models/recycleInfo';

@Injectable({
  providedIn: 'root'
})
export class RecycleService {
recycleInfoRef = firebase.firestore().collection('recycleInfo');

  constructor() { }

  getAllRecycleInfo(): Observable<RecycleInfo[]> {
    return new Observable((observer) => {
      this.recycleInfoRef.onSnapshot(async (querySnapshot) => {
        let recycleInfos: RecycleInfo[] = [];
  
        for (const doc of querySnapshot.docs) {
          let data = doc.data();
          let recycleInfo = new RecycleInfo(
            doc.id,
            data['types'],
            data['disclaimer'],
            data['notOk'],
            data['thumbnail'],
            data['images']
          );
  
          if (data['thumbnail']) {
            const imageRef = firebase.storage().ref().child(data['thumbnail']);
            try {
              const url = await imageRef.getDownloadURL();
              recycleInfo.thumbnail = url;
            } catch (error) {
              console.log('Error: Read image fail ' + error);
            }
          }

          recycleInfos.push(recycleInfo);
        }
        observer.next(recycleInfos);
      });
    });
  }

  getRecycleInfoById(id: string): Promise <RecycleInfo> {{;
    return this.recycleInfoRef.doc(id).get().then(async (doc) => {
      if (doc.exists) {
        const data = doc.data() as RecycleInfo;
      
        if (data['thumbnail']) {
          const imageRef = firebase.storage().ref().child(data['thumbnail']);
          try {
            const url = await imageRef.getDownloadURL();
            data.thumbnail = url;
          } catch (error) {
            console.log('Error: Read image fail ' + error);
          }
        }

        // Fetch image URLs for each image in the 'images' array
        if (data.images && data.images.length > 0) {
          const imagePromises = data.images.map(async (imagePath) => {
            const imageRef = firebase.storage().ref().child(imagePath);
            try {
              const imageUrl = await imageRef.getDownloadURL();
              return imageUrl;
            } catch (error) {
              console.log('Error: Read image failed ' + error);
              return null;
            }
          });

          // Wait for all image URLs to be fetched
          const imageUrls = await Promise.all(imagePromises);

          // Replace the 'images' array with the fetched URLs
          data.images = imageUrls.filter((url) => url !== null);
        }

        return data;
      } else {
        console.log(`Recycle Info Category ${id} not found in the "recycleInfo" collection`);
        return {} as RecycleInfo;
      }
    }).catch((error) => {
      console.error('Error getting recycle info info:', error);
      throw error;
    });
  }
  }

  updateRecycleInfo(id: string, updatedInfo: RecycleInfo): Promise<void> {
    const infoRef = this.recycleInfoRef.doc(id);

    return infoRef.update(updatedInfo).then(() => {
      console.log(`Recycle Info with ID ${id} updated successfully.`);
    }).catch((error) => {
      console.error('Error updating recycle info:', error);
      throw error;
    });
  }
}
