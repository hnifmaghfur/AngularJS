import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })

export class AuthService {
  private token: string;
  private tokenTimer: any;
  userIsAutentication = false;

  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private route: Router){}

  getToken() {
    return this.token;
  }

  getAuth(){
    return this.userIsAutentication;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post('http://localhost:3000/api/user/signup', authData)
    .subscribe(response => {
      console.log(response);
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', authData)
    .subscribe(response => {
      const token = response.token;   //ini untuk session cache login
      this.token = token;
      if(token){
        const expiresInDuration = response.expiresIn;       //ini untuk menggunakan timeout di frontend
        this.setAuthTimer(expiresInDuration);
        // satuan waktu expiredInDuration adalah milisecond, sehingga di kali 1k untuk menjadi second
        this.userIsAutentication = true;
        this.authStatusListener.next(true);
        const now = new Date;
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        // console.log(expirationDate);
        this.saveAuthData(token, expirationDate);
        this.route.navigate(['/']);
      }
    });
  }

  //berfungsi untuk mengetahui masa autentikasi token setelah login
  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0) {
      this.token = authInformation.token;
      this.userIsAutentication = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.userIsAutentication = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.route.navigate(['/']);
  }

  private setAuthTimer(duration: number){
    console.log("Setting timer : " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date){
    //fungsi localStorage, fungsi penyimpanan data local yang disediakan oleh Angular
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());  //toISOString mengubah date to string
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)        //memperbaharui waktu data
    }
  }
}
