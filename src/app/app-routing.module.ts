//Route berfungsi untuk menentukan jalur dari output web
//contoh localhost:4500/create/  maka akan ke jalur create yang ada di path

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostOutputComponent } from './posts/post-output/post-output.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/singup.component';
import { AuthGuard } from './auth/auth.guard';



const routes: Routes = [
  { path: '', component: PostOutputComponent },       //main web/root
  { path: 'login', component: LoginComponent },      //ini jalur login
  { path: 'signup', component: SignupComponent },    //ini jalur untuk signup

  //disini ada canActive yang berfungsi melindungi jalur url agar tidak bisa di akses tanpa login
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },  // ini jalur create
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] }  // ini jalur create

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [ AuthGuard ]
})

export class AppRoutingModule {}
