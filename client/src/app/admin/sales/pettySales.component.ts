import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators, FormBuilder, FormArray, ValidatorFn} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {PettySalesService} from './pettySales.service';
import {MatSnackBar} from '@angular/material';
import {ICustomer} from '../customer/customer';
import {IProduct} from '../product/product';
import {IPettySales} from './pettySales';
import {DatePipe} from '@angular/common';
import {IAccount} from '../account/account';
import {HttpErrorResponse} from '@angular/common/http';


@Component({
  selector: 'app-petty-sales',

  templateUrl: './pettySales.component.html',
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
export class PettySalesComponent implements OnInit {
  constructor(private fb: FormBuilder, private  salesService: PettySalesService, public snackBar: MatSnackBar) {
  }
  _isMounted = false;
  numberOfMonths = 0;
  isUserDate = false;
  newEventForm: FormGroup;
  customers: ICustomer[];
  names: string[];
  serials: string[];
  filteredCustomer;
  accountId;
  account: IAccount[];
  product: IProduct;
  productts: IProduct[];
  sales: IPettySales[];
  credit = [];
  netAmt;
  type: string;
  loan: string;
  bill: 0;
  endDue;
  startDue;
  onDue;
  // categorys: Observable<string[]>
  newId = 0;
  newCreditId = 0;

  // newEventForm: FormGroup;
  ngOnInit(): void {
    this._isMounted = true;
    if (this._isMounted === true) {
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
    // const amtControl = this.newEventForm.get('credit.initialAmountPaid');
    // amtControl.valueChanges.pipe(
    //   debounceTime(1000)
    // ).subscribe(
    //   value => {
    //     console.log('net amt=====>', this.salesService.totalSalesAmt);
    //     this.netAmt = this.salesService.totalSalesAmt - parseInt(value, 10);
    //     this.newEventForm.patchValue({
    //       totalNetAmount: this.salesService.totalSalesAmt,
    //     });
    //   }
    // );


    // this.products.controls[0].get('serialNo').valueChanges.subscribe(
    //   value => {
    //     this.products.controls[0].get('sendStock').patchValue(false, { emitEvent: false });
    //
    //     if (value) {
    //       let total = 0;
    //       const a = this.products.controls[0];
    //
    //
    //       this.salesService.getProduct(value).subscribe(
    //
    //
    //         product => {
    //           this.product = product;
    //           console.log('the selected product qty is =====>', this.product);
    //           const arr = (Object.assign({}, this.product));
    //           console.log('the selected product qty is =====>', arr[0]);
    //
    //           if (arr[0].qty <= 0) {
    //             this.snackBar.open(`Sorry Quantity is Zero `, 'ok', {
    //               duration: 3000
    //             });
    //           } else  if (arr[0].qty <= 5) {
    //             this.snackBar.open(`Only ${arr[0].qty} is Left.Order Soon `, 'ok', {
    //               duration: 3000
    //             });
    //             a.get('modelNo').patchValue(arr[0].modelNo);
    //             a.get('companyName').patchValue(arr[0].companyName);
    //             a.get('productType').patchValue(arr[0].productType);
    //             a.get('productRate').patchValue(arr[0].rate);
    //             a.get('gstRate').patchValue(arr[0].gstRate);
    //             a.get('sgstRate').patchValue(arr[0].sgstRate);
    //           } else {
    //             a.get('modelNo').patchValue(arr[0].modelNo);
    //             a.get('companyName').patchValue(arr[0].companyName);
    //             a.get('productType').patchValue(arr[0].productType);
    //             a.get('productRate').patchValue(arr[0].rate);
    //             a.get('gstRate').patchValue(arr[0].gstRate);
    //             a.get('sgstRate').patchValue(arr[0].sgstRate);
    //           }
    //         },
    //         (err: HttpErrorResponse) => {
    //           window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
    //         });
    //
    //       // this.salesService.getProduct(value).subscribe(
    //       //   product => {
    //       //     this.product = product;
    //       //     const arr = (Object.assign({}, this.product));
    //       //     if (arr[0].qty === 0) {
    //       //       this.snackBar.open(`Sorry Quantity is Zero `, 'ok', {
    //       //         duration: 3000
    //       //       });
    //       //     } else {
    //       //       a.get('modelNo').patchValue(arr[0].modelNo);
    //       //       a.get('companyName').patchValue(arr[0].companyName);
    //       //       a.get('productType').patchValue(arr[0].productType);
    //       //       a.get('productRate').patchValue(arr[0].rate);
    //       //       a.get('gstRate').patchValue(arr[0].gstRate);
    //       //       a.get('sgstRate').patchValue(arr[0].sgstRate);
    //       //     }
    //       //   });
    //       a.get('qty').valueChanges.pipe(debounceTime(1000)).subscribe(data => {
    //         this.products.controls[0].get('sendStock').patchValue(false, { emitEvent: false });
    //
    //         if (a.get('serialNo').value === null) {
    //           console.log('why iam not executing?');
    //           this.snackBar.open(`Make Sure Serial No index zero qty  Has Selected?`, 'ok', {
    //             duration: 3000
    //           });
    //
    //         } else if (this.products.controls[0].get('serialNo').value !== '') {
    //           total = 0;
    //           if (data) {
    //             const arr = (Object.assign({}, this.product));
    //             total = a.get('qty').value * ((arr[0].rate * arr[0].gstRate) / 100 + arr[0].rate + (arr[0].rate * arr[0].sgstRate) / 100);
    //             a.get('totalRate').patchValue(total);
    //           }
    //         }
    //       });
    //     }
    //   });
    // this.products.controls[0].get('sendStock').valueChanges.pipe(debounceTime(1000)).subscribe(
    //   value => {
    //     if (this.products.controls[0].get('serialNo').value === null) {
    //       console.log('why iam not executing?');
    //       this.snackBar.open(`Make Sure  index zero send stock Serial No Has Selected?`, 'ok', {
    //         duration: 3000
    //       });
    //
    //     } else if (this.products.controls[0].get('serialNo').value !== '' &&
    //       this.products.controls[0].get('qty').value !== null && this.products.controls[0].get('qty').value > 0 &&
    //       this.products.controls[0].get('sendStock').value === true) {
    //
    //       if (value) {
    //         // this.products.controls[0].get('sendStock').disable({onlySelf: true});
    //       }
    //     }
    //   });
  }

  getInitialLoad() {
    this.newEventForm = this.fb.group({
      billNo: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
      salesDate: new FormControl('', Validators.required),
      products: this.fb.array([]),
      totalNetAmount: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
    });
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

    this.salesService.getPettyProducts().subscribe(
      products => {
        this.productts = products;
        this.serials = this.productts.map(prod => prod.serialNo);
        // this.serials[0] = 'SELECT';
        console.log('fetched serial number is ===-====>', this.serials);
      });
    this.salesService.getMaxBillNo().subscribe(
      sales => {
        this.sales = sales;
        if (this.sales) {
          this.newId = this.getNextAvailableID(this.sales);
          console.log('the new id is:', this.newId);
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
      });

  }

  getNextAvailableID(sales: IPettySales[]): number {
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

  get products(): FormArray {
    return <FormArray>this.newEventForm.get('products');
  }

  addProduct(i) {
    this.products.push(this.buildProduct());
    for (let val of this.products.controls) {
      if (val) {
        let total = 0;
        val.get('serialNo').valueChanges.pipe(debounceTime(1000)).subscribe(data => {
          console.log('IAM IN SERIAL NO');
          val.get('sendStock').patchValue(false, { emitEvent: false });
          val.get('qty').patchValue('', { emitEvent: false });
          if (val.get('serialNo').value) {
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

        val.get('qty').valueChanges.pipe(debounceTime(1000)).subscribe(value => {
          console.log('IAM IN QTY');
          val.get('sendStock').patchValue(false, { emitEvent: false });

          // if (val.get('serialNo').value === null) {
          //   console.log('why iam not executing?');
          //   this.snackBar.open(`Make Sure not index zero qty value changes Serial No Has Selected?`, 'ok', {
          //     duration: 3000
          //   });
          //
          // } else if (this.products.controls[0].get('serialNo').value !== '') {

            total = 0;
            const arr = (Object.assign({}, this.product));
            total = val.get('qty').value * ((arr[0].rate * arr[0].gstRate) / 100 + arr[0].rate + (arr[0].rate * arr[0].sgstRate) / 100);
            val.get('totalRate').patchValue(total);
          // }
        });
      });

        // this.products.controls[i].get('sendStock').valueChanges.pipe(debounceTime(1000)).subscribe(
        //   value => {
        //     if (this.products.controls[i].get('serialNo').value === null) {
        //       console.log('why iam not executing?');
        //       this.snackBar.open(`Make Sure  index not  zero send stock value changes Serial No Has Selected?`, 'ok', {
        //         duration: 3000
        //       });
        //
        //     } else if (this.products.controls[i].get('serialNo').value !== '' &&
        //       this.products.controls[i].get('qty').value !== null && this.products.controls[0].get('qty').value > 0 &&
        //       this.products.controls[i].get('sendStock').value === true) {
        //
        //       if (value) {
        //         // this.products.controls[0].get('sendStock').disable({onlySelf: true});
        //       }
        //     }
        //   });
      }
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

  reduceStock(no: number) {
    this.products.controls[no].get('sendStock').patchValue(true , { emitEvent: false });

    console.log('IAM IN REDUCE STOCK', this.products.controls[no].get('serialNo').value, this.products.controls[no].get('qty').value,  this.products.controls[no].get('sendStock').value);
    if ( this.products.controls[no].get('serialNo').value === '' ||
      this.products.controls[no].get('qty').value === null || this.products.controls[no].get('qty').value <= 0 || this.products.controls[no].get('sendStock').value === false) {
      this.snackBar.open(`Make Sure reduce stock Qty And Serial No  Has Selected And Valid ?`, 'ok', {
        duration: 3000
      });

    } else if ( this.products.controls[no].get('serialNo').value !== '' ||
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
      this.newEventForm.patchValue({
        totalNetAmount: this.salesService.totalSalesAmt,
      });
      this.salesService.updateQuantity(qty, serial, action).subscribe(
        data => {
          console.log('the new item deleted is', data);
          this.snackBar.open(` ${qty} reduced successfully`, 'ok', {
            duration: 3000
          });
        });
      this.products.controls[no].get('sendStock').disable({onlySelf: true});

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
      qty: new FormControl('', [Validators.required,  Validators.min(1), Validators.max(10), Validators.pattern('[0-9].*')]),
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

  get totalNetAmount() {
    return this.newEventForm.get('totalNetAmount');
  }


  clear(): void {
    this._isMounted = false;
    console.log('mounted flag', this._isMounted);
    if (this._isMounted === false) {
      this.newEventForm.reset();
       this.products.controls.pop();

      //   for (let i = 0; i <= this.products.controls.length; i++) {
     // if ( this.products.controls[0]) {
     //   console.log('iam in controls zero');
     //   this.products.controls.splice(i, 1);
     //
     //   // this.products.controls[0].reset();
     // // } else if (!this.products.controls[0]) {
     // //   console.log('iam in else');
     // //   this.products.controls.pop();
     // }
     //
     //   }
      this.getInitialLoad();
    }
    // this.newEventForm.reset();
    // this.newEventForm.controls.length.reset();
    // this.getInitialLoad();

  }

  save() {

    // this.newEventForm.patchValue({
    //   totalNetAmount: this.salesService.totalSalesAmt,
    // });
    const acc = {
      accountNo: this.accountId,
      particulars: `Petty Sales billNo ${this.newEventForm.get('billNo').value} `,
      debit: 0,
      credit: this.newEventForm.get('totalNetAmount').value,
      createdOn: new Date().toLocaleDateString(),
    };
    console.log('the object created ========>', acc);

    console.log('Saved: ' + JSON.stringify(this.newEventForm.value, null, 2));

    this.salesService.addPettySale(this.newEventForm.value).subscribe((data: IPettySales) => {
        console.log('the added finance sales are', data);
        this.snackBar.open(`sales Bill generated for  ${this.newEventForm.get('billNo').value}  successfully`, 'ok', {
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
