import {Component, OnInit} from '@angular/core';
import {SuspenseService} from "./suspense.service";
export interface ISuspense {
  // id: number
  name: string
  presenter: string
  duration: string
  time:string
  show: string
  abstract: string
  // attendees: string[]
}
@Component({
  selector: 'app-root',
  templateUrl: './suspense.component.html',
  styles: [`
    em {
      float: right;
      color: #E05C65;
      padding-left: 10px;
    }

    .error input {
      background-color: #E3C3C5;
    }

    .error ::-webkit-input-placeholder {
      color: #999;
    }

    .error ::-moz-placeholder {
      color: #999;
    }

    .error :-moz-placeholder {
      color: #999;
    }

    .error :ms-input-placeholder {
      color: #999;
    }
  `]
})

export class SuspenseComponent implements OnInit{
  sales: any[]
  errorMessage: string;

  constructor(private suspenseService: SuspenseService) {
  }

  ngOnInit() {
    console.log('iam executing');
  }

}
