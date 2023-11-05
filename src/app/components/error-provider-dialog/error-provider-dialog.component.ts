import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
	selector: "app-error-provider-dialog",
	templateUrl: "./error-provider-dialog.component.html",
	styleUrls: ["./error-provider-dialog.component.css"],
})
export class ErrorProviderDialogComponent {
	constructor(public dialogRef: MatDialogRef<ErrorProviderDialogComponent>) {}

	closeDialog() {
		this.dialogRef.close();
	}
}
