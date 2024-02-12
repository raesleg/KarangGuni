import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Comment } from './models/comment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseCommentService {
  private commentsRef = firebase.firestore().collection("comments");

  constructor() { }

  // Get comments for a specific post
  getCommentsByPostID(postID: string): Promise<Comment[]> {
    return this.commentsRef.where('post_id', '==', postID).get().then((querySnapshot) => {
      const comments: Comment[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const comment = new Comment(doc.id, data['post_id'], data['comment_description']);
        comments.push(comment);
      });
      return comments;
    });
  }

  // Add a new comment to a post
  addCommentToPost(comment: Comment): Promise<firebase.firestore.DocumentReference> {
    return this.commentsRef.add({
      post_id: comment.post_id,
      comment_description: comment.comment_description,
      // Add any other properties you might need, like timestamp, userID, etc.
    });
  }
}
