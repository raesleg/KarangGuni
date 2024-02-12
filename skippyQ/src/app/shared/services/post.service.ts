import { Injectable } from '@angular/core';
import { Post } from './models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts: Post[]= [];

  constructor() {
    this.posts = [
      // new Post('Test 1', 'User 1'),
      // new Post('Test 2', 'User 2'),
    ];
   }

   getPosts(): Post[] {
    return this.posts;
   }

    add(p: Post) {
    this.posts.push(p);
  }
}
