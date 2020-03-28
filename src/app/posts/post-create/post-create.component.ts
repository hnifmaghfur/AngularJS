import { Component, EventEmitter, Output } from '@angular/core';

import { Post } from '../post.model';   //ini untuk deklaras tipe data
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls :[ './post-create.component.css' ]
})

export class PostCreateComponent {
  formTitle = "";
  formContent = "";
  @Output() postForm = new EventEmitter<Post>();

  onTambahPath(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const post: Post = {
      title: form.value.title,
      content: form.value.content
    }
    this.postForm.emit(post);
  }
}
