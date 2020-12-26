import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {AdminService} from '../../admin.service';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  @Output() sideNavToggled = new EventEmitter<void>();

  isLoggedIn = false;
  constructor(private router: Router, private  loginService: AdminService) {
    this.loginService.loginChanged.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    })
  }

  ngOnInit() {
    this.loginService.isLoggedIn().then(loggedIn => {
      this.isLoggedIn = loggedIn;
    })
  }



  // constructor(private readonly router: Router) {}

  // ngOnInit() {}

  toggleSidebar() {
    this.sideNavToggled.emit();
  }

  onLoggedout() {
    localStorage.removeItem('isLoggedin');
    this.router.navigate(['/login']);
  }
  onLogin() {
    localStorage.setItem('isLoggedin', 'true');
    this.router.navigate(['/dashboard']);
  }
  login() {
    this.loginService.login();
    // this.router.navigate(['/dashboard']);

  }

  logout() {
    this.loginService.logout();
    // this.router.navigate(['/login']);

  }
}
