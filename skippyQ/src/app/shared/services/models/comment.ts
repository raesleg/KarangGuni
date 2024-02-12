export class Comment {

    comment_id: string;
    post_id: string;
    comment_description: string; 

    constructor(comment_id: string, 
                post_id: string,
                comment_description: string,) {
                    this.comment_id = comment_id;
                    this.post_id = post_id;
                    this.comment_description = comment_description;
                }
}