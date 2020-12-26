import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AdminService} from './admin.service';

@Component({
  selector: 'app-signout-callback',
  template: `<div></div>`
})

export class SignoutRedirectCallbackComponent implements OnInit {
  constructor(private loginService: AdminService,
              private _router: Router) { }

  ngOnInit() {
    this.loginService.completeLogout().then(_ => {
      console.log('iam executing');
      this._router.navigate(['/'], { replaceUrl: true });
    })
  }
}
