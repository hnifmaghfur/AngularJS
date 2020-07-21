import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  userIsAutenticated = false;
  isLoading = true;
  private authListenerSubs: Subscription;

  constructor (private authService: AuthService) {}

  ngOnInit(){
    this.userIsAutenticated = this.authService.getAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAutenticated => {
        console.log("ini yang dalam : " + isAutenticated);
        this.userIsAutenticated = isAutenticated;
      });
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }

  onLogout(){
    this.authService.logout();
  }

}
