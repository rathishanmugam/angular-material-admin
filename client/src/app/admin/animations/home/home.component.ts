import { Component, OnInit } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';
import { throttleTime } from 'rxjs/operators';
import {Observable, interval} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(-15px)' }),
            stagger(
              '100ms',
              animate(
                '500ms ease-out',
                style({ opacity: 1, transform: 'translateY(0px)' })
              )
            )
          ],
          { optional: true }
        ),
        query(
          ':leave',
          [
            style({ opacity: 1 }),
            stagger(
              '100ms',
              animate(
                '500ms ease-out',
                style({ opacity: 0, transform: 'translateY(-15px)' })
              )
            )
          ],
          {
            optional: true
          }
        )
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  items = [];
  constructor() {}

  showItems() {
    this.items = [0, 1, 2, 3, 4];
  }

  hideItems() {
    this.items = [];
  }

  toggle() {
    this.items.length ? this.hideItems() : this.showItems();
  }

  ngOnInit() {
    const source = interval(1000);
    /*
      throttle for five seconds
      last value emitted before throttle ends will be emitted from source
    */
    const example = source.pipe(throttleTime(5000));
//output: 0...6...12
    const subscribe = example.subscribe(val => console.log(val));

  }
}
