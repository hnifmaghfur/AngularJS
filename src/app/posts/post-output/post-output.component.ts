import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component ({
  selector: 'app-post-output',
  templateUrl: './post-output.component.html',
  styleUrls: ['./post-output.component.css']
})

export class PostOutputComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPost = 0;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAutenticated = false;
  userId: string;
  private authListenerSubs: Subscription;
  private postsSub: Subscription;

  constructor( public postsService: PostsService, private authService: AuthService ) {}

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postsService.getPosts(this.postPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdatedListener()
      .subscribe((postsData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPost = postsData.postCount;
        this.posts = postsData.posts;
      });
    this.userIsAutenticated = this.authService.getAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
    .subscribe(isAutenticated => {
      this.userIsAutenticated = isAutenticated;
      this.userId = this.authService.getUserId();
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postPerPage, this.currentPage);
    });
  }
}
