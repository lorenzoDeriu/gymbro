import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-dialog',
  templateUrl: './admin-dialog.component.html',
  styleUrls: ['./admin-dialog.component.css']
})
export class AdminDialogComponent {
	constructor(public dialogRef: MatDialogRef<AdminDialogComponent>) {}

	closeDialog() {
		this.dialogRef.close();
	}
}
