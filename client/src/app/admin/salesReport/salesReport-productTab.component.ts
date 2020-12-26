// import {Component, OnInit,AfterViewInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
//  import { Subscription } from 'rxjs';
// import {SalesReportService} from './salesReport.service';
// import {MatPaginator, MatSort, MatTable, MatTableDataSource} from '@angular/material';
// import {FormGroup} from '@angular/forms';
// import {ISales} from './salesReport';
// import {catchError, finalize, startWith, tap, throttleTime, distinctUntilChanged, debounceTime} from 'rxjs/operators';
// import {Observable, merge, fromEvent, of} from 'rxjs';
//
// @Component({
//   templateUrl: './salesReport-productTab.component.html'
// })
// export class SalesReportProductTabComponent implements OnInit, OnDestroy, AfterViewInit {
//   monthCount: number;
//   displayedColumns: string[] = ['serialNo', 'modelNo', 'qty', 'productRate', 'gstRate', 'sgstRate', 'totalRate'];
//   public serverForm: FormGroup;
//   public total: number;
//   public pages: number;
//   public count: number;
//   dataSource;
//   dataSourceOne;
//   sub: Subscription;
//   public loading: boolean;
//   sales: ISales | null;
//   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
//   @ViewChild(MatSort, {static: true}) sort: MatSort;
//   @ViewChild(MatTable, {static: true}) table: MatTable<any>;
//   @ViewChild('input', {static: false}) input: ElementRef;
//
//    product;
//   constructor(private salesReportService: SalesReportService) { }
//
//   ngOnInit() {
//      this.sub = this.salesReportService.selectedProductChanges$.subscribe(selectedProduct => { this.product = selectedProduct;
//      console.log('the selected prod in parent', this.product);
//        // console.log('the selected prod in parent', this.product.products);
//        this.dataSource = new MatTableDataSource(this.product);
//        this.pages = Math.round(this.total / 5);
//        console.log('the pages are', this.pages);
//        this.dataSource.paginator = this.paginator;
//        this.dataSource.sort = this.sort;
//      });
//   }
//   ngAfterViewInit() {
//
//     // server-side search
//     fromEvent(this.input.nativeElement, 'keyup')
//       .pipe(
//         debounceTime(150),
//         distinctUntilChanged(),
//         tap(() => {
//           this.paginator.pageIndex = 0;
//           this.loadRecordsPage();
//         })
//       )
//       .subscribe();
//
//     // reset the paginator after sorting
//     this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
//     merge(this.sort.sortChange, this.paginator.page)
//     // this.paginator.page
//       .pipe(
//         startWith(null),
//         tap(() => this.loadRecordsPage())
//       )
//       .subscribe();
//   }
//
//   loadRecordsPage() {
//     this.loading = true;
//     const ord = (this.sort.direction === 'asc') ? '1' : '-1';
//     console.log('the page:', this.paginator.pageSize, this.paginator.pageIndex, this.sort.direction);
//     this.salesReportService.getSales(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active,
//       parseInt(ord, 10), this.input.nativeElement.value).pipe(debounceTime(900000), catchError(() => of([])),
//       finalize(() => this.loading = false))
//       .subscribe((result: any) => {
//         console.log('tot record', this.total);
//         console.log(' record', result.docs);
//
//         this.total = result.count;
//         this.sales = result.docs;
//         this.dataSource = new MatTableDataSource(result.docs);
//         // this.dataSource.paginator = this.paginator;
//         // this.dataSource.sort = this.sort;
//       });
//   }
//
//   ngOnDestroy(): void {
//      this.sub.unsubscribe();
//   }
// }


import {AfterViewInit, Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {DataSource} from '@angular/cdk/table';
import {Observable, merge, fromEvent, of} from 'rxjs';
import {MatDialog, MatTable} from '@angular/material';
import {MatPaginator} from '@angular/material';
import {MatSort} from '@angular/material';
import {MatTableDataSource} from '@angular/material';
import {MatSnackBar} from '@angular/material';
import {catchError, finalize, startWith, tap, throttleTime, distinctUntilChanged, debounceTime} from 'rxjs/operators';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {IProduct, ISales} from './salesReport';
import {SalesReportService} from './salesReport.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-salesreport-product',

  templateUrl: './salesReport-productTab.component.html',

  styleUrls: ['./salesReport.component.scss']
})
export class SalesReportProductTabComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['serialNo', 'modelNo', 'companyName', 'productType', 'qty', 'productPrice', 'gstPrice', 'sgstPrice', 'totalPrice'];

  public serverForm: FormGroup;
  public total: number;
  public pages: number;
  public count: number;
  dataSource;
  sub: Subscription;

  dataSourceOne;
  public loading: boolean;
  product;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;
  @ViewChild('input', {static: true}) input: ElementRef;

  // dataSource: MatTableDataSource<User>;
  constructor(private dataService: SalesReportService,
              public dialog: MatDialog,
              private fb: FormBuilder,
              public snackBar: MatSnackBar
  ) {
    // this.dataSource = new MatTableDataSource(this.dataService.getUsers);
  }

  ngOnInit() {
    console.log('iam  in product');
    this.getUsers();
  }

  getUsers() {
    this.loading = true;
    this.sub = this.dataService.selectedProductChanges$.subscribe(selectedProduct => {
      this.product = selectedProduct;
      console.log('the selected prod in parent', this.product);
      // console.log('the selected prod in parent', this.product.products);
      if (this.product) {
        console.log('the selected prod in parent', this.product);
        // console.log('the selected prod in parent', this.product.products);
        this.dataSource = new MatTableDataSource(this.product);
        this.pages = Math.round(this.total / 5);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }

      // this.dataSource = new MatTableDataSource(this.product);
      // this.pages = Math.round(this.total / 5);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    });
  }
  public doFilter(value: string)  {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  ngAfterViewInit() {
    // server-side search
    // fromEvent(this.input.nativeElement, 'keyup')
    //   .pipe(
    //     debounceTime(150),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.paginator.pageIndex = 0;
    //       this.loadRecordsPage();
    //     })
    //   )
    //   .subscribe();
    //
    // // reset the paginator after sorting
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    // merge(this.sort.sortChange, this.paginator.page)
    // // this.paginator.page
    //   .pipe(
    //     startWith(null),
    //     tap(() => this.loadRecordsPage())
    //   )
    //   .subscribe();
  }

  loadRecordsPage() {
    this.loading = true;
    const ord = (this.sort.direction === 'asc') ? '1' : '-1';
    console.log('the page:', this.paginator.pageSize, this.paginator.pageIndex, this.sort.direction);
    this.dataSource = new MatTableDataSource(this.product);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}



