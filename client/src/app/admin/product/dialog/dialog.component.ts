import {Component, EventEmitter, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DataService} from '../data.service';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {IProduct} from '../product';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  public newUserForm: FormGroup;
  action: string;
  localData: IProduct;

  ngOnInit(): void {
    this.newUserForm = this.fb.group({
      serialNo: new FormControl('', Validators.required),
      modelNo: new FormControl('', Validators.required),
      HSNCodeNo: new FormControl('', Validators.required),
      companyName: new FormControl('', [Validators.required]),
      productType: new FormControl('', Validators.required),
      qty: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
      rate: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
      gstRate: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
      sgstRate: new FormControl('', [Validators.required, Validators.pattern('[0-9].*')]),
    });
  }


  public hasError = (controlName: string, errorName: string) => {
    return this.newUserForm.controls[controlName].hasError(errorName);
  };

  constructor(private dataService: DataService,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<DialogComponent>,
              // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data: IProduct) {
    console.log(data);

    const added = new Date();
    this.localData = {...data, added};
    console.log('the form data', this.localData);
    this.action = this.localData.action;
  }

  doAction() {
    this.dialogRef.close({event: this.action, data: this.localData});
  }

  closeDialog() {
    this.dialogRef.close({event: 'Cancel'});
  }
}
