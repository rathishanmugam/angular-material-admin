import {Injectable} from '@angular/core';
import {UserManager, User} from 'oidc-client';
import { Constants } from './constants';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AdminService {
  private _userManager: UserManager;
  private _user: User;
  public  LoggedIn = false;
  private _loginChangedSubject = new Subject<boolean>();

  loginChanged = this._loginChangedSubject.asObservable();
  constructor() {
    const stsSettings = {
      authority: Constants.stsAuthority,
      client_id: Constants.clientId,
      redirect_uri: `${Constants.clientRoot}signin-callback`,
      scope: 'openid offline_access dashboard inventry-api',
      response_type: 'code',
      post_logout_redirect_uri: `${Constants.clientRoot}signout-callback`,
      automaticSilentRenew: true,
      silent_redirect_uri: `${Constants.clientRoot}assets/silent-callback.html`,
      metadata: {
        issuer: `${Constants.stsAuthority}`,
        authorization_endpoint: `${Constants.stsAuthority}authorize?audience=inventry-api`,
        jwks_uri: `${Constants.stsAuthority}.well-known/jwks.json`,
        token_endpoint: `${Constants.stsAuthority}oauth/token`,
        userinfo_endpoint: `${Constants.stsAuthority}userinfo`,
        end_session_endpoint: `${Constants.stsAuthority}v2/logout?client_id=${Constants.clientId}&returnTo=${encodeURI(Constants.clientRoot)}signout-callback`
      }
    };
    this._userManager = new UserManager(stsSettings);
    this._userManager.events.addAccessTokenExpired(_ => {this._loginChangedSubject.next(false); });
}
  login() {
    return this._userManager.signinRedirect();
  }

  isLoggedIn(): Promise<boolean> {
    return this._userManager.getUser().then(user => {
      console.log('the user is =======>', user);
      const userCurrent = !!user && !user.expired;
      if (this._user !== user) {
        this._loginChangedSubject.next(userCurrent);
      }
      // if (userCurrent && !this.authContext) {
      //   this.loadSecurityContext();
      // }
      this._user = user;
      this.LoggedIn = userCurrent;

      return userCurrent;
    });
  }

  completeLogin() {
    return this._userManager.signinRedirectCallback().then(user => {
      this._user = user;
      this._loginChangedSubject.next(!!user && !user.expired);
      this.LoggedIn = !!user;

      return user;
    });
  }

  logout() {
    this._userManager.signoutRedirect();
  }

  completeLogout() {
    this._user = null;
    this._loginChangedSubject.next(false);
    return this._userManager.signoutRedirectCallback();
  }

  getAccessToken() {
    return this._userManager.getUser().then(user => {
      if (!!user && !user.expired) {
        return user.access_token;
    } else {
        return null;
      }
    });
  }

  // loadSecurityContext() {
  //   this._httpClient
  //     .get<AuthContext>(`${Constants.apiRoot}Projects/AuthContext`)
  //     .subscribe(
  //       context => {
  //         this.authContext = new AuthContext();
  //         this.authContext.claims = context.claims;
  //         this.authContext.userProfile = context.userProfile;
  //       },
  //       error => console.error(error)
  //     );
  // }

}
