import {Component, EventEmitter, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DataService} from '../data.service';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';

export interface ICustomer {
  _id: string;
  name: string;
  address: {
    _id: string;
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
  selector: 'app-dialog',
  templateUrl: './dialog-boxx.component.html',
  styleUrls: ['./dialog-boxx.component.scss']
})
export class DialogBoxComponent implements OnInit {
  public newUserForm: FormGroup;
  action: string;
  localData: ICustomer;
  updateData = {};

  ngOnInit(): void {
    this.newUserForm = this.fb.group({
      name: new FormControl('', Validators.required),
      address: this.fb.group({

        street: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
        zipCode: new FormControl('', Validators.required),
      }),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone1: new FormControl('', [Validators.required, Validators.pattern(/(\(?[0-9]{3}\)?-?\s?[0-9]{3}-?[0-9]{4})/)]),
      phone2: new FormControl('', [Validators.required, Validators.pattern(/(\(?[0-9]{3}\)?-?\s?[0-9]{3}-?[0-9]{4})/)]),
      mobile1: new FormControl('', [Validators.required, Validators.pattern(/(\(?[0-9]{3}\)?-?\s?[0-9]{3}-?[0-9]{4})/)]),
      mobile2: new FormControl('', [Validators.required, Validators.pattern(/(\(?[0-9]{3}\)?-?\s?[0-9]{3}-?[0-9]{4})/)]),

    });
  }


  public hasError = (controlName: string, errorName: string) => {
    return this.newUserForm.controls[controlName].hasError(errorName);
  };

  constructor(private dataService: DataService,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<DialogBoxComponent>,
              // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data: ICustomer) {
    console.log(data);

    const createdOn = new Date();
    this.localData = {...data, createdOn};
    console.log('the form data', this.localData);
    this.action = this.localData.action;
  }

  doAction() {
    const createdOn = new Date();
    console.log('Saved: ' + JSON.stringify({
      event: this.action,
      data: {...this.newUserForm.value},
      createdOn: createdOn,
      id: this.localData._id,
      addr: this.localData.address._id
    }, null, 2));
    this.updateData = {
      event: this.action,
      data: {...this.newUserForm.value},
      createdOn: createdOn,
      id: this.localData._id,
      addr: this.localData.address._id
    };
    console.log('updated item', this.updateData);
    this.dialogRef.close(this.updateData);
  }

  closeDialog() {
    this.dialogRef.close({event: 'Cancel'});
  }
}
