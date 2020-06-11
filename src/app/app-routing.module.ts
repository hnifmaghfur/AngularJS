//Route berfungsi untuk menentukan jalur dari output web
//contoh localhost:4500/create/  maka akan ke jalur create yang ada di path

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostOutputComponent } from './posts/post-output/post-output.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';



const routes: Routes = [
  { path: '', component: PostOutputComponent },       //main web/root
  { path: 'create', component: PostCreateComponent },  // ini jalur create
  { path: 'edit/:postId', component: PostCreateComponent }  // ini jalur create

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
