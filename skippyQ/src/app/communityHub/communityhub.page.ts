import { Component, OnInit, } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Post } from '../shared/services/models/post';
import { Comment } from '../shared/services/models/comment';
import { FirebasePostService } from '../shared/services/firebase-post.service';
import { FirebaseCommentService } from '../shared/services/firebase-comment.service';
import { UserService } from '../shared/services/user.service'; // Import UserService

@Component({
  selector: 'app-communityhub',
  templateUrl: 'communityhub.page.html',
  styleUrls: ['communityhub.page.scss']
})
export class CommunityHubPage implements OnInit {
  segment: string = 'all'; // Make sure this is initialized correctly
  posts: Post[] = [];
  addCommentForm: FormGroup;
  myPosts: Post[] = []; // This will hold only the user's posts
  private currentUserEmail: string = 'test@gmail.com';

  constructor(
    private postService: FirebasePostService, 
    private commentService: FirebaseCommentService,
    private userService: UserService // Inject UserService
  ) {
    this.addCommentForm = new FormGroup({
      comment_description: new FormControl('')
    });
  }

  ngOnInit() {
    this.loadAllPosts();
  }

  loadAllPosts() {
    this.postService.getPosts().subscribe((posts: Post[]) => { // Assuming 'Post' is your type here
      this.posts = posts.map((post: Post) => ({
        ...post,
        // Check if localStorage has a 'liked' entry, and use it if so; otherwise default to false
        liked: JSON.parse(localStorage.getItem('heartFilled_' + post.post_id) ?? 'false'),
      }));
    });
  }

  async loadMyPosts() {
    try {
      const username = await this.userService.getUsernameByEmail(this.currentUserEmail);
      const posts = await this.postService.getUserPostsByUsername(username);
      this.myPosts = posts.map((post: Post) => ({
        ...post,
        // Same localStorage check as above
        liked: JSON.parse(localStorage.getItem('heartFilled_' + post.post_id) ?? 'false'),
      }));
    } catch (error) {
      console.error('Error loading my posts:', error);
    }
  }

  deriveUsernameFromEmail(email: string): string {
    // Implement your logic here to derive the username from the email
    // For example, you might take the part before the '@' in the email
    return email.split('@')[0];
  }
  

  // Existing logic for toggling heart state remains unchanged
  toggleHeart(post: Post) {
    post.liked = !post.liked;
    localStorage.setItem('heartFilled_' + post.post_id, JSON.stringify(post.liked));
  }
  
  // Existing logic for toggling comments remains unchanged
  toggleComments(post: Post) {
    post.commentsVisible = !post.commentsVisible;
    if (post.commentsVisible && post.comments.length === 0) {
      this.loadCommentsForPost(post);
    }
  }

  // Existing logic for loading comments remains unchanged
  loadCommentsForPost(post: Post) {
    this.commentService.getCommentsByPostID(post.post_id).then(comments => {
      post.comments = comments;
    });
  }

  // Existing logic for adding a comment remains unchanged
  addComment(post: Post) {
    if (this.addCommentForm.valid) {
      const newComment = new Comment(
        '', // comment_id will be set by Firebase upon creation
        post.post_id,
        this.addCommentForm.value.comment_description
      );

      this.commentService.addCommentToPost(newComment).then(docRef => {
        this.addCommentForm.reset();
        newComment.comment_id = docRef.id;
        post.comments.push(newComment);
      }).catch(error => {
        console.error('Error adding comment: ', error);
      });
    }
  }

  // Method to handle segment change
  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
    if (this.segment === 'my-posts') {
      this.loadMyPosts();
    } else {
      this.loadAllPosts(); // Assuming you have a method to load all posts
    }
  }
}
