export class Post {
    datePosted: string;
    description: string;
    commentsVisible: boolean; // Existing property
    comments: any;
    post_id: string;
    username: string; // Added property for username
    liked?: boolean;
    imageUrl?: string;

    constructor(
        datePosted: string, 
        description: string, 
        post_id: string, 
        username: string, // Add username as a parameter
        liked?: boolean, 
        imageUrl?: string
    ) {
        this.datePosted = datePosted; // Use the passed timestamp or create a new one if not provided
        this.description = description;
        this.username = username; // Initialize the username
        this.post_id = post_id;
        this.liked = liked || false;
        this.commentsVisible = false;
        if (imageUrl) this.imageUrl = imageUrl;
    }
}