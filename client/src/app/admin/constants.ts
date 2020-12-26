import {ENV} from './env.config';
import { EnvService } from '../env.service';

interface AuthConfig {
  CLIENT_ID: string;
  CLIENT_DOMAIN: string;
  AUDIENCE: string;
  REDIRECT: string;
  SCOPE: string;
};

export const AUTH_CONFIG: AuthConfig = {
  CLIENT_ID: 'r6zNafsG67aQmX8N7H0TxQwzaUjVUVDg',
  CLIENT_DOMAIN: 'https://angularconsulting-dev.auth0.com/', // e.g., you.auth0.com
  AUDIENCE: 'http://localhost:8081/api/', // e.g., http://localhost:8083/api/
  REDIRECT: `http://localhost:4200/signin-callback`,
  SCOPE: 'openid  inventry-api'
};

export class Constants {
  public static clientRoot = 'http://localhost:4200/';

  // public static apiRoot = 'https://securingangularappscoursev2-api.azurewebsites.net/api/';
  // public static stsAuthority = 'https://securingangularappscoursev2-sts.azurewebsites.net/';

   public static apiRoot = 'http://localhost:8081/api/';
  // public static stsAuthority = 'https://dev-bm95gvf9.auth0.com';

   // public static stsAuthority = 'https://angularconsulting-dev.auth0.com/';
  // public static stsAuthority = 'https://briannoyes.auth0.com/';
   public static stsAuthority = 'https://andavar-angular.auth0.com/';

   // public static clientId = 'r6zNafsG67aQmX8N7H0TxQwzaUjVUVDg';
  //  public static clientId = 'Od8mbaoCGeXTF9ZWeQJspTTd7Qf1v1A7';
   public static clientId = 'INOuqdlUcxYBzszj4J0evvmUfyrz8rgk';
 public static clientsecret = 'kt2j2dmWfhnX0WuPHPIZNf5K_wsr-X_oX_neY0qiVMjHsyMxAKXVKfsm_Z71FLqM';
}
