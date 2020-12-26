import {AfterViewInit, Component, OnInit, OnDestroy, ViewChild, ElementRef, Inject} from '@angular/core';
import {DataSource} from '@angular/cdk/table';
import {Observable, merge, fromEvent, of} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatTable} from '@angular/material';
import {MatSnackBar} from '@angular/material';
import {catchError, finalize, startWith, tap, throttleTime, distinctUntilChanged, debounceTime} from 'rxjs/operators';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {IProduct, ISales, ICredit, IDue} from './salesReport';
import {SalesReportService} from './salesReport.service';
import {Subscription} from 'rxjs';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
// import {DialogComponent} from './dialog/dialog.component';
import {DialogOverviewExampleDialog} from '../../mat-components/dialogs/dialog-overview/dialog-overview.component';
import {DatePipe} from '@angular/common';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
// import {DialogComponent} from '../product/dialog/dialog.component';


interface DialogData {
  interest: string;
  period: number;
  payingDueDate: string;
  payingDueAmount: string;
}

@Component({
  selector: 'app-salesreport-credit1',

  templateUrl: './salesReport-creditTab.component.html',

  styleUrls: ['./salesReport.component.scss']
})
export class SalesReportCreditTabComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['dueAmount', 'dueCurrentDate', 'duePaid', 'payingDueDate', 'payingDueAmount', 'gracePeriod'];
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

  // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<IDue>;
  @ViewChild('input', {static: false}) input: ElementRef;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  // dataSource: MatTableDataSource <User>;
  constructor(private dataService: SalesReportService,
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
    this.sub = this.dataService.selectedCreditChanges$.subscribe(due => {
      this.creditDue = due;
      console.log('the selected prod in parent', this.creditDue);
      this.dataSource = new MatTableDataSource(this.creditDue);
      this.dataSource.paginator = this.paginator;
      // this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  openDialog(obj): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog1, {
      width: '425px',
      data: obj,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      // const arr = (Object.assign({}, this.creditDue));
      // console.log('array of credit no ', arr[0].creditNo);
      this.dataService.addGracePeriod(result).subscribe((data) => {
        console.log('the new greace updated is', data);
        this.snackBar.open(`user ${result.customerName} updated successfully`, 'ok', {
          duration: 3000
        });
      });

      // this.dataService.updatePendingDue(result).subscribe((data) => {
      //   console.log('the new greace updated is', data);
      //   this.snackBar.open(`user ${result.customerName} updated successfully`, 'ok', {
      //     duration: 3000
      //   });
      // });

    });
  }
}

@Component({
  template: `
    <h1 mat-dialog-title> Allow Grace Period :: </h1>

    <div mat-dialog-content>
      <form [formGroup]="newEventForm" autocomplete="off" novalidate>
        <div class="form-group" [ngClass]="{'error': grace.invalid && grace.dirty }">
          <label for="grace">grace:</label>
          <input formControlName="grace" id="grace" type="number" class="form-control" placeholder="grace..."/>
          <div *ngIf="grace.invalid && (grace.dirty || grace.touched)"
               class="alert alert-danger">
            <div *ngIf="grace.errors.required">
              grace is required.
            </div>
          </div>
        </div>

        <div class="form-group" [ngClass]="{'error': payingDueAmount.invalid && payingDueAmount.dirty }">
          <label for="grace">Paying Due Amount:</label>
          <input formControlName="payingDueAmount" id="payingDueAmount" type="number" class="form-control"
                 placeholder="payingDueAmount..."/>
          <div *ngIf="payingDueAmount.invalid && (payingDueAmount.dirty || payingDueAmount.touched)"
               class="alert alert-danger">
            <div *ngIf="payingDueAmount.errors.required">
              payingDueAmount is required.
            </div>
          </div>
        </div>
        <div class="form-group" [ngClass]="{'error': payingDueDate.invalid && payingDueDate.dirty }">
          <label for="salesDate">paying Due Date :</label>
          <input formControlName="payingDueDate" id="payingDueDate" type="date" [readonly]="true" class="form-control"
                 placeholder="payingDueDate..."/>
          <div *ngIf="payingDueDate.invalid && (payingDueDate.dirty || payingDueDate.touched)"
               class="alert alert-danger">
            <div *ngIf="payingDueDate.errors.required">
              payingDueDate is required.
            </div>
          </div>
        </div>

        <div class="form-group row mb-2">
          <div class="col-md-8">
            <div class="form-check">
              <label class="form-check-label">
                <input class="form-check-input"
                       id="sendCatalogId"
                       type="checkbox"
                       formControlName="sendInterest">Want To Add Interest?
              </label>
            </div>
          </div>

          <!--      <div class="form-group" [ngClass]="{'error': amountWithInterest.invalid && amountWithInterest.dirty }">-->
          <!--        <label for="amountWithInterest">amountWithInterest:</label>-->
          <!--        <input formControlName="totalPayableDues" id="totalPayableDues" type="number" class="form-control" [readonly]="true" placeholder="amountWithInterest..." />-->
          <!--        <div *ngIf="amountWithInterest.invalid && (amountWithInterest.dirty || amountWithInterest.touched)"-->
          <!--             class="alert alert-danger">-->
          <!--          <div *ngIf="amountWithInterest.errors.required">-->
          <!--            amountWithInterest is required.-->
          <!--          </div>-->
          <!--          <div *ngIf="amountWithInterest.errors.pattern">-->
          <!--            amountWithInterest must be start number.-->
          <!--          </div>-->
          <!--        </div>-->
          <!--      </div>-->
          <!--      -->


        </div>
      </form>
    </div>
    <div mat-dialog-actions>
      <button type="button" class="btn btn-default" (click)="onNoClick()">No</button>
      <button type="button" class="btn btn-primary" [mat-dialog-close]="this.data">Ok</button>
    </div>
  `
})
export class DialogOverviewExampleDialog1 implements OnInit {
  newEventForm: FormGroup;
  type;
  period = 0;
  localData: ICredit;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog1>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    console.log('the DATA PASSED INTO DIALOG====>', data);
    // this.localData = {...data};

  }

  ngOnInit(): void {
    this.newEventForm = this.fb.group({
      grace: new FormControl('', [Validators.pattern('[0-9].*')]),
      payingDueAmount: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
      payingDueDate: new FormControl('', Validators.required),
      sendInterest: false,
      amountWithInterest: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),

    });

    // this.newEventForm.get('payingDueDate').valueChanges.pipe(debounceTime(1000)).subscribe(
    //   value => {
    //     this.data.payingDueDate = value;
    //   });
    this.newEventForm.get('payingDueAmount').valueChanges.pipe(debounceTime(1000)).subscribe(
      value => {
        this.data.payingDueAmount = value;
        let dp = new DatePipe(navigator.language);
        let f = 'yyyy-MM-dd'; //'y-MM-dd'; // YYYY-MM-DD
        let dtr1 = dp.transform(new Date(), f);
        console.log('paying due date=====>', dtr1);
        this.newEventForm.patchValue({
          payingDueDate: dtr1,
        });
        this.data.payingDueDate = dtr1;
        // this.data.dueCurrentDate = this.localData.dueCurrentDate;

      });
    this.newEventForm.get('grace').valueChanges.pipe(debounceTime(1000)).subscribe(
      value => {
        this.data.gracePeriod = value;
        this.data.sendInterest = false;

      });
    this.newEventForm.get('sendInterest').valueChanges.pipe(debounceTime(1000)).subscribe(
      value => {
        this.data.sendInterest = value;
        // const gracePeriod = this.newEventForm.controls.credit.get('gracePeriod').value;
        //
        // const dueDate = this.data.dueCurrentDate
        // let year = new Date(this.data.dueCurrentDate).getFullYear();
        // let month = new Date(this.data.dueCurrentDate).getMonth();
        // console.log('i got year month loop ======>', year, month);
        // let days = new Date(year, month, 0).getDate();
        // console.log('i got year month  days loop ======>', days);
        //
        // let due = Math.round((parseInt(this.data.dueAmount, 10) / days) * parseInt(gracePeriod, 10));
        // newDue = parseInt(this.data.dueAmount, 10) + due;
        // Credit.creditDue[j].dueAmount = due,
        //   console.log('new due calc with interest (day  grace  newdue) =========>', days, req.body.gracePeriod, newDue);
        // }
      });
  }

  get sendInterest() {
    return this.newEventForm.get('sendInterest');
  }

  get grace() {
    return this.newEventForm.get('grace');
  }

  get payingDueAmount() {
    return this.newEventForm.get('payingDueAmount');
  }

  get payingDueDate() {
    return this.newEventForm.get('payingDueDate');
  }

  get amountWithInterest() {
    return this.newEventForm.get('amountWithInterest');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


