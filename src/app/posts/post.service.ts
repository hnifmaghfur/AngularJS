import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import  { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject< Post[] >();

  constructor( private http: HttpClient ) {}

  getPosts() {
    this.http.get<{massage: string, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map(Post => {     //Post disini adalah post dari mongodb / database
        return {
          title: Post.title,
          content: Post.content,
          id: Post._id
        };
      });
    }))
    .subscribe((transformedPosts) => {
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdatedListener(){
    return this.postsUpdated.asObservable();
  }

  addPost( title: string, content: string) {
    const post: Post = { id: null, title: title, content: content }
    this.http.post<{ postId: string }>('http://localhost:3000/api/posts', post)
    .subscribe((responseData) => {
      console.log(responseData);
      const id = responseData.postId;
      post.id = id;
      this.posts.push( post );
      this.postsUpdated.next([...this.posts]);      //refresh halaman
    });
  }

  deletePost( postId: string ){
    this.http.delete('http://localhost:3000/api/posts/delete/' + postId )
    .subscribe((responsePost) => {
      console.log( "Deleted!" );
      console.log( responsePost );
      const updatePost = this.posts.filter(post => post.id !== postId);
      this.posts = updatePost;                    //update isi posts
      this.postsUpdated.next([...this.posts]);    //refresh halaman
    });
  }
}
