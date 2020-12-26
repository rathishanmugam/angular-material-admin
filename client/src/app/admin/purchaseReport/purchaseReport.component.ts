import {AfterViewInit, Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {DataSource} from '@angular/cdk/table';
import {Observable, merge, fromEvent, of} from 'rxjs';
import {MatDialog, MatTable} from '@angular/material';
import {MatPaginator} from '@angular/material';
import {MatSort} from '@angular/material';
import {MatTableDataSource} from '@angular/material';
import {MatSnackBar} from '@angular/material';
import {catchError, finalize, startWith, tap, throttleTime, distinctUntilChanged, debounceTime} from 'rxjs/operators';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {IPurchase} from './purchaseReport';

import {PurchaseReportService} from './purchaseReport.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  templateUrl: './purchaseReport.component.html',
  styleUrls: ['./purchaseReport.component.scss']
})
export class PurchaseReportComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['purchaseBillNo', 'purchaseDate', 'productCreditor', 'serialNo', 'modelNo', 'qty', 'productRate', 'totalRate', 'instockDuration'];// 'serialNo', 'modelNo', 'qty', 'totalRate', 'billType', 'financeName', 'loanAmount'];

  displayedColumnsOne: string[] = ['serialNo', 'modelNo', 'qty', 'totalRate', 'loanAmount'];
  public serverForm: FormGroup;
  public total: number;
  public pages: number;
  public count: number;
  dataSource;
  dataSourceOne;
  public loading: boolean;
  purchase: IPurchase[];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;
  @ViewChild('input', {static: true}) input: ElementRef;

  // dataSource: MatTableDataSource<User>;
  constructor(private dataService: PurchaseReportService,
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
    this.dataService
      .getPurchase(0, 5, 'companyName', 1, '').pipe(throttleTime(50000), catchError(() => of([])),
      finalize(() => this.loading = false))
      .subscribe((result: any) => {
          this.total = result.count;
          this.purchase = result.docs;
          console.log('total', this.total);
          console.log('product', this.purchase);


          this.dataSource = new MatTableDataSource(result.docs);
          this.pages = Math.round(this.total / 5);
          console.log('the pages are', this.pages);
          console.log('the pages are', result.docs);

          // this.dataSource = this.users;
          this.dataSource.paginator = this.paginator;

          this.dataSource.sort = this.sort;
          // this.count, parseInt(limit, 10),parseInt(order, 10)
        },
        (err: HttpErrorResponse) => {
          window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
        });

  }

  ngAfterViewInit() {

    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadRecordsPage();
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
    // this.paginator.page
      .pipe(
        startWith(null),
        tap(() => this.loadRecordsPage())
      )
      .subscribe();
  }

  loadRecordsPage() {
    this.loading = true;
    const ord = (this.sort.direction === 'asc') ? '1' : '-1';
    const filter = this.input.nativeElement.value ? this.input.nativeElement.value : '';

    console.log('the page:', this.paginator.pageSize, this.paginator.pageIndex, this.sort.direction);
    this.dataService.getPurchase(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active,
      parseInt(ord, 10), filter).pipe(debounceTime(900000), catchError(() => of([])),
      finalize(() => this.loading = false))
      .subscribe((result: any) => {
          console.log('tot record', this.total);
          console.log(' record', result.docs);

          this.total = result.count;
          this.purchase = result.docs;
          this.dataSource = new MatTableDataSource(result.docs);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
        },
        (err: HttpErrorResponse) => {
          window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
        });

  }

}



