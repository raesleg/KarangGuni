import { Injectable } from '@angular/core';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  comments: Comment[] = [];

  constructor() {
    this.comments = [
      new Comment('User 1', '9mBDhDKC4nS09Ve98rFb', 'Test 1'),
      new Comment('User 2', 'W3HQClfiYGjMJwHCaWm0', 'Test 2'),
    ];
   }

   getComments(): Comment[] {
    return this.comments;
   }

   add(c: Comment) {
    this.comments.push(c);
   }
}
