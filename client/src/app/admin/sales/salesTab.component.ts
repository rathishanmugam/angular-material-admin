// import {Component, OnInit , ViewChild , AfterViewInit} from '@angular/core';
//  import {pluck} from 'rxjs/operators';
// import {TabService} from './tab.service';
// import {ActivatedRoute, Router} from '@angular/router';
// import {MatTabChangeEvent} from '@angular/material';
//
// /**
//  * @title Tab group with dynamic height based on tab contents
//  */
// @Component({
//   templateUrl: 'salesTab.component.html',
//   styleUrls: ['salesTab.component.scss'],
// })
// export class SalesTabComponent implements AfterViewInit, OnInit {
//   @ViewChild('tabGroup', {static: true}) tabGroup;
//   // constructor(private tabService: TabService) {}
//   constructor(
//     private router: Router,
//     private route: ActivatedRoute,
//   ) {
//   }
//   activeTab: number = 0
//   tabIndex = {
//     'sales': 0,
//     'petty_sales': 1,
//     'sales_report': 2,
//     'petty_sales_report': 3,
//     'sales_report_chart': 4,
//     'petty_sales_report_chart': 5,
//   };
//
//
//   ngAfterViewInit() {
//     console.log('afterViewInit => ', this.tabGroup.selectedIndex);
//
//     console.log(this.tabGroup.selectedIndex.set(3)); // MdTabGroup Object
//     console.log(this.tabGroup.selectedIndex); // null
//   }
//   ngOnInit() {
//     // console.log("IAM IN TAB COMPONENT");
//     // this.tabService.getTabSelected().subscribe((tabIndex: number) => {
//     //   this.selectedIndex = tabIndex;
//     // });
//     // console.log("IAM IN TAB COMPONENT", this.selectedIndex);
//
//     this.route.params.pipe(pluck('tab')).subscribe(param => {
//       if (param) {
//         this.activeTab = this.tabIndex[param];
//             console.log('THE ACTIVE TAB IS IF LOOP=====>', this.activeTab);
//
//       } else {
//         this.activeTab = 0;
//         console.log('THE ACTIVE TAB IS ELSE LOOP=====>', this.activeTab);
//       }
//     });
//
//
//     // this.route.params.subscribe(params => {
//     //   if (params['tab']) {
//     //     this.activeTab = this.tabIndex[params['tab']];
//     //     console.log('THE ACTIVE TAB IS IF LOOP=====>', this.activeTab);
//     //   } else {
//     //     this.activeTab = 0;
//     //   }
//     //   console.log('THE ACTIVE TAB IS ELSE LOOP=====>', this.activeTab);
//     // });
//   }
//
//   tabChanged(tabChangeEvent: MatTabChangeEvent): void {
//     console.log('tabChangeEvent => ', tabChangeEvent);
//     console.log('index => ', tabChangeEvent.index);
//   }
// }
// import { Component } from '@angular/core';
// import {MatToolbarModule} from '@angular/material/toolbar';
// import { Router } from '@angular/router';
//
//
// @Component({
//   selector: 'app-sales-tab',
//   templateUrl: 'salesTab.component.html',
//   styleUrls:  ['salesTab.component.scss'],
// })
// export class SalesTabComponent {
//   navLinks: any[];
//   activeLinkIndex = -1;
//
//   constructor(private router: Router) {
//     this.navLinks = [
//       {
//         label: 'Sales Entry Tab',
//         link: './first',
//         index: 0
//       }, {
//         label: 'Petty Sales Entry Tab',
//         link: './second',
//         index: 1
//       }, {
//         label: 'Sales Report Tab',
//         link: './third',
//         index: 2
//       }, {
//         label: 'Petty Sales Report Tab',
//         link: './fourth',
//         index: 3
//       }, {
//         label: 'Sales Report Chart Tab',
//         link: './fifth',
//         index: 4
//       }
//     ];
//   }
//   ngOnInit(): void {
//     this.router.events.subscribe((res) => {
//       this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
//     });
//   }
//
// }
import { Component, OnInit } from '@angular/core';
class NavLink {
  constructor(public path: string, public label: string) {}
}

@Component({
  templateUrl: 'salesTab.component.html',
  styleUrls:  ['salesTab.component.scss'],
})
export class SalesTabComponent implements OnInit {
  navLinks: NavLink[] = [];
  constructor() {}
  ngOnInit() {
    this.navLinks = [
      new NavLink('salesEntryTab', 'SalesEntryTab'),
      new NavLink('pettySalesEntryTab', 'PettySalesEntryTab'),
      new NavLink('salesReportTab', 'SalesReportTab'),
      new NavLink('pettySalesReportTab', 'PettySalesReportTab'),
      new NavLink('salesReportChartTab', 'SalesReportChartTab'),
      new NavLink('salesBillingTab', 'SalesBillingTab'),

    ];
  }
}
