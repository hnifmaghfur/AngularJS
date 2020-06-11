import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import  { map } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject< Post[] >();

  constructor( private http: HttpClient, private router: Router) {}

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

  getPost( id:  string ){
    return this.http.get<{ _id: string, title: string, content: string }>('http://localhost:3000/api/posts/edit/' + id);
  }

  addPost( title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http.post<{ postId: string }>('http://localhost:3000/api/posts', post)
    .subscribe((responseData) => {
      console.log(responseData);
      const id = responseData.postId;
      post.id = id;
      this.posts.push( post );
      this.postsUpdated.next([...this.posts]);
      this.router.navigate( ["/" ]); //refresh halaman
    });
  }

  updatedPost( id: string, title: string, content: string ){
    const post: Post = { id: id, title: title, content: content };
    this.http.put('http://localhost:3000/api/posts/edit/' + id, post).
    subscribe(() => {
      const updatePosts = [...this.posts];
      const oldPostIndex = updatePosts.findIndex(p => p.id === post.id);
      updatePosts[oldPostIndex] = post;
      this.posts = updatePosts;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate([ "/" ]);
    });
  }

  deletePost( postId: string ){
    this.http.delete('http://localhost:3000/api/posts/delete/' + postId)
    .subscribe((responsePost) => {
      console.log( "Deleted!" );
      console.log( responsePost );
      const updatePost = this.posts.filter(post => post.id !== postId);
      this.posts = updatePost;                    //update isi posts
      this.postsUpdated.next([...this.posts]);    //refresh halaman
    });
  }
}
