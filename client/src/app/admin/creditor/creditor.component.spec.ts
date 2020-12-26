import {CreditorComponent} from './creditor.component';
 import {of} from 'rxjs/internal/observable/of';
import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogBoxxComponent} from './dialog-boxx/dialog-boxx.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import {MaterialModule} from '../../shared/material.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DataService} from './data.service';
import { Observable} from 'rxjs';
import { DebugElement } from '@angular/core';
import {NO_ERRORS_SCHEMA} from '@angular/core';

const CREDITORS = [
  {
    name: " Mart",
    street: "1st cross",
    city: "namakkal",
    state: "tamil nadu",
    zipCode: 123456,
    email: "test1@test.com",
    phone1: "720-303-1234",
    phone2: "723-303-1234",
    mobile1: "720-302-1234",
    mobile2: "720-303-1224",
    createdOn : "Wed Mar 13 2020 00:00:00 GMT+0000 (UTC)"
  },
  {
    name: " baby",
    street: "1st cross",
    city: "namakkal",
    state: "tamil nadu",
    zipCode: 123456,
    email: "test1@test.com",
    phone1: "720-303-1234",
    phone2: "723-303-1234",
    mobile1: "720-302-1234",
    mobile2: "720-303-1224",
    createdOn : "Wed Mar 13 2020 00:00:00 GMT+0000 (UTC)"
  },
  {
    name: " vishnu@co",
    street: "1st cross",
    city: "namakkal",
    state: "tamil nadu",
    zipCode: 123456,
    email: "test1@test.com",
    phone1: "720-303-1234",
    phone2: "723-303-1234",
    mobile1: "720-302-1234",
    mobile2: "720-303-1224",
    createdOn : "Wed Mar 13 2020 00:00:00 GMT+0000 (UTC)"
  },

];

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of([CREDITORS[0]])
    };
  }
}
// describe('creditor component', () => {
//   let component: CreditorComponent;
//   let CREDITOR;
//   let mockDataService;
//   let dialog: MatDialogMock;
//   const mockSnackbar = jasmine.createSpyObj(['open']);
//   const mockDialog = jasmine.createSpyObj(['open', 'afterClosed']);
//   const formBuilder: FormBuilder = new FormBuilder();
//   beforeEach(() => {
//     CREDITOR = [
//       {
//         name: " Mart",
//         street: "1st cross",
//         city: "namakkal",
//         state: "tamil nadu",
//         zipCode: 123456,
//         email: "test1@test.com",
//         phone1: "720-303-1234",
//         phone2: "723-303-1234",
//         mobile1: "720-302-1234",
//         mobile2: "720-303-1224",
//         createdOn : "Wed Mar 13 2020 00:00:00 GMT+0000 (UTC)"
//       },
//       {
//         name: " baby",
//         street: "1st cross",
//         city: "namakkal",
//         state: "tamil nadu",
//         zipCode: 123456,
//         email: "test1@test.com",
//         phone1: "720-303-1234",
//         phone2: "723-303-1234",
//         mobile1: "720-302-1234",
//         mobile2: "720-303-1224",
//         createdOn : "Wed Mar 13 2020 00:00:00 GMT+0000 (UTC)"
//       },
//       {
//         name: " vishnu@co",
//         street: "1st cross",
//         city: "namakkal",
//         state: "tamil nadu",
//         zipCode: 123456,
//         email: "test1@test.com",
//         phone1: "720-303-1234",
//         phone2: "723-303-1234",
//         mobile1: "720-302-1234",
//         mobile2: "720-303-1224",
//         createdOn : "Wed Mar 13 2020 00:00:00 GMT+0000 (UTC)"
//       },
//
//     ];
//     mockDataService = jasmine.createSpyObj(['getUsers', 'addUser', 'deleteUser']);
//     component = new CreditorComponent(mockDataService, mockDialog, formBuilder, mockSnackbar);
//   });
//   describe('remove creditor', () => {
//     it('should remove creditor from creditorlist', () => {
//       mockDataService.deleteUser.and.returnValue(of(true));
//       component.users = CREDITOR;
//       component.openDialog('delete', CREDITOR[2]);
//       expect(component.users.length).toBe(2);
//     });
//     it('should call delete', () => {
//       mockDataService.deleteUser.and.returnValue(of(true));
//       component.users = CREDITOR;
//       component.openDialog('delete', CREDITOR[2]);
//       expect(mockDataService.deleteUser).toHaveBeenCalledWith(CREDITOR[2]);
//     });
//   });
// });
//

describe('creditorcomponent', () => {
  let component: CreditorComponent;
  let fixture: ComponentFixture<CreditorComponent>;
  let mockDataService;
  let itemToDelete = 'thing two';
  let dataService: DataService;
  let CREDITOR;
  let debugElement: DebugElement;
  let element: HTMLElement;
  let dialog: MatDialogMock;
  beforeEach(async(() => {
    mockDataService = jasmine.createSpyObj(['getUsers', 'addUser', 'deleteUser']);

    TestBed.configureTestingModule({
      declarations: [CreditorComponent, DialogBoxxComponent , MatDialogMock],
      // schemas: [NO_ERRORS_SCHEMA],

      providers: [
        {
          provide: DataService, useClass: mockDataService
        },
        {
          provide: MatDialog, useClass: MatDialogMock,
        }
      ],
      schemas: [NO_ERRORS_SCHEMA],

      imports: [MaterialModule, MatDialogModule, BrowserAnimationsModule , ReactiveFormsModule,
        FormsModule,
        NgbModule]
    });
      // . compileComponents();
    // overrideModule(BrowserDynamicTestingModule, {
    //   set: {
    //     entryComponents: [DialogBoxxComponent]
    //   }
    // });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditorComponent);
    component = fixture.componentInstance;
    dataService = TestBed.get(DataService);
    dialog = TestBed.get(MatDialog);
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should launch an  dialog with a click of the delete button for a table item', () => {
  //   const ourDomListUnderTest = document.querySelector('mat-table#testList');
  //
  //   const listItemToDelete = Array.from(
  //     ourDomListUnderTest.getElementsByTagName('mat-cell')
  //   ).filter(
  //     element =>
  //       element.getElementsByTagName('td')[0].innerText === itemToDelete
  //   );
  //
  //   const deleteButton = listItemToDelete[0].getElementsByTagName('button')[0];
  //
  //   deleteButton.click();
  //   fixture.detectChanges();
  //
  //   fixture.whenStable().then(() => {
  //     const dialogDiv = document.querySelector('mat-dialog-container');
  //     expect(dialogDiv).toBeTruthy();
  //   });
  // });
  //
  // it('should make call to delete a  item with the table of item when the dialog is confirmed', () => {
  //   spyOn(component, 'openDialog');
  //
  //   const ourDomListUnderTest = document.querySelector('mat-table#testList');
  //
  //   const listItemToDelete = Array.from(
  //     ourDomListUnderTest.getElementsByTagName('mat-cell')
  //   ).filter(
  //     element =>
  //       element.getElementsByTagName('td')[0].innerText === itemToDelete
  //   );
  //
  //   const deleteButton = listItemToDelete[0].getElementsByTagName('button')[0];
  //
  //   deleteButton.click();
  //   fixture.detectChanges();
  //
  //   fixture.whenStable().then(() => {
  //     const dialogDiv = document.querySelector('mat-dialog-container');
  //
  //     const okButton = dialogDiv.querySelector('button#doIt');
  //     const mouseEvent = new MouseEvent('click');
  //
  //     okButton.dispatchEvent(mouseEvent);
  //     fixture.detectChanges();
  //   });
  //
  //   expect(component.openDialog).toHaveBeenCalledWith(itemToDelete);
  // });
  //
  // it('should have a dialog that contains the item name that will be deleted', () => {
  //   const ourDomListUnderTest = document.querySelector('mat-table#testList');
  //   const listItemToDelete = Array.from(
  //     ourDomListUnderTest.getElementsByTagName('mat-cell')
  //   ).filter(
  //     element =>
  //       element.getElementsByTagName('td')[0].innerText === itemToDelete
  //   );
  //
  //   const deleteButton = listItemToDelete[0].getElementsByTagName('button')[0];
  //   deleteButton.click();
  //   fixture.detectChanges();
  //
  //   fixture.whenStable().then(() => {
  //     const dialogDiv = document.querySelector('mat-dialog-container');
  //     const dataMessageDiv = dialogDiv.querySelector('#dataMessage');
  //
  //     expect(dataMessageDiv.textContent).toContain(itemToDelete);
  //   });
  // });
});
