import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})


export class TabService {
  tabSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() {}
  setTabSelected(tabIndex: number) {
    this.tabSubject.next(tabIndex);
    console.log('THE TAB INDEX SERVICE====>', tabIndex);

  }

  getTabSelected() {
    this.tabSubject.asObservable();
  }
}
