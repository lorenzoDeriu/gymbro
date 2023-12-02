import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-expand-feedback-dialog',
  templateUrl: './expand-feedback-dialog.component.html',
  styleUrls: ['./expand-feedback-dialog.component.css']
})
export class ExpandFeedbackDialogComponent {
    public message: string = "";

	constructor(
		@Inject(MAT_DIALOG_DATA) private data: any,
		private dialogRef: MatDialogRef<ExpandFeedbackDialogComponent>
	) {}

    ngOnInit() {
        this.message = this.data.message;
    }

	closeDialog() {
		this.dialogRef.close();
	}
}
