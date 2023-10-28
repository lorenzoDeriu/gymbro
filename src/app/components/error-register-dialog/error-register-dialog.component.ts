import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-register-dialog',
  templateUrl: './error-register-dialog.component.html',
  styleUrls: ['./error-register-dialog.component.css']
})
export class ErrorRegisterDialogComponent {
	constructor(
		public dialogRef: MatDialogRef<ErrorRegisterDialogComponent>
	) {}

	closeDialog() {
		this.dialogRef.close();
	}
}
