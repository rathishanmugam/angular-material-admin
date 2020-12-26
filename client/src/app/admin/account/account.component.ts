import {AfterViewInit, Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {DataSource} from '@angular/cdk/table';
import {Observable, merge, fromEvent, of, throwError} from 'rxjs';
import {MatDialog, MatTable} from '@angular/material';
import {DialogBoxComponent} from './dialog-boxx/dialog-boxx.component';
import {MatPaginator} from '@angular/material';
import {MatSort} from '@angular/material';
import {MatTableDataSource} from '@angular/material';
import {DataService} from './data.service';
import {MatSnackBar} from '@angular/material';
import {catchError, finalize, startWith, tap, throttleTime, distinctUntilChanged, debounceTime} from 'rxjs/operators';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {IAccount, ITally} from './account';
import {ISales} from '../sales/sales';
import {HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['accountNo', 'particulars', 'credit', 'debit', 'createdOn', '  update', '  delete'];
  public serverForm: FormGroup;
  public total: number;
  public pages: number;
  public count: number;
  errorMessage: string;
  accNo = 0;
  currentAccount: IAccount[];
  tally: ITally[];
  tallyYesterday: ITally[];

  dataSource;
  totalCredit = 0;
  totalDebit = 0;
  balance = 0;
  isButtonDisabled = false;
  newId;
  public loading: boolean;
  accounts: IAccount[];
  maxAccount: IAccount[];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;
  @ViewChild('input', {static: false}) input: ElementRef;

  // dataSource: MatTableDataSource<User>;
  constructor(private dataService: DataService,
              public dialog: MatDialog,
              private fb: FormBuilder,
              public snackBar: MatSnackBar
  ) {
    // this.dataSource = new MatTableDataSource(this.dataService.getUsers);
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.maxAccount = [];
    this.dataService.getAccount().subscribe(
      purchase => {
        this.maxAccount = purchase;
        console.log('the account records=======>', this.maxAccount);
        let d = new Date();
        d.setDate(d.getDate());
        const date = new Date(d).toISOString().replace(/T.*/, '').split('-').reverse().join('-');
        console.log('yesterday is ===>', date);
        const rec = this.maxAccount.filter(acc => (acc.particulars.includes(`carryForward ${date}`)));
        console.log('THE FOUND CARRY FORWARD RECORD IS ======>', rec);
        if (rec.length !== 0) {
          this.isButtonDisabled = true;
        } else if (rec.length === 0) {
          this.isButtonDisabled = false;

        }
        if (this.maxAccount) {
          this.accNo = this.getNextAvailableID(this.maxAccount);
          console.log('the new accountNo is:', this.accNo);
        } else {
          this.accNo = 0;
        }
      });
    this.loading = true;
    this.dataService
      .getUsers(0, 7, 'name', -1, '').pipe(throttleTime(5000), catchError(() => of([])),
      finalize(() => this.loading = false))
      .subscribe((result: any) => {
        this.total = result.count;
        this.accounts = result.docs;
        console.log('total', this.accounts);

        this.totalCredit = this.accounts.map(t => t.credit).reduce((acc, value) => acc + value, 0);
        this.totalDebit = this.accounts.map(t => t.debit).reduce((acc, value) => acc + value, 0);
        this.balance = this.totalCredit - this.totalDebit;
        console.log('total balance', this.balance);

        this.dataSource = new MatTableDataSource(result.docs);
        this.pages = Math.round(this.total / 5);
        console.log('the pages are', this.pages);
        // this.dataSource = this.users;
        this.dataSource.paginator = this.paginator;

        this.dataSource.sort = this.sort;
        // this.count, parseInt(limit, 10),parseInt(order, 10)
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
    const ord = (this.sort.direction === 'desc') ? '-1' : '1';
    console.log('the page:', this.paginator.pageSize, this.paginator.pageIndex, this.sort.direction);
    this.dataService.getUsers(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active,
      parseInt(ord, 10), this.input.nativeElement.value).pipe(debounceTime(900), catchError(() => of([])),
      finalize(() => this.loading = false))
      .subscribe((result: any) => {
        console.log('tot record', this.total);
        this.total = result.count;
        this.accounts = result.docs;
        this.totalCredit = this.accounts.map(t => t.credit).reduce((acc, value) => acc + value, 0);
        this.totalDebit = this.accounts.map(t => t.debit).reduce((acc, value) => acc + value, 0);
        this.balance = this.totalCredit - this.totalDebit;
        console.log('total balance', this.balance);
        this.dataSource = new MatTableDataSource(result.docs);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
      });
  }

  calculateBalance() {
    this.dataService.getAccountBalance().subscribe((result: any) => {
      this.dataService.getTally().subscribe((data: any) => {
        console.log('THE BALANCE RECORD IS ======>', data);
        this.tally = data.docs;
        console.log('THE BALANCE RECORD IS ======>', this.tally);

      });
    });
  }

  carryForward() {
    this.dataService.getTallyYesterday().subscribe((result: any) => {
      console.log('THE YESTERDAY BALANCE RECORD IS ======>', result);
      this.tallyYesterday = result.docs;
      console.log('THE YESTERDAY BALANCE RECORD IS ======>', this.tallyYesterday);

    const arr = (Object.assign({}, ...this.tallyYesterday));
console.log('iam in carry forward');
    this.dataService.carryForword(Object.assign({}, {data: {...arr, accountNo: this.accNo}})).subscribe((result: any) => {
        console.log('the new purchased item is', result);
        this.isButtonDisabled = true;
        this.snackBar.open(` ${this.accNo} added successfully`, 'ok', {
          duration: 3000
        });
    });
        this.getUsers();
        this.loadRecordsPage();
        this.getUsers();

      },
      (err: HttpErrorResponse) => {
        window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
      });

  }

// To Get List Of Employee
//   getUsers() {
//     this.dataService
//       .getUsers()
//       .subscribe((data: User[]) => {
//         this.users = data;
//         console.log('the user are', this.users);
//         this.dataSource = new MatTableDataSource(data);
//         // this.dataSource = this.users;
//         this.dataSource.paginator = this.paginator;
//         this.dataSource.sort = this.sort;
//       });
//   }

  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  //
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }
  public initial(): IAccount {


    // if (this.accounts) {
    //   accountNo = this.getNextAvailableID(this.accounts);
    //   console.log('the new id is:', this.newId);
    // } else {
    //   accountNo = 1;
    // }1
    return {
      accountNo: this.accNo,
      particulars: null,
      credit: 0.0,
      debit: 0.0,
      createdOn: null
    };
  }

  getTotalCredit() {
    return this.accounts.map(t => t.credit).reduce((acc, value) => acc + value, 0);
  }

  getTotalDebit() {
    return this.accounts.map(t => t.debit).reduce((acc, value) => acc + value, 0);
  }

  getNextAvailableID(account: IAccount[]): number {
    let maxID = 0;
    account.forEach(function (element, index, array) {
      if (element.accountNo) {
        if (element.accountNo > maxID) {
          maxID = element.accountNo;
          // console.log('the maxid in loop', maxID);

        }
      }
    });
    console.log('the maxid', maxID);
    return ++maxID;
  }


  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '425px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      const createdOn = new Date().toLocaleDateString();
      if (result.event === 'Add') {
        // let accountNo;
        // if (this.accounts) {
        //   accountNo = this.getNextAvailableID(this.accounts);
        //   console.log('the new id is:', this.newId);
        // } else {
        //   accountNo = 1;
        // }
        console.log('added item', {...result.data, createdOn});

        this.dataService.addUser({...result.data, createdOn}).subscribe((account: IAccount) => {
            console.log('the added user are', account);
            // this.dataSource.push({
            //
            //   accountNo: result.data.accountNo,
            //   particulars: result.data.particulars,
            //   credit: result.data.credit,
            //   debit: result.data.debit,
            //   // location: result.data.location,
            //   // hobby: result.data.hobby,
            //   // added
            //
            // });
            // this.table.renderRows();
            this.loadRecordsPage();

            this.getUsers();

            this.snackBar.open(`account ${result.data.accountNo} added successfully`, 'ok', {
              duration: 3000
            });
          },
          (err: HttpErrorResponse) => {
            window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
          }
        );

      } else if (result.event === 'Update') {
        console.log('updated item', {...result.data, createdOn});
        this.dataService.updateUser(result.data).subscribe(
          data => {
            this.loadRecordsPage();
            this.getUsers();

            // this.dataSource = this.dataSource.filter((value,key)=> {
            //   if (value.id == result.data.id) {
            //     value.first = result.data.first;
            //     value.last = result.data.last;
            //     value.email = result.data.email;
            //     value.phone = result.data.phone;
            //     value.location = result.data.location;
            //     value.hobby = result.data.hobby;
            //     value.added = result.data.added;
            //   }
            //   return true;
            // });
            console.log('the new item updated is', data);
            this.snackBar.open(`account ${result.data.accountNo} updated successfully`, 'ok', {
              duration: 3000
            });
          },
          (err: HttpErrorResponse) => {
            window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
          });


      } else if (result.event === 'Delete') {
        console.log('iam in delete');
        this.dataService.deleteUser(result.data).subscribe(
          data => {
            this.loadRecordsPage();
            this.getUsers();

            // this.dataSource = this.dataSource.filter((value, key) => {
            //   return value.id != result.data.id;
            // });
            console.log('the new item deleted is', data);
            this.snackBar.open(`account ${result.data.accountNo} deleted successfully`, 'ok', {
              duration: 3000
            });
          },
          (err: HttpErrorResponse) => {
            window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
          });
        // this.getUsers();

      }
    });
  }
}



