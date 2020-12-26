import {AfterViewInit, Component, OnInit, OnDestroy, ViewChild, ElementRef, Inject} from '@angular/core';
import {DataSource} from '@angular/cdk/table';
import {Observable, merge, fromEvent, of} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatTable} from '@angular/material';
import {MatPaginator} from '@angular/material';
import {MatSort} from '@angular/material';
import {MatTableDataSource} from '@angular/material';
import {MatSnackBar} from '@angular/material';
import {catchError, finalize, startWith, tap, throttleTime, distinctUntilChanged, debounceTime} from 'rxjs/operators';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {IPettySales} from './pettySaleReport';
import {PettySaleReportService} from './pettySaleReport.service';
import {Subscription} from 'rxjs';
// import {DialogComponent} from './dialog/dialog.component';
import {DialogOverviewExampleDialog} from '../mat-components/dialogs/dialog-overview/dialog-overview.component';
import {DatePipe} from '@angular/common';

// import {DialogComponent} from '../product/dialog/dialog.component';


interface DialogData {
  interest: string;
  period: number;
  payingDueDate: string;
  payingDueAmount: string;
}

@Component({

  templateUrl: './pettySaleReportMain.component.html',

  styleUrls: ['./pettySaleReport.component.scss']
})
export class PettySaleReportMainComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['serialNo', 'modelNo', 'qty', 'productRate', 'totalRate'];
  interest: string;
  period: number;
  current: string;
  IsGranted: true;
  public serverForm: FormGroup;
  public total: number;
  public pages: number;
  public count: number;
  dataSource;
  sub: Subscription;
  dataSourceOne;
  public loading: boolean;
  creditDue;
  newEventForm: FormGroup;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;
  @ViewChild('input', {static: true}) input: ElementRef;

  // dataSource: MatTableDataSource<User>;
  constructor(private dataService: PettySaleReportService,
              public dialog: MatDialog,
              private fb: FormBuilder,
              public snackBar: MatSnackBar
  ) {
    // this.dataSource = new MatTableDataSource(this.dataService.getUsers);
  }

  ngOnInit() {
    this.newEventForm = this.fb.group({
      searchName: new FormControl('', Validators.required),
    });
    console.log('iam  in product');
    this.getUsers();
  }

  getUsers() {
    this.loading = true;
    console.log('ARRAY=====>', !!this.dataService.selectedDueArray);
    this.sub = this.dataService.selectedProductChanges$.subscribe(due => {
      this.creditDue = due;
      if (this.creditDue) {
        console.log('the selected prod in parent', this.creditDue);
        // console.log('the selected prod in parent', this.product.products);
        this.dataSource = new MatTableDataSource(this.creditDue);
        this.pages = Math.round(this.total / 5);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });

  }
  // public doFilter = (value: string) => {
  //   this.dataSource.filter = value.trim().toLocaleLowerCase();
  // }
  ngAfterViewInit() {

    // server-side search
    // this.newEventForm.get('searchName').valueChanges
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
    this.dataSource = new MatTableDataSource(this.creditDue);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
