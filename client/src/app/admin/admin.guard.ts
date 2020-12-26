import {AdminService} from "./admin.service";
import { Injectable } from '@angular/core';

// import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot, Router } from '@angular/router';


@Injectable({providedIn: 'root'})
export class AdminGuard implements CanActivate {
  constructor(private adminService: AdminService,
              private router: Router
) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.adminService.LoggedIn === true) {
      return true;
    } else {
      this.router.navigate(['/unauthorized']);
       return false;
    }

}
}
