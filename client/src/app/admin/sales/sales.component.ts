import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators, FormBuilder, FormArray, ValidatorFn} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {SalesService} from './sales.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ICustomer} from '../customer/customer';
import {IProduct} from '../product/product';
import {ISales, ICredit} from './sales';
import {DatePipe} from '@angular/common';
import {IAccount} from '../account/account';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {map, startWith} from 'rxjs/operators';
import {TabService} from './tab.service';
import {Subscription} from 'rxjs';
import {DialogBoxComponent} from './dialog-boxx/dialog-boxx.component';

@Component({
  selector: 'app-sales',

  templateUrl: './sales.component.html',
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
export class SalesComponent implements OnInit {
  constructor(private fb: FormBuilder, private _router: Router, private  salesService: SalesService, public snackBar: MatSnackBar ,
              public dialog: MatDialog, private _myTabService : TabService) {

  }
  @ViewChild('tabGroup', {static: true}) tabGroup;
  private subscription: Subscription;
  _isMounted = false;
  activeTab: number = 0
  numberOfMonths = 0;
  isUserDate: boolean = false;
  newEventForm: FormGroup;
  customers: ICustomer[];
  names: string[];
  serials: string[];
  filteredCustomer;
  product: IProduct;
  productts: IProduct[];
  sales: ISales[];
  accountId;
  credit = [];
  options ;
  account: IAccount[];
  netAmt;
  type: string;
  loan: string;
  bill: 0;
  endDue;
  startDue;
  onDue;
  selectedIndex = 0;
  filteredStates: Observable<any[]>;
  newId = 0;
  newCreditId = 0;
  filteredOptions: Observable<string[]>;
  // newEventForm: FormGroup;this.buildProduct()
  ngOnInit(): void {
    this._isMounted = true;
    if (this._isMounted) {
      this.getLoad();
    }
  }
  getLoad() {
    this.numberOfMonths = 0;
    this.isUserDate = false;
    this.netAmt = 0;
    this.bill = 0;
    this.salesService.totalSalesAmt = 0;
    console.log('iam started');

    this.getInitialLoad();






    this.salesService.getProducts().subscribe(
      products => {
        this.productts = products;
        this.serials = this.productts.map(prod => prod.serialNo);
        // this.serials[0] = 'SELECT';
        console.log('fetched serial number is ===-====>', this.serials);
      });
    this.newEventForm.get('billType').valueChanges.pipe(debounceTime(1000)).subscribe(
      value => {
        this.type = value;
        let nextId;
        if (this.type === 'credit') {
          this.salesService.getMaxCreditNo().subscribe(
            credit => {
              this.credit = credit;
              console.log('the sale record =====>', this.credit);
              if (this.credit) {
                this.newCreditId = this.getNextAvailableCreditID(this.credit);
                console.log('the new id is:', this.newCreditId);
              } else {
                this.newCreditId = 1;
              }
              this.newEventForm.controls.credit.patchValue({
                billNo: this.newId,
                creditNo: this.newCreditId,
              });
            },
            (err: HttpErrorResponse) => {
              window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
            });

        } else if (this.type === 'finance') {
          this.newEventForm.patchValue({
            totalNetAmount: this.salesService.totalSalesAmt,
          });
        } else if (this.type === 'cash') {
          this.newEventForm.patchValue({
            totalNetAmount: this.salesService.totalSalesAmt,
          });
        }
        this.setBillType(value);
      }
    );

    this.newEventForm.controls.credit.get('loanTenure').valueChanges.pipe(debounceTime(1000)).subscribe(
      value => {
        this.setLoanTenure(value);
        this.loan = value;
      }
    );
    const amtControl = this.newEventForm.get('credit.initialAmountPaid');
    amtControl.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      value => {
        console.log('net amt=====>', this.salesService.totalSalesAmt);
        this.netAmt = this.salesService.totalSalesAmt - parseInt(value, 10);
        this.newEventForm.patchValue({
          totalNetAmount: this.salesService.totalSalesAmt,
        });
        this.newEventForm.controls.credit.patchValue({
          loanAmount: this.netAmt,
        });
      }
    );

    // const loanControl = this.newEventForm.get('credit.loanTenure');
    // loanControl.valueChanges.pipe(
    //   debounceTime(1000)
    // ).subscribe(
    //   value => {
    //     console.log('month=====>', value);
    //     let month = Math.round(this.netAmt / parseInt(value,10)) ;
    //     console.log('month due=====>', value);
    //
    //
    //     this.newEventForm.controls.credit.patchValue({
    //       monthsToPay: parseInt(value,10),
    //       duePerMonth: month,
    //     });
    //   }
    // );

    this.newEventForm.controls.credit.get('loanInterest').valueChanges.pipe(debounceTime(1000)).subscribe(
      value => {
        if (value) {
          let monthTenure, monthlyInterestRatio, bottom;
          let yearTenure;
          let emi: number;
          let interest: number;
          let loanAmount: number;
          let top, sp, full;
          loanAmount = this.newEventForm.controls.credit.get('loanAmount').value;
          // if (this.newEventForm.controls.credit.get('loanTenure').value === 'months') {
          if (this.loan === 'months') {
            monthTenure = this.newEventForm.controls.credit.get('loanTenureMonths').value;
          } else {
            yearTenure = this.newEventForm.controls.credit.get('loanTenureYears').value;
          }
          console.log('the loan interest is ========>', value);
          monthlyInterestRatio = (value / 12) / 100;
          console.log('monthly interest rate =======>', monthlyInterestRatio);
          console.log('year rate =======>', yearTenure);
          if (monthTenure !== undefined) {
            this.numberOfMonths = monthTenure;
          } else if (yearTenure !== undefined) {
            console.log('else block');
            this.numberOfMonths = (yearTenure * 12);
          }
          console.log('no of months =========>', this.numberOfMonths);
          top = Math.pow((1 + monthlyInterestRatio), this.numberOfMonths);
          console.log('the top is =============>', top);
          bottom = top - 1;
          console.log('the bottom is =============>', bottom);
          sp = top / bottom;
          emi = ((loanAmount * monthlyInterestRatio) * sp);
          console.log('emi ================>', emi.toFixed(0));
          full = this.numberOfMonths * emi;
          interest = full - loanAmount;
          const current = new Date();
          const dat = new Date().toISOString().slice(0, 10);
          var datePipe = new DatePipe('en-US');

          const eDue = this.addMonths(new Date(), this.numberOfMonths);


          // const df = datePipe.transform(eDue, 'dd-MM-yyyy');
          let endDue = new Date().setMonth(new Date().getMonth() + +this.numberOfMonths);
          let df = datePipe.transform(endDue, 'yyyy/MM/dd');
          console.log('i found the answer ==========>', dat, eDue, df);

          // let endDue = this.addMonths(new Date(), this.numberOfMonths).toString();
          console.log('end due date ===========>', endDue);
          let dp = new DatePipe(navigator.language);
          let cal = 'yyyy-MM-dd';   //'y-MM-dd';
          let p = 'yyyy-MM-dd'; //'y-dd-MM'; //'y-MM-dd'; // YYYY-MM-DD
          let dtr = dp.transform(current, cal);
          let end = dp.transform(endDue, cal);
          console.log('range dates', (dp.transform(current, cal)));
          console.log('range dates', (dp.transform(endDue, cal)));
          var datePipe = new DatePipe('en-US');

          let range = this.dateRange(dp.transform(current, cal), dp.transform(endDue, cal));
          console.log('range dates =============>', range);
          console.log('interest rate ==========>', interest.toFixed(0));
          this.newEventForm.controls.credit.patchValue({
            EMIPerMonth: emi.toFixed(0),
            totalInterestPayable: interest.toFixed(0),
            totalAmountPayable: full.toFixed(0),
            duePayableDate: dat,
            totalPayableDues: this.numberOfMonths,
            dueEndYear: dp.transform(endDue, cal),
            currentDue: range[0],
            betweenDues: range,

          });
        }
      });

    this.newEventForm.controls.credit.get('duePayableDate').valueChanges.pipe(debounceTime(1000)).subscribe(
      value => {
        if (value) {
          this.isUserDate = !this.isUserDate;
          console.log('iam in user changed me changed', value);
          let startDue = new Date(value).toISOString().slice(0, 10);
          var datePipe = new DatePipe('en-US');
          let endDue = new Date(value).setMonth(new Date(value).getMonth() + +this.numberOfMonths);
          console.log('after getting date from user end due ===========>', endDue);

          let end = this.addMonths(new Date(value), this.numberOfMonths);
          // const end = datePipe.transform(endDue, 'yyyy-MM-dd');

          const df = datePipe.transform(endDue, 'dd-MM-yyyy');

          let dp2 = new DatePipe(navigator.language);
          let cal1 = 'y-MM-dd';
          let range = this.dateRange(dp2.transform(value, cal1), dp2.transform(endDue, cal1));
          // let range = this.dateRange(startDue, endDue);

          console.log('after getting date from user ===========>', range);
          this.newEventForm.controls.credit.patchValue({
            betweenDues: range,
            dueEndYear: dp2.transform(endDue, cal1),
            dueStartYear: startDue,
          });
        }
      });
  }
  onEnter(evt: any) {
    if (evt.source.selected) {
      console.log('the changed value is====>', evt.source.valueOf().value);

      this.filteredCustomer = this.customers.filter(cus => cus.name === evt.source.valueOf().value);
            this.populateFillterdCustomer(Object.assign({}, this.filteredCustomer));

    }
  }
  filterStates(name: string) {
    return this.customers.filter(customer =>
      customer.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  getInitialLoad() {
    this.newEventForm = this.fb.group({
      billNo: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
      salesDate: new FormControl('', Validators.required),
      customerName: new FormControl('', Validators.required),
      address: new FormControl('', [
        Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNo: new FormControl('', [Validators.required, Validators.pattern(/(\(?[0-9]{3}\)?-?\s?[0-9]{3}-?[0-9]{4})/)]),
      products: this.fb.array([]),
      totalNetAmount: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
      billType: new FormControl('', Validators.required),
      delivered: new FormControl('', Validators.required),
      // delivered: true,
      credit: this.fb.group({
        billNo: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
        creditNo: new FormControl('', Validators.required),
        initialAmountPaid: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
        loanAmount: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
        loanTenure: new FormControl('', Validators.required),
        loanTenureMonths: new FormControl('', Validators.required),
        loanTenureYears: new FormControl('', Validators.required),
        loanInterest: new FormControl('', Validators.required),
        EMIPerMonth: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
        totalInterestPayable: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
        totalAmountPayable: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
        duePayableDate: new FormControl('', Validators.required),
        totalPayableDues: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
        dueEndYear: new FormControl('', Validators.required),
        // currentDue: new FormControl('', Validators.required),

        betweenDues: new FormControl('', Validators.required)
      }),
      financeName: new FormControl('', Validators.required),

    });
    this.salesService.getCustomers().subscribe(
      customers => {
        this.customers = customers;
        this.names = this.customers.map(cus => cus.name);
        // this.names[0] = 'SELECT';
        console.log('fetched customer is ===-====>', this.customers);
      });
    this.filteredStates = this.newEventForm.get('customerName').valueChanges
      .pipe(
        startWith(''),
        map(name => name ? this.filterStates(name) : this.customers)
      );
    this.salesService.getMaxAccountNo().subscribe(
      account => {
        this.account = account;
        if (!!this.account) {
          this.accountId = this.getNextAvailableAccount(this.account);
          console.log('the new account id is:', this.accountId);
        } else {
          this.accountId = 0;
        }
      });





    this.salesService.getMaxBillNo().subscribe(
      sales => {
        this.sales = sales;
        if (this.sales) {
          this.newId = this.getNextAvailableID(this.sales);
          console.log('the new id is:', this.sales);
        } else {
          this.newId = 1;
        }
        let dp = new DatePipe(navigator.language);
        let f = 'y-MM-dd'; //'y-MM-dd'; // YYYY-MM-DD
        let dtr1 = dp.transform(new Date(), f);
        this.newEventForm.patchValue({
          billNo: this.newId,
          salesDate: dtr1,
        });
      },
      (err: HttpErrorResponse) => {
        window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
      });


    // this.newEventForm.get('customerName').valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value))
    // );
      // .subscribe(
      // value => {
      //   if (value) {
      //     console.log('filter customer =========>', value);
      //
      //     this.filteredCustomer = this.customers.filter(cus => cus.name === value);
      //       this.names = value;
      //
      //     this.populateFillterdCustomer(Object.assign({}, this.filteredCustomer));
      //   }
      // });



    // this.newEventForm.get('customerName').valueChanges.pipe(debounceTime(1000)).subscribe(
    //   value => {
    //     if (value) {
    //       this.filteredCustomer = this.customers.filter(cus => cus.name === value);
    //        // this.names = this._filter(value);
    //
    //       this.populateFillterdCustomer(Object.assign({}, this.filteredCustomer));
    //     }
    //   });
  }

  populateFillterdCustomer(cus: ICustomer): void {
    let addr = `${cus[0].address.street} , ${cus[0].address.city},${cus[0].address.state},${cus[0].address.zipCode}`;
    console.log('the address is ===============>', addr);
    this.newEventForm.patchValue({
      address: addr,
      email: cus[0].email,
      phoneNo: cus[0].phone1

    });
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log('**********',this.names.filter(option => option.toLowerCase().includes(filterValue)) );
    return this.names.filter(option => option.toLowerCase().includes(filterValue));
  }

  getNextAvailableID(sales: ISales[]): number {
    let maxID = 0;
    sales.forEach(function (element, index, array) {
      if (element.billNo) {
        if (element.billNo > maxID) {
          maxID = element.billNo;
        }
      }
    });
    console.log('the maxid', maxID);
    return ++maxID;
  }

  getNextAvailableCreditID(credit: ICredit[]): number {
    let maxID = 0;
    credit.forEach(function (element, index, array) {
      if (element.creditNo) {
        if (element.creditNo > maxID) {
          maxID = element.creditNo;
        }
      }
    });
    console.log('the maxid', maxID);
    return ++maxID;
  }
  onInputChanged(searchStr: string): void {
    if (searchStr) {
      this.options = [];
      this.options = this.customers.filter(cus => cus.name.toLowerCase().startsWith(searchStr));
      if (!this.options) {
        this.snackBar.open(`Customer Name Does Not Exist.Add New Entry?`, 'ok', {
          duration: 3000
        });
      }
      console.log('the address is ****************=>', this.options);

      this.populateFillterdCustomer(Object.assign({}, this.options));
    } else {
      this.options = this.names;

    }
    // if (this.subscription) {
    //   this.subscription.unsubscribe();
    // }
    // this.subscription = this.yourService.getFilteredData(searchStr).subscribe((result) => {
    //   this.options = result;
    // });
  }
  // getNextAvailableCreditID(sales: ISales[]): number {
  //   let maxID = 0;
  //   sales.forEach(function (element, index, array) {
  //     if(element.billType === 'credit') {
  //       console.log('iam exist', element.credit.creditNo);
  //       if (element.credit.creditNo) {
  //         if (element.credit.creditNo > maxID) {
  //           maxID = element.credit.creditNo;
  //         }
  //       }
  //     }
  //   });
  //   console.log('the max  of creditor id is=(*****>', maxID);
  //   return ++maxID;
  // }

  get products(): FormArray {
    return <FormArray>this.newEventForm.get('products');
  }

  addProduct(i) {
    if (this.newEventForm.get('customerName').value === '') {
      this.snackBar.open(`Make Sure  Customer Name Has Selected And Valid ?`, 'ok', {
        duration: 3000
      });

    } else if (this.newEventForm.get('customerName').value !== '') {

      this.products.push(this.buildProduct());
      for (let val of this.products.controls) {
        if (val) {
          let total = 0;
          val.get('serialNo').valueChanges.pipe(debounceTime(1000)).subscribe(data => {
            console.log('the serial no ==========>', val.get('serialNo').value);
            val.get('sendStock').patchValue(false, {emitEvent: false});
            if (val.get('serialNo').value !== null) {
console.log('the serial no exist *******', val.get('serialNo').value)
              this.salesService.getProduct(val.get('serialNo').value).subscribe(
              product => {
                this.product = product;
                console.log('the selected product qty is =====>', this.product);
                const arr = (Object.assign({}, this.product));
                console.log('the selected product qty is =====>', arr[0]);

                if (arr[0].qty <= 0) {
                  this.snackBar.open(`Sorry Quantity is Zero `, 'ok', {
                    duration: 3000
                  });
                } else if (arr[0].qty <= 5) {
                  this.snackBar.open(`Only ${arr[0].qty} is Left.Order Soon `, 'ok', {
                    duration: 3000
                  });
                  val.get('modelNo').patchValue(arr[0].modelNo);
                  val.get('companyName').patchValue(arr[0].companyName);
                  val.get('productType').patchValue(arr[0].productType);
                  val.get('productRate').patchValue(arr[0].rate);
                  val.get('gstRate').patchValue(arr[0].gstRate);
                  val.get('sgstRate').patchValue(arr[0].sgstRate);
                } else {
                  val.get('modelNo').patchValue(arr[0].modelNo);
                  val.get('companyName').patchValue(arr[0].companyName);
                  val.get('productType').patchValue(arr[0].productType);
                  val.get('productRate').patchValue(arr[0].rate);
                  val.get('gstRate').patchValue(arr[0].gstRate);
                  val.get('sgstRate').patchValue(arr[0].sgstRate);
                }
              },
              (err: HttpErrorResponse) => {
                window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
              });
          }
            val.get('qty').valueChanges.pipe(debounceTime(1000)).subscribe(qty => {
              val.get('sendStock').patchValue(false, {emitEvent: false});
              if (this.newEventForm.get('customerName').value === null && val.get('serialNo').value === null) {
                console.log('why iam not executing?');
                this.snackBar.open(`Make Sure  Customer Name And Serial No Has Selected?`, 'ok', {
                  duration: 3000
                });

              } else if (this.newEventForm.get('customerName').value !== '' && this.products.controls[0].get('serialNo').value !== '') {

                // if (qty === '0') {
                //   this.snackBar.open(`Make Sure Qty Is Not Zero`, 'ok', {
                //     duration: 3000
                //   });
                // }
                // this.products.controls[i].get('sendStock').patchValue(false);

                total = 0;
                const arr = (Object.assign({}, this.product));
                total = val.get('qty').value * ((arr[0].rate * arr[0].gstRate) / 100 + arr[0].rate + (arr[0].rate * arr[0].sgstRate) / 100);
                val.get('totalRate').patchValue(total);
              }
            });
          });

        }
      }
    }
  }
  reduceStock(no: number) {
    this.products.controls[no].get('sendStock').patchValue(true , { emitEvent: false });

    console.log('IAM IN REDUCE STOCK', this.newEventForm.get('customerName').value, this.products.controls[no].get('serialNo').value, this.products.controls[no].get('qty').value,  this.products.controls[no].get('sendStock').value);
    if (this.newEventForm.get('customerName').value === '' || this.products.controls[no].get('serialNo').value === '' ||
      this.products.controls[no].get('qty').value === null || this.products.controls[no].get('qty').value <= 0 || this.products.controls[no].get('sendStock').value === false) {
      this.snackBar.open(`Make Sure  Customer Name ,Qty And Serial No  Has Selected And Valid ?`, 'ok', {
        duration: 3000
      });

    } else if (this.newEventForm.get('customerName').value !== '' || this.products.controls[no].get('serialNo').value !== '' ||
      this.products.controls[no].get('qty').value !== null || this.products.controls[no].get('sendStock').value === true) {

      const qty = this.products.controls[no].get('qty').value;
      const serial = this.products.controls[no].get('serialNo').value;
      const action = 'delete';
      const modelNo = this.products.controls[no].get('modelNo').value;
      const companyName = this.products.controls[no].get('companyName').value;
      const productType = this.products.controls[no].get('productType').value;
      const productRate = this.products.controls[no].get('productRate').value;
      const gstRate = this.products.controls[no].get('gstRate').value;
      const sgstRate = this.products.controls[no].get('sgstRate').value;
      const totalRate = this.products.controls[no].get('totalRate').value;

      this.salesService.totalSalesAmt += parseInt(this.products.controls[no].get('totalRate').value, 10);
      this.salesService.updateQuantity(qty, serial, action).subscribe(
        data => {
          console.log('the new item deleted is', data);
          this.snackBar.open(` ${qty} reduced successfully`, 'ok', {
            duration: 3000
          });
          this.products.controls[no].get('sendStock').disable({onlySelf: true});

        },
        (err: HttpErrorResponse) => {
          window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
        });

      console.log('the quqntity ===== reduce====>', qty, this.salesService.totalSalesAmt);
      // this.products.controls[no].get('sendStock').valueChanges.pipe(debounceTime(1000)).subscribe(
      //   value => {
      //     if (value) {
      //       this.products.controls[no].get('sendStock').disable({onlySelf: true});
      //     }
      //   });
    }
  }

  deleteProduct(no: number) {
    this.products.removeAt(no);
  }

  buildProduct(): FormGroup {
    return this.fb.group({
      serialNo: new FormControl('', Validators.required),
      modelNo: new FormControl('', Validators.required),
      companyName: new FormControl('', Validators.required),
      productType: new FormControl('', Validators.required),
      qty: new FormControl('', [Validators.required, Validators.min(1), Validators.max(10), Validators.pattern('[0-9].*')]),
      productRate: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
      gstRate: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
      sgstRate: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
      totalRate: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
      sendStock: new FormControl('', Validators.required),
    });
  }


  get billNo() {
    return this.newEventForm.get('billNo');
  }

  get salesDate() {
    return this.newEventForm.get('salesDate');
  }

  get customerName() {
    return this.newEventForm.get('customerName');
  }

  get address() {
    return this.newEventForm.get('address');
  }

  get email() {
    return this.newEventForm.get('email');
  }

  get phoneNo() {
    return this.newEventForm.get('phoneNo');
  }

  get billType() {
    return this.newEventForm.get('billType');
  }

  get totalNetAmount() {
    return this.newEventForm.get('totalNetAmount');
  }

  get financeName() {
    return this.newEventForm.get('financeName');
  }

  get creditNo() {
    return this.newEventForm.controls.credit.get('creditNo');
  }

  get initialAmountPaid() {
    return this.newEventForm.controls.credit.get('initialAmountPaid');
  }

  get loanAmount() {
    return this.newEventForm.controls.credit.get('loanAmount');
  }

  get loanInterest() {
    return this.newEventForm.controls.credit.get('loanInterest');
  }

  get loanTenure() {
    return this.newEventForm.controls.credit.get('loanTenure');
  }

  get loanTenureMonths() {
    return this.newEventForm.controls.credit.get('loanTenureMonths');
  }

  get loanTenureYears() {
    return this.newEventForm.controls.credit.get('loanTenureYears');
  }

  get EMIPerMonth() {
    return this.newEventForm.controls.credit.get('EMIPerMonth');
  }

  get totalInterestPayable() {
    return this.newEventForm.controls.credit.get('totalInterestPayable');
  }

  get totalAmountPayable() {
    return this.newEventForm.controls.credit.get('totalAmountPayable');
  }

  get duePayableDate() {
    return this.newEventForm.controls.credit.get('duePayableDate');
  }

  get totalPayableDues() {
    return this.newEventForm.controls.credit.get('totalPayableDues');
  }

  get dueEndYear() {
    return this.newEventForm.controls.credit.get('dueEndYear');
  }

  get currentDue() {
    return this.newEventForm.controls.credit.get('currentDue');
  }

  get betweenDues() {
    return this.newEventForm.controls.credit.get('betweenDues');
  }

  clear(): void {
    this._isMounted = false;
    if (this._isMounted === false) {
      this.newEventForm.reset();
      this.products.controls.pop();
      // this.newEventForm.reset();
      this.getInitialLoad();
      // this._router.navigateByUrl('/sales');
       this._router.navigate(['/sales', 'salesBillingTab']);
      // this.selectedIndex = 3;
    }
  }

  getNextAvailableAccount(account: IAccount[]): number {
    let maxID = 0;
    this.account.forEach(function (element, index, array) {
      if (element.accountNo) {
        if (element.accountNo > maxID) {
          maxID = element.accountNo;
        }
      }
    });
    console.log('the new account maxid', maxID);
    return ++maxID;
  }

  save() {
    const array = [];
    this.salesService.billNo = this.newEventForm.get('billNo').value;

    if (this.type === 'credit') {
      console.log('hai iam in credit');

      const billNo = this.newEventForm.get('billNo').value;
      const creditNo = this.newEventForm.controls.credit.get('creditNo').value;
      const customerName = this.newEventForm.get('customerName').value;
      const dueAmount = this.newEventForm.controls.credit.get('EMIPerMonth').value;
      const dueStartYear = new Date(this.newEventForm.controls.credit.get('duePayableDate').value).toISOString();
      const dueEndYear = new Date(this.newEventForm.controls.credit.get('dueEndYear').value).toISOString();
      console.log('after conversion ======>', dueStartYear, dueEndYear);
      const duePaid = false;
      const gracePeriod = 0;
      for (let val of this.newEventForm.controls.credit.get('betweenDues').value) {
        const currentDue = new Date(val).toISOString();
        console.log('after conversion ======>', currentDue);
        const obj = {
          billNo: billNo,
          customerName: customerName,
          creditNo: creditNo,
          dueAmount: dueAmount,
          dueStartDate: dueStartYear,
          dueEndDate: dueEndYear,
          dueCurrentDate: currentDue,
          gracePeriod: gracePeriod,
          duePaid: duePaid,
        };
        array.push(obj);
        console.log('array ===>', array);
        // this.salesService.addCreditDue(obj).subscribe((data: ICreditDue) => {
        //   console.log('the added credit due are', data);
        //   this.snackBar.open(`Bill generated for  ${data.customerName}  successfully`, 'ok', {
        //     duration: 3000
        //   });
        // });
      }
      const acc = {
        accountNo: this.accountId,
        particulars: `Credit Sale BillNo${this.newEventForm.get('billNo').value}Initial Amt`,
        debit: 0,
        credit: this.newEventForm.controls.credit.get('initialAmountPaid').value,
        createdOn: new Date().toLocaleDateString(),
      };
      console.log('the account object created ========>', acc);

      const body = {obj: array, data: {...this.newEventForm.value}};
      console.log('Saved Credit due: ' + JSON.stringify(body, null, 2));

      this.salesService.creditSale(body).subscribe((sale: ISales) => {
          console.log('the added credit sales are', sale);
          this.snackBar.open(`Credit Bill generated for  ${this.newEventForm.get('customerName').value}  successfully`, 'ok', {
            duration: 3000
          });
        },
        (err: HttpErrorResponse) => {
          window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
        });


      this.salesService.addAccount(acc).subscribe(
        data => {
          console.log('the new purchased item is', data);
          // this.snackBar.open(` ${acc.accountNo} added successfully`, 'ok', {
          //   duration: 3000
          // });
        },
        (err: HttpErrorResponse) => {
          window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
        });


    } else if (this.type === 'finance') {
      console.log('hai iam in finance');
      const acc = {
        accountNo: this.accountId,
        particulars: `${this.newEventForm.get('financeName').value} Finance Sale BillNo${this.newEventForm.get('billNo').value} Amt`,
        debit: 0,
        credit: this.newEventForm.get('totalNetAmount').value,
        createdOn: new Date().toLocaleDateString(),
      };
      console.log('the account object created ========>', acc);
      console.log('Saved: ' + JSON.stringify(this.newEventForm.value, null, 2));

      this.salesService.addSale(this.newEventForm.value).subscribe((data: ISales) => {
          console.log('the added finance sales are', data);
          this.snackBar.open(`Finance Bill generated for  ${this.newEventForm.get('customerName').value} successfully`, 'ok', {
            duration: 3000
          });
        },
        (err: HttpErrorResponse) => {
          window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
        });


      this.salesService.addAccount(acc).subscribe(
        data => {
          console.log('the new purchased item is', data);
          // this.snackBar.open(` ${acc.accountNo} added successfully`, 'ok', {
          //   duration: 3000
          // });
        },
        (err: HttpErrorResponse) => {
          window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
        });


    } else if (this.type === 'cash') {
      console.log('hai iam in cash');
      const acc = {
        accountNo: this.accountId,
        particulars: ` Cash Sale BillNo ${this.newEventForm.get('billNo').value} Amt`,
        debit: 0,
        credit: this.newEventForm.get('totalNetAmount').value,
        createdOn: new Date().toLocaleDateString(),
      };
      console.log('the account object created ========>', acc);

      console.log('Saved: ' + JSON.stringify(this.newEventForm.value, null, 2));
      this.salesService.addSale(this.newEventForm.value).subscribe((data: ISales) => {
          console.log('the added finance sales are', data);
          this.snackBar.open(`Cash Bill generated for  ${this.newEventForm.get('customerName').value}  successfully`, 'ok', {
            duration: 3000
          });
        },
        (err: HttpErrorResponse) => {
          window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
        });


      this.salesService.addAccount(acc).subscribe(
        data => {
          console.log('the new purchased item is', data);
          // this.snackBar.open(` ${acc.accountNo} added successfully`, 'ok', {
          //   duration: 3000
          // });
        },
        (err: HttpErrorResponse) => {
          window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
        });
    }
    this._router.navigate(['/sales', 'salesBillingTab']);

  }

  setBillType(note: string): void {
    console.log('option', note);
    const finance = this.newEventForm.get('financeName');
    if (note === 'finance') {
      console.log('iam i finance', note);
      finance.setValidators(Validators.required);
    } else {
      finance.clearValidators();
    }
    finance.updateValueAndValidity({ onlySelf: false, emitEvent: true });
    const credit = this.newEventForm.get('credit');
    if (note === 'credit') {
      credit.setValidators(Validators.required);
    } else {
      credit.clearValidators();
    }
    credit.updateValueAndValidity({ onlySelf: false, emitEvent: true });
  }

  setLoanTenure(note: string): void {
    console.log('option', note);
    const finance = this.newEventForm.controls.credit.get('loanTenureMonths');
    if (note === 'months') {
      finance.setValidators(Validators.required);
    } else {
      finance.clearValidators();
    }
    finance.updateValueAndValidity();
    const credit = this.newEventForm.controls.credit.get('loanTenureYears');
    if (note === 'years') {
      credit.setValidators(Validators.required);
    } else {
      credit.clearValidators();
    }
    credit.updateValueAndValidity({ onlySelf: false, emitEvent: true });
  }

  dateRange(startDate, endDate) {
    let da;
    console.log('iam in date range ====>', startDate, endDate);
    let start = startDate.split('-');
    let end = endDate.split('-');
    let startYear = parseInt(start[0], 10);
    let endYear = parseInt(end[0], 10);
    console.log('iam in date range after split ====>', start, end);

    let dates = [];
    if (!this.isUserDate) {
      console.log('if block');
      da = new Date(startDate).getDate();
    } else if (this.isUserDate) {
      console.log('else block');
      da = new Date().getDate();
    }
    console.log('the current day selected ====>', da);
    for (let i = startYear; i <= endYear; i++) {
      let endMonth = (i !== endYear) ? 12 : parseInt(end[1], 10);
      let startMon = (i === startYear) ? parseInt(start[1], 10) : 0;
      console.log('the rangeeeeeeee selected ====>', endMonth, startMon);

      for (let j = startMon; j < endMonth; j = (j > 12) ? j % 12 || 12 : j + 1) {
        let month = j + 1;
        let displayMonth = month < 10 ? '0' + month : month;
        dates.push([i, displayMonth, da].join('-'));
      }
    }
    return dates;
  }

  addMonths(date, months) {
    let d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    // if (date.getDate() !== d) {
    //   date.setDate(0);
    // }
    // const formattedDate = date.toString().slice(0, 10);
    var datePipe = new DatePipe('en-US');
    const df = datePipe.transform(date, 'dd/MM/yyyy');

    console.log('iam in add month loop =====>', date, df);
    return date;
  }

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
        console.log('added item', {...result.data, createdOn});
        this.salesService.addUser({...result.data}).subscribe((data: ICustomer) => {
            console.log('the added user are', data);
            this.snackBar.open(` ${result.data.name} added successfully`, 'ok', {
              duration: 3000
            });
          },
          (err: HttpErrorResponse) => {
            window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
          });
        this.salesService.getCustomers().subscribe(
          customers => {
            this.customers = customers;
            this.names = this.customers.map(cus => cus.name);
            // this.names[0] = 'SELECT';
            console.log('fetched customer is ===-====>', this.customers);
          });

      }
});

  }
}
// var getRemanningDays = function() {
//   var date = new Date();
//   var time = new Date(date.getTime());
//   time.setMonth(date.getMonth() + 1);
//   time.setDate(0);
//   var days =time.getDate() > date.getDate() ? time.getDate() - date.getDate() : 0;
//   alert(days +' Days Remaining.');
//   $('#remainingday').html(days);
// }


// var diffDays1=(function(){
//   var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
//   var secondDate = new Date(new Date().getFullYear()+1,3,5);
//   var firstDate = new Date();
//   return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
// })();


// const date1 = new Date('7/13/2010');
// const date2 = new Date('12/15/2010');
// const diffTime = Math.abs(date2 - date1);
// const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
// console.log(diffDays);


// function daysDiff(dt1, dt2)
//
// {
//
//   // calculate the time difference of two dates JavaScript
//
//   var diffTime =(dt2.getTime() - dt1.getTime());
//
//   // calculate the number of days between two dates javascript
//
//   var daysDiff = diffTime / (1000 * 3600 * 24);
//
//   return daysDiff;
//
// }


// today = new Date()
// past = new Date(2010,05,01) // remember this is equivalent to 06 01 2010
// //dates in js are counted from 0, so 05 is june
//
// function calcDate(date1,date2) {
//   var diff = Math.floor(date1.getTime() - date2.getTime());
//   var day = 1000 * 60 * 60 * 24;
//
//   var days = Math.floor(diff/day);
//   var months = Math.floor(days/31);
//   var years = Math.floor(months/12);
//
//   var message = date2.toDateString();
//   message += " was "
//   message += days + " days "
//   message += months + " months "
//   message += years + " years ago \n"
//
//   return message
// }
//
//
// a = calcDate(today,past)
// console.log(a) // returns Tue Jun 01 2010 was 1143 days 36 months 3 years ago


// var DateDiff = {
//
//   inDays: function(d1, d2) {
//     var t2 = d2.getTime();
//     var t1 = d1.getTime();
//
//     return parseInt((t2-t1)/(24*3600*1000));
//   },
//
//   inWeeks: function(d1, d2) {
//     var t2 = d2.getTime();
//     var t1 = d1.getTime();
//
//     return parseInt((t2-t1)/(24*3600*1000*7));
//   },
//
//   inMonths: function(d1, d2) {
//     var d1Y = d1.getFullYear();
//     var d2Y = d2.getFullYear();
//     var d1M = d1.getMonth();
//     var d2M = d2.getMonth();
//
//     return (d2M+12*d2Y)-(d1M+12*d1Y);
//   },
//
//   inYears: function(d1, d2) {
//     return d2.getFullYear()-d1.getFullYear();
//   }
// }
//
// var dString = "May, 20, 1984";
//
// var d1 = new Date(dString);
// var d2 = new Date();
//
// document.write("<br />Number of <b>days</b> since "+dString+": "+DateDiff.inDays(d1, d2));
// document.write("<br />Number of <b>weeks</b> since "+dString+": "+DateDiff.inWeeks(d1, d2));
// document.write("<br />Number of <b>months</b> since "+dString+": "+DateDiff.inMonths(d1, d2));
// document.write("<br />Number of <b>years</b> since "+dString+": "+DateDiff.inYears(d1, d2));


// I have two date strings like this:
//
// var startDate = '2012-04-01';
// var endDate = '2014-11-01';
// And I want to end up with an array of strings like this:
//
// var dates = ['2012-04-01', '2012-05-01', '2012-06-01' .... '2014-11-01',];
// function dateRange(startDate, endDate) {
//   var start      = startDate.split('-');
//   var end        = endDate.split('-');
//   var startYear  = parseInt(start[0]);
//   var endYear    = parseInt(end[0]);
//   var dates      = [];
//
//   for(var i = startYear; i <= endYear; i++) {
//     var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
//     var startMon = i === startYear ? parseInt(start[1])-1 : 0;
//     for(var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j+1) {
//       var month = j+1;
//       var displayMonth = month < 10 ? '0'+month : month;
//       dates.push([i, displayMonth, '01'].join('-'));
//     }
//   }
//   return dates;
//  }


// dateRange('2013-11-01', '2014-06-01')
// ["2013-11-01", "2013-12-01", "2014-01-01", "2014-02-01", "2014-03-01", "2014-04-01", "2014-05-01", "2014-06-01", "2014-07-01", "2014-08-01", "2014-09-01", "2014-10-01", "2014-11-01", "2014-12-01"]

// function dateRange(startDate, endDate) {
//   let start = startDate.split('-');
//   let end = endDate.split('-');
//   let startYear = parseInt(start[0]);
//   let endYear = parseInt(end[0]);
//   let dates = [];
//
//   for (let i = startYear; i <= endYear; i++) {
//     let endMonth = (i !== endYear) ? 11 : parseInt(end[1], 10) - 1;
//     let startMon = (i === startYear) ? parseInt(start[1], 10) - 1 : 0;
//     for (let j = startMon; j <= endMonth; j = (j > 12) ? j % 12 || 11 : j + 1) {
//       let month = j + 1;
//       let displayMonth = month < 10 ? '0' + month : month;
//       dates.push([i, displayMonth, '01'].join('-'));
//     }
//   }
//   return dates;
// }

// this.date = new Date().toISOString().slice(0,10);
