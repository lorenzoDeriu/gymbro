import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
	selector: "app-error-login-dialog",
	templateUrl: "./error-login-dialog.component.html",
	styleUrls: ["./error-login-dialog.component.css"],
})
export class ErrorLoginDialogComponent {
	constructor(public dialogRef: MatDialogRef<ErrorLoginDialogComponent>) {}

	closeDialog() {
		this.dialogRef.close();
	}
}
