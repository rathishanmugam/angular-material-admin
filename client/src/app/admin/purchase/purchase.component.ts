import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators, FormBuilder, FormArray, ValidatorFn} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';
import {ICustomer} from '../customer/customer';
import {IProduct} from '../product/product';
import {DatePipe} from '@angular/common';
import {PurchaseService} from './purchase.service';
import {IPurchase} from './purchase';
import {ICreditor} from '../creditor/creditor';
import {IAccount} from '../account/account';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  templateUrl: './purchase.component.html',
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
export class PurchaseComponent implements OnInit {
  constructor(private fb: FormBuilder, private  purchaseService: PurchaseService, public snackBar: MatSnackBar) {
  }
  _isMounted = false;
  isButtonDisabled = false;
  newEventForm: FormGroup;
  creditors: ICreditor[];
  names: string[];
  serials: string[];
  filteredCreditor;
  product: IProduct;
  productts: IProduct[];
  netAmt;
  type: string;
  bill: 0;
  newId = 0;
  accountId = 0;
  purchase: IPurchase[];
  account: IAccount[];

  // newEventForm: FormGroup;this.buildItemDescription()
  ngOnInit(): void {
    this._isMounted = true;
    if (this._isMounted) {
      this.getInitialLoad();

      this.newEventForm.get('productCreditor').valueChanges.pipe(debounceTime(100)).subscribe(
        value => {
          // this.itemDescription.controls[0].get('sendStock').patchValue(false, {emitEvent: false});
          // this.itemDescription.controls[0].get('serialNo').patchValue('');
          if (value) {
            value = value.trim();
            this.purchaseService.getCreditorByName(value).subscribe(
              credit => {
                this.filteredCreditor = credit;
                console.log('the filtered creditor==(from db)===>', this.filteredCreditor);
                this.populateFillterdCreditor(Object.assign({}, this.filteredCreditor));
              }
            );
          }
        });
      // this.itemDescription.controls[0].get('serialNo').valueChanges.subscribe(
      //   value => {
      //     this.itemDescription.controls[0].get('sendStock').patchValue(false, { emitEvent: false });
      //     if (this.newEventForm.get('productCreditor').value === '') {
      //       this.snackBar.open(`Select Creditor Name `, 'ok', {
      //         duration: 3000
      //       });
      //     } else if (this.newEventForm.get('productCreditor').value !== '') {
      //       if (value) {
      //         let total = 0;
      //         const a = this.itemDescription.controls[0];
      //         this.purchaseService.getProduct(value).subscribe(
      //           product => {
      //             this.product = product;
      //             const arr = (Object.assign({}, this.product));
      //             a.get('modelNo').patchValue(arr[0].modelNo);
      //             a.get('HSNCodeNo').patchValue(arr[0].HSNCodeNo);
      //             a.get('companyName').patchValue(arr[0].companyName);
      //             a.get('productType').patchValue(arr[0].productType);
      //             a.get('productRate').patchValue(arr[0].rate);
      //             a.get('gstRate').patchValue(arr[0].gstRate);
      //             a.get('sgstRate').patchValue(arr[0].sgstRate);
      //           });
      //         a.get('qty').valueChanges.pipe(debounceTime(1000)).subscribe(data => {
      //            a.get('sendStock').patchValue(false , { emitEvent: false });
      //           if (this.newEventForm.get('productCreditor').value === null && a.get('serialNo').value === null) {
      //             console.log('why iam not executing?');
      //             this.snackBar.open(`Make Sure  Creditor Name And Serial No Has Selected?`, 'ok', {
      //               duration: 3000
      //             });
      //           } else if (this.newEventForm.get('productCreditor').value !== '' && this.itemDescription.controls[0].get('serialNo').value !== '') {
      //             if (data) {
      //               total = 0;
      //               const arr = (Object.assign({}, this.product));
      //               total = a.get('qty').value * ((arr[0].rate * arr[0].gstRate) / 100 + arr[0].rate + (arr[0].rate * arr[0].sgstRate) / 100);
      //               a.get('totalRate').patchValue(total);
      //             }
      //           }
      //         });
      //       }
      //     }
      //   });

      // this.itemDescription.controls[0].get('sendStock').valueChanges.pipe(debounceTime(1000)).subscribe(
      //   value => {
      //     if (this.newEventForm.get('productCreditor').value === null && this.itemDescription.controls[0].get('serialNo').value === null) {
      //       console.log('why iam not executing?');
      //       this.snackBar.open(`Make Sure  Creditor Name And Serial No Has Selected?`, 'ok', {
      //         duration: 3000
      //       });
      //
      //     } else if (this.newEventForm.get('productCreditor').value !== '' && this.itemDescription.controls[0].get('serialNo').value !== '' &&
      //       this.itemDescription.controls[0].get('qty').value !== null && this.itemDescription.controls[0].get('qty').value > 0 &&
      //       this.itemDescription.controls[0].get('sendStock').value === true) {
      //
      //       if (value) {
      //         // this.itemDescription.controls[0].get('sendStock').disable({onlySelf: true});
      //       }
      //     }
      //   });
    }      //on init ending
  }

  populateFillterdCreditor(cre: ICreditor): void {
    console.log('filter customer =========>', JSON.stringify(cre, null, 5));
    let addr = `${cre[0].address.street} , ${cre[0].address.city},${cre[0].address.state},${cre[0].address.zipCode}`;
    console.log('the address is ===============>', addr);
    this.newEventForm.patchValue({
      creditorAddress: addr,
      creditorEmail: cre[0].email,
      creditorPhoneNo: cre[0].phone1,
      creditorMobileNo: cre[0].mobile1,
      creditorGstIM: cre[0].gstIM,

    });
  }

  getNextAvailableID(purchase: IPurchase[]): number {
    let maxID = 0;
    purchase.forEach(function (element, index, array) {
      if (element.purchaseBillNo) {
        if (element.purchaseBillNo > maxID) {
          maxID = element.purchaseBillNo;
        }
      }
    });
    console.log('the maxid', maxID);
    return ++maxID;
  }

  get itemDescription(): FormArray {
    return <FormArray>this.newEventForm.get('itemDescription');
  }


  getInitialLoad() {
    this.newEventForm = this.fb.group({
      purchaseBillNo: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
      purchaseDate: new FormControl('', Validators.required),
      productCreditor: new FormControl('', Validators.required),
      creditorGstIM: new FormControl('', Validators.required),
      creditorAddress: new FormControl('', Validators.required),
      creditorPhoneNo: new FormControl('', [Validators.required, Validators.pattern(/(\(?[0-9]{3}\)?-?\s?[0-9]{3}-?[0-9]{4})/)]),
      creditorMobileNo: new FormControl('', [Validators.required, Validators.pattern(/(\(?[0-9]{3}\)?-?\s?[0-9]{3}-?[0-9]{4})/)]),
      creditorEmail: new FormControl('', [Validators.required, Validators.email]),
      itemDescription: this.fb.array([]),
    });


    this.purchaseService.getMaxAccountNo().subscribe(
      account => {
        this.account = account;
        if (!!this.account) {
          this.accountId = this.getNextAvailableAccount(this.account);
          console.log('the new account id is:', this.accountId);
        } else {
          this.accountId = 0;
        }
      });

    this.purchaseService.getCreditors().subscribe(
      creditors => {
        this.creditors = creditors;
        this.names = this.creditors.map(cre => cre.name);
      });
    this.purchaseService.getProducts().subscribe(
      products => {
        this.productts = products;
        this.serials = this.productts.map(prod => prod.serialNo);
        // this.serials[0] = 'SELECT';
        console.log('fetched serial number is ===-====>', this.serials);
      });
    this.purchaseService.getMaxBillNo().subscribe(
      purchase => {
        this.purchase = purchase;
        if (!!this.purchase) {
          this.newId = this.getNextAvailableID(this.purchase);
          console.log('the new id is:', this.newId);
        } else {
          this.newId = 0;
        }
        let dp = new DatePipe(navigator.language);
        let f = 'y-MM-dd'; //'y-MM-dd'; // YYYY-MM-DD
        let dtr1 = dp.transform(new Date(), f);
        this.newEventForm.patchValue({
          purchaseBillNo: this.newId,
          purchaseDate: dtr1,

        });
      });
  }


  clear() {
    this._isMounted = false;
    console.log('mounted flag', this._isMounted);
    if (this._isMounted === false) {
      this.newEventForm.reset();
      this.itemDescription.controls.pop();
      // this.newEventForm.reset();
      this.getInitialLoad();
    }
  }
  addItemDescription(i) {
    // this.newEventForm.reset();
    this.itemDescription.push(this.buildItemDescription());
    for (let val of this.itemDescription.controls) {
      let total = 0;
      val.get('serialNo').valueChanges.pipe(debounceTime(1000)).subscribe(data => {
        console.log('the serial no ==========>', val.get('serialNo').value);
         if (val.get('serialNo').value !== null) {

        this.purchaseService.getProduct(val.get('serialNo').value).subscribe(
          product => {
            this.product = product;
            const arr = (Object.assign({}, this.product));
            console.log('new product =======>', arr);
            val.get('modelNo').patchValue(arr[0].modelNo);
            val.get('HSNCodeNo').patchValue(arr[0].HSNCodeNo);

            val.get('companyName').patchValue(arr[0].companyName);
            val.get('productType').patchValue(arr[0].productType);
            val.get('productRate').patchValue(arr[0].rate);
            val.get('gstRate').patchValue(arr[0].gstRate);
            val.get('sgstRate').patchValue(arr[0].sgstRate);
          });
      }
      });
      val.get('qty').valueChanges.pipe(debounceTime(1000)).subscribe(data => {
        val.get('sendStock').patchValue(false , { emitEvent: false });
        if (this.newEventForm.get('productCreditor').value === null && val.get('serialNo').value === null) {
          console.log('why iam not executing?');
          this.snackBar.open(`Make Sure  Creditor Name And Serial No Has Selected?`, 'ok', {
            duration: 3000
          });
        } else if (this.newEventForm.get('productCreditor').value !== '' && this.itemDescription.controls[0].get('serialNo').value !== '') {
          if (data) {
            total = 0;
            const arr = (Object.assign({}, this.product));
            console.log('the nxt rate =======>', arr[0].rate, arr[0].gstRate, arr[0].sgstRate, val.get('qty').value);
            console.log('the tot tax with amt =======>', (arr[0].rate * arr[0].gstRate) / 100);
            total = val.get('qty').value * ((arr[0].rate * arr[0].gstRate) / 100 + arr[0].rate + (arr[0].rate * arr[0].sgstRate) / 100);
            console.log('the total amt(final) =====>', total);

            val.get('totalRate').patchValue(total);
          }
        }
      });
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

  addStock(no: number) {
    this.itemDescription.controls[no].get('sendStock').patchValue(true , { emitEvent: false });

    console.log('IAM IN ADD STOCK', this.newEventForm.get('productCreditor').value, this.itemDescription.controls[no].get('serialNo').value, this.itemDescription.controls[no].get('qty').value, this.itemDescription.controls[no].get('sendStock').value);
    if (this.newEventForm.get('productCreditor').value === '' || this.itemDescription.controls[no].get('serialNo').value === '' ||
      this.itemDescription.controls[no].get('qty').value === null || this.itemDescription.controls[no].get('qty').value <= 0 || this.itemDescription.controls[no].get('sendStock').value === false) {
      this.snackBar.open(`Make Sure  Customer Name ,Qty And Serial No  Has Selected And Valid ?`, 'ok', {
        duration: 3000
      });

    } else if (this.newEventForm.get('productCreditor').value !== '' || this.itemDescription.controls[no].get('serialNo').value !== '' ||
      this.itemDescription.controls[no].get('qty').value !== null || this.itemDescription.controls[no].get('sendStock').value === true) {

      const quantity = this.itemDescription.controls[no].get('qty').value;
      const serial = this.itemDescription.controls[no].get('serialNo').value;
      const obj = {
        purchaseBillNo: this.newEventForm.get('purchaseBillNo').value,
        purchaseDate: new Date().toLocaleDateString(),
        productCreditor: this.newEventForm.get('productCreditor').value,
        creditorGstIM: this.newEventForm.get('creditorGstIM').value,
        creditorAddress: this.newEventForm.get('creditorAddress').value,
        creditorPhoneNo: this.newEventForm.get('creditorPhoneNo').value,
        creditorMobileNo: this.newEventForm.get('creditorMobileNo').value,
        creditorEmail: this.newEventForm.get('creditorEmail').value,
        serialNo: this.itemDescription.controls[no].get('serialNo').value,
        modelNo: this.itemDescription.controls[no].get('modelNo').value,
        HSNCodeNo: this.itemDescription.controls[no].get('HSNCodeNo').value,
        companyName: this.itemDescription.controls[no].get('companyName').value,
        productType: this.itemDescription.controls[no].get('productType').value,
        qty: this.itemDescription.controls[no].get('qty').value,
        productRate: this.itemDescription.controls[no].get('productRate').value,
        gstRate: this.itemDescription.controls[no].get('gstRate').value,
        sgstRate: this.itemDescription.controls[no].get('sgstRate').value,
        totalRate: this.itemDescription.controls[no].get('totalRate').value,
      };
      const acc = {
        accountNo: this.accountId,
        particulars: `${this.newEventForm.get('productCreditor').value} Purchase billNo ${this.newEventForm.get('purchaseBillNo').value}`,
        debit: this.itemDescription.controls[no].get('totalRate').value,
        credit: 0,
        createdOn: new Date().toLocaleDateString(),
      };
      console.log('the object created ========>', obj);
      console.log('the account object created ========>', acc);

      const action = 'add';
      this.purchaseService.totalSalesAmt += parseInt(this.itemDescription.controls[no].get('totalRate').value, 10);
      this.purchaseService.updateQuantity(quantity, serial, action).subscribe(
        data => {
          console.log('the new item deleted is', data);
          this.snackBar.open(` ${quantity} added successfully`, 'ok', {
            duration: 3000
          });
        });
      this.purchaseService.addPurchase(obj).subscribe(
        data => {
          console.log('the new purchased item is', data);
          this.snackBar.open(` ${obj.purchaseBillNo} added successfully`, 'ok', {
            duration: 3000
          });
        },
        (err: HttpErrorResponse) => {
          window.alert(`Server returned code: ${err.status}, error message is: ${err.message}`);
        });

      this.purchaseService.addAccount(acc).subscribe(
        data => {
          console.log('the new purchased item is', data);
          this.snackBar.open(` ${acc.accountNo} added successfully`, 'ok', {
            duration: 3000
          });
        });
      console.log('the quqntity ===== reduce====>', quantity, this.purchaseService.totalSalesAmt);
      this.itemDescription.controls[no].get('sendStock').disable({onlySelf: true});
    }
  }
  deleteItemDescription(no: number) {
    this.itemDescription.removeAt(no);

  }

  buildItemDescription(): FormGroup {
    return this.fb.group({
      serialNo: new FormControl('', Validators.required),
      modelNo: new FormControl('', Validators.required),
      HSNCodeNo: new FormControl('', Validators.required),
      companyName: new FormControl('', Validators.required),
      productType: new FormControl('', Validators.required),
      qty: new FormControl('', [Validators.required, Validators.min(1), Validators.max(50), Validators.pattern('[0-9].*')]),
      productRate: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
      gstRate: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
      sgstRate: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
      totalRate: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
      // sendStock: false,
       sendStock: new FormControl('', Validators.required),
    });
  }


  get purchaseBillNo() {
    return this.newEventForm.get('purchaseBillNo');
  }

  get purchaseDate() {
    return this.newEventForm.get('purchaseDate');
  }

  get productCreditor() {
    return this.newEventForm.get('productCreditor');
  }

  get creditorGstIM() {
    return this.newEventForm.get('creditorGstIM');
  }

  get creditorAddress() {
    return this.newEventForm.get('creditorAddress');
  }

  get creditorPhoneNo() {
    return this.newEventForm.get('creditorPhoneNo');
  }

  get creditorMobileNo() {
    return this.newEventForm.get('creditorMobileNo');
  }

  get creditorEmail() {
    return this.newEventForm.get('creditorEmail');
  }


  save() {
    // console.log('Saved: ' + JSON.stringify(this.newEventForm.value, null, 2));
    // this.purchaseService.addEvent(this.newEventForm.value).subscribe((data: IPurchase) => {
    //   console.log('the added event are', data);
    //   this.snackBar.open(`Bill generated for  ${data.productCreditor}  successfully`, 'ok', {
    //     duration: 3000
    //   });
    // });
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
    finance.updateValueAndValidity();
    const credit = this.newEventForm.get('credit');
    if (note === 'credit') {
      credit.setValidators(Validators.required);
    } else {
      credit.clearValidators();
    }
    credit.updateValueAndValidity();
  }


}
