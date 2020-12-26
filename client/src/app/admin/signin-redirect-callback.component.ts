import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AdminService} from './admin.service';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-signin-callback',
  template: `<div></div>`
})

export class SigninRedirectCallbackComponent implements OnInit {
  constructor(private loginService: AdminService,
              private _router: Router) { }

  ngOnInit() {
    this.loginService.completeLogin().then(user => {
  console.log('iam executing');
      this._router.navigate(['/'], { replaceUrl: true });
    })
  }
}
