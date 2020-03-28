import { Component, Input } from '@angular/core';

import { Post } from '../post.model';

@Component ({
  selector: 'app-post-output',
  templateUrl: './post-output.component.html',
  styleUrls: ['./post-output.component.css']
})

export class PostOutputComponent {
  @Input() posts: Post[] = [];

}
