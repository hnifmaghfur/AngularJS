import { Component } from '@angular/core';

import { Post } from '../post.model';   //ini untuk deklaras tipe data
import { NgForm } from '@angular/forms';
import { PostsService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls :[ './post-create.component.css' ]
})

export class PostCreateComponent {
  formTitle = "";
  formContent = "";

  constructor( public postsService: PostsService){}

  onTambahPath(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.postsService.addPost( form.value.title, form.value.content );
    form.resetForm();
  }
}
