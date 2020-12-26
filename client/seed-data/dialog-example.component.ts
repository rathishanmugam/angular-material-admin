import {Component} from '@angular/core';

@Component({
  selector: 'app-dialog-example',
  template: `
    <mat-card fxFlex.gt-xs="33" class="ml20 mb15">
      <mat-card-content>

        <h1 md-dialog-title class="primary-color">hey title</h1>
        <mat-dialog-content class="accent-color">
          hey this is the content of the dialog
        </mat-dialog-content>
        <mat-dialog-actions>
          <button md-raised-button color="primary" mat-dialog-close>
            close button
          </button>
        </mat-dialog-actions>
      </mat-card-content>
    </mat-card>
  `,
  styles: []
})
export class DialogExampleComponent {
  constructor() {
  }
}
