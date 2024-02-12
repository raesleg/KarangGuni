import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { Observable } from 'rxjs';
import { Post } from './models/post';
import { Comment } from './models/comment';

@Injectable({
  providedIn: 'root'
})
export class FirebasePostService {
  private postsRef = firebase.firestore().collection("posts");
  private commentsRef = firebase.firestore().collection("comments");

  constructor() { }

  private async getCommentsByPostID(postID: string): Promise<Comment[]> {
    const querySnapshot = await this.commentsRef.where('post_id', '==', postID).get();
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return new Comment(doc.id, data['post_id'], data['comment_description']);
    });
  }

  getPosts(): Observable<any> {
    return new Observable((observer) => {
      this.postsRef.onSnapshot(async (querySnapshot) => {
        let posts: Post[] = [];
        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          const comments = await this.getCommentsByPostID(doc.id); // Fetch comments for each post
          let p = new Post(
            data['datePosted'],
            data['description'],
            data['username'],
            doc.id, // Use the auto-generated ID as post_id
            data['liked'],
            data['imageUrl']
          );
          p.commentsVisible = false;
          p.comments = comments; // Set the fetched comments
          posts.push(p);
        }
        observer.next(posts);
      });
    });
  }


  async add(p: Post): Promise<void> {
    // Construct the object to upload, including the username and excluding imageUrl if it doesn't exist
    const postObject: any = {
      username: p.username, // Include the username in the object
      description: p.description,
      datePosted: p.datePosted,
      liked: p.liked,
      // If you decide to handle comments within the post, include them as well
      // comments: p.comments,
      // commentsVisible: p.commentsVisible,
    };

    if (p.imageUrl) {
      postObject.imageUrl = p.imageUrl;
    }

    console.log("Attempting to add post to Firestore:", postObject);
    await this.postsRef.add(postObject).catch(error => {
      console.error("Error adding post to Firestore:", error);
    });
  }



  public async uploadFile(file: File): Promise<string> {
    const filePath = `post_images/${new Date().getTime()}_${file.name}`;
    const fileRef = firebase.storage().ref().child(filePath);
    await fileRef.put(file);
    return fileRef.getDownloadURL(); // Returns the URL of the uploaded file
  }

  async uploadBase64Image(base64Data: string): Promise<string> {
    const fileName = `post_images/${new Date().getTime()}.jpeg`;
    const imageBlob = this.dataURItoBlob(base64Data);
    const fileRef = firebase.storage().ref().child(fileName);
    await fileRef.put(imageBlob);
    return fileRef.getDownloadURL();
  }

  private dataURItoBlob(dataURI: string): Blob {
    const byteString = window.atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([uintArray], { type: mimeString });
  }

  async getUserPostsByUsername(username: string): Promise<Post[]> {
    const querySnapshot = await this.postsRef.where('username', '==', username).get();
    const posts: Post[] = [];
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      const comments = await this.getCommentsByPostID(doc.id); // Fetch comments for each post
      const post = new Post(
        data['datePosted'],
        data['description'],
        data['username'],
        doc.id,
        data['liked'],
        data['imageUrl']
      );
      post.commentsVisible = false;
      post.comments = comments; // Set the fetched comments
      posts.push(post);
    }
    return posts;
  }
  
  

}
