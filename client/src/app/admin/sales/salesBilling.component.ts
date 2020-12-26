import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SalesService} from './sales.service';
import {ISales} from './sales';
import {MatSnackBar, MatTableDataSource} from '@angular/material';
import {BehaviorSubject, Subscription} from 'rxjs';
import {ICredit} from '../salesReport/salesReport';
import {IProduct} from '../product/product';

class NavLink {
  constructor(public path: string, public label: string) {
  }
}

@Component({
  templateUrl: 'salesBilling.component.html',
  styleUrls: ['salesBilling.component.scss'],

})
export class SalesBillingComponent implements OnInit, OnDestroy {
  displayedColumns: string[]  = ['modelNo', 'companyName', 'productType' , 'qty', 'gstRate', 'sgstRate' , 'totalRate'];
  dataSource;
  private selectedCreditSource = new BehaviorSubject(null);
  selectedCreditChanges$ = this.selectedCreditSource.asObservable();
  navLinks: NavLink[] = [];
  public newEventForm: FormGroup;
  billNo = 0;
  date = null;
  sub: Subscription;

  customer: ISales;
  products;
  constructor(private fb: FormBuilder, public  salesService: SalesService ,  public snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    // this.newEventForm = this.fb.group({
    //   customerName: new FormControl('', Validators.required),
    //   address: new FormControl('', [
    //     Validators.required, Validators.minLength(4)]),
    //   email: new FormControl('', [Validators.required, Validators.email]),
    //   phoneNo: new FormControl('', [Validators.required, Validators.pattern(/(\(?[0-9]{3}\)?-?\s?[0-9]{3}-?[0-9]{4})/)]),
    //   mobileNo: new FormControl('', [Validators.required, Validators.pattern(/(\(?[0-9]{3}\)?-?\s?[0-9]{3}-?[0-9]{4})/)]),
    // });
    this.billNo = this.salesService.billNo;
    this.date = new Date();
    this.salesService.getCustomer(this.billNo).subscribe(
      customer => {
        if (customer) {
          this.customer = customer;
          console.log('the fetched sales for the customer is =====>', this.customer);
        } else if (customer) {
          this.snackBar.open(`No Sales Not Done`, 'ok', {
            duration: 3000
          });
        }
      });

    this.sub = this.salesService.selectedProductChanges$.subscribe(products => {
      this.products = products;
      console.log('the fetched sales for the product is =====>', this.products);

      this.dataSource = new MatTableDataSource(this.products);

    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  // get customerName() {
  //   return this.newEventForm.get('customerName');
  // }
  //
  // get address() {
  //   return this.newEventForm.get('address');
  // }
  //
  // get email() {
  //   return this.newEventForm.get('email');
  // }
  //
  // get phoneNo() {
  //   return this.newEventForm.get('phoneNo');
  // }
  //
  // get mobileNo() {
  //   return this.newEventForm.get('mobileNo');
  // }
}
