import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatIcon} from '@angular/material';
import {AdminService} from '../../admin.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class SideNavComponent implements OnInit {
  showMenu = false;
  expanded: boolean;
  login = false;
  constructor(public adminService: AdminService) {}

  ngOnInit() {
    this.adminService.LoggedIn = this.login;
    console.log('the login =====>', this.adminService.LoggedIn);
  }
}
