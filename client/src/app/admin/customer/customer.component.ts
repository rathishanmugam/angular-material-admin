import {AfterViewInit, Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {DataSource} from '@angular/cdk/table';
import {Observable, merge, fromEvent, of} from 'rxjs';
import {MatDialog, MatTable} from '@angular/material';
import {DialogBoxComponent} from './dialog-boxx/dialog-boxx.component';
import {MatPaginator} from '@angular/material';
import {MatSort} from '@angular/material';
import {MatTableDataSource} from '@angular/material';
import {DataService} from './data.service';
import {MatSnackBar} from '@angular/material';
import {catchError, finalize, startWith, tap, throttleTime, distinctUntilChanged, debounceTime} from 'rxjs/operators';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {ICreditor} from '../creditor/creditor';
import {HttpErrorResponse} from '@angular/common/http';


export interface ICustomer {
  _id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: number;
  };
  email: string;
  phone1: string;
  phone2: string;
  mobile1: string;
  mobile2: string;
  createdOn: Date;
  added?: Date;
  action?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CostomerComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'address', 'email', 'phone', 'createdOn', 'update', 'delete'];
  public serverForm: FormGroup;
  public total: number;
  public pages: number;
  public count: number;
  dataSource;
  public loading: boolean;
  users: ICustomer[];
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
    this.loading = true;
    this.dataService
      .getUsers(0, 5, 'name', -1, '').pipe(throttleTime(50000), catchError(() => of([])),
      finalize(() => this.loading = false))
      .subscribe((result: any) => {
        this.total = result.count;
        this.users = result.docs;
        console.log('total', this.total);
        // this.loadRecordsPage();

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
    const ord = (this.sort.direction === 'asc') ? '1' : '-1';
    console.log('the page:', this.paginator.pageSize, this.paginator.pageIndex, this.sort.direction);
    this.dataService.getUsers(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active,
      parseInt(ord, 10), this.input.nativeElement.value).pipe(debounceTime(900000), catchError(() => of([])),
      finalize(() => this.loading = false))
      .subscribe((result: any) => {
        console.log('tot record', this.total);
        this.total = result.count;
        this.users = result.docs;
        this.dataSource = new MatTableDataSource(result.docs);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
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
  public initial(): ICustomer {
    return {
      _id: null,
      name: null,
      address: {
        street: null,
        city: null,
        state: null,
        zipCode: null,
      },
      email: null,
      phone1: null,
      phone2: null,
      mobile1: null,
      mobile2: null,
      createdOn: null
    };
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
        // let id = Math.max.apply(null, this.users.map(s => s.id));
        let id = this.total;

        if (id > 0) {
          id++;
        } else {
          id = 1;
        }
        console.log('added item', {...result.data, createdOn});

        this.dataService.addUser({...result.data}).subscribe((data: ICustomer) => {
            console.log('the added user are', data);
            // this.dataSource.push({
            //   id,
            //   first: result.data.first,
            //   last: result.data.last,
            //   email: result.data.email,
            //   phone: result.data.phone,
            //   location: result.data.location,
            //   hobby: result.data.hobby,
            //   added
            //
            // });
            // this.table.renderRows();
            this.getUsers();

            this.loadRecordsPage();

            this.snackBar.open(` ${result.data.name} added successfully`, 'ok', {
              duration: 3000
            });
          },
          (err: HttpErrorResponse) => {
            window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
          });

      } else if (result.event === 'Update') {
        console.log('updated item', {...result.data, createdOn});
        this.dataService.updateUser(result).subscribe(
          data => {
            this.getUsers();
            this.loadRecordsPage();

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
            this.snackBar.open(`user ${result.data.name} updated successfully`, 'ok', {
              duration: 3000
            });
          },
          (err: HttpErrorResponse) => {
            window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
          });

      } else if (result.event === 'Delete') {
        this.dataService.deleteUser(result).subscribe(
          data => {
             this.getUsers();
            this.loadRecordsPage();

            // this.dataSource = this.dataSource.filter((value, key) => {
            //   return value.id != result.data.id;
            // });
            console.log('the new item deleted is', data);
            this.snackBar.open(`user ${result.data.name} deleted successfully`, 'ok', {
              duration: 3000
            });
          },
          (err: HttpErrorResponse) => {
            window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
          });

      }
    });
  }
}



