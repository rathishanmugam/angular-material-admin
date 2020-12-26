import {Component, EventEmitter, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DataService} from '../data.service';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {IAccount} from '../account';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

export class State {
  constructor(public name: string, public population: string) {  }
}
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog-boxx.component.html',
  styleUrls: ['./dialog-boxx.component.scss']
})
export class DialogBoxComponent implements OnInit {
  public newUserForm: FormGroup;
  filteredStates: Observable<any[]>;
  action: string;
  localData: IAccount;
  updateData = {};
  states: State[] = [
    {
      name: 'Arkansas',
      population: '2.978M',
    },
    {
      name: 'California',
      population: '39.14M',
    },
    {
      name: 'Florida',
      population: '20.27M',
    },
    {
      name: 'Texas',
      population: '27.47M',
    }
  ];
  ngOnInit(): void {
    this.newUserForm = this.fb.group({
      accountNo: new FormControl('', Validators.required),

      particulars: new FormControl('', Validators.required),
      credit: new FormControl('0', Validators.required),
      debit: new FormControl('0', Validators.required),
      state: new FormControl('', Validators.required),
      copy: new FormControl('', Validators.required),
    });
    this.filteredStates = this.newUserForm.get('state').valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this.filterStates(state) : this.states.slice())
      );
    // this.newEventForm.patchValue({
    //   accountNo: this.newId,
    //
    // });
  }
  onEnter(evt: any) {
    if (evt.source.selected) {
     console.log('the changed value is====>', evt.source.valueOf().value);
     this.newUserForm.get('copy').patchValue(evt.source.valueOf().value);
    }
  }
  filterStates(name: string) {
    return this.states.filter(state =>
      state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.newUserForm.controls[controlName].hasError(errorName);
  };

  constructor(private dataService: DataService,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<DialogBoxComponent>,
              // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data: IAccount) {
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
      data: this.localData,
      createdOn: createdOn,
    }, null, 2));
    this.updateData = {
      event: this.action,
      data: this.localData,
      createdOn: createdOn,
    };
    console.log('updated item', this.updateData);
    this.dialogRef.close(this.updateData);
  }

  closeDialog() {
    this.dialogRef.close({event: 'Cancel'});
  }
}
