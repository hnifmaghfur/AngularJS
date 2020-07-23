import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import  { map } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject< {posts: Post[], postCount: number} >();

  constructor( private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    // tanda ` (samping angka 1) digunakan untuk menggabungkan dynamic data ke http
    // tanda ${} digunakan untuk mengambil data dan di input ke http
    this.http.get<{massage: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
    .pipe(map((postData) => {
      return {posts: postData.posts.map(post => {     //Post disini adalah post dari mongodb / database
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          creator: post.creator
        };
      }), maxPosts: postData.maxPosts
      };
    }))
    .subscribe((transformedPostsData) => {
      this.posts = transformedPostsData.posts;
      this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostsData.maxPosts});
    });
  }

  getPostUpdatedListener(){
    return this.postsUpdated.asObservable();
  }

  getPost( id:  string ){
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>('http://localhost:3000/api/posts/edit/' + id);
  }

  addPost( title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
    .subscribe(() => {
      this.router.navigate( ["/" ]); //refresh halaman
    });
  }

  updatedPost( id: string, title: string, content: string, image: File | string ){
    let postData: Post | FormData;
    if (typeof(image) === 'object'){
      postData = new FormData;
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title)
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      }
    }
    this.http.put('http://localhost:3000/api/posts/edit/' + id, postData).
    subscribe(() => {
      this.router.navigate([ "/" ]);
    });
  }

  deletePost( postId: string ){
    return this.http.delete('http://localhost:3000/api/posts/delete/' + postId);
  }
}
