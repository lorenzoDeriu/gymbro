import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-deload-dialog',
  templateUrl: './deload-dialog.component.html',
  styleUrls: ['./deload-dialog.component.css']
})
export class DeloadDialogComponent {
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: { confirm: Function },
		public dialogRef: MatDialogRef<DeloadDialogComponent>
	) {}

	public activateDeload() {
		this.data.confirm();
		this.dialogRef.close();
	}

	public closeDialog() {
		this.dialogRef.close();
	}
}
