import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FirebaseService } from "src/app/services/firebase.service";

@Component({
	selector: "app-feedback-dialog",
	templateUrl: "./feedback-dialog.component.html",
	styleUrls: ["./feedback-dialog.component.css"],
})
export class FeedbackDialogComponent {
	feedback: string = '';

	constructor(
		private firebase: FirebaseService,
		private snackBar: MatSnackBar,
		public dialogRef: MatDialogRef<FeedbackDialogComponent>
	) {}

	sendFeedback() {
		this.feedback = (document.getElementById("feedback") as HTMLTextAreaElement).value;

		this.firebase.addFeedback(this.feedback);

		this.snackBar.open("Grazie per il tuo Feedback", "Ok!", {
			duration: 3000,
		});

		this.closeDialog();
	}

	closeDialog() {
		this.dialogRef.close();
	}

	allowSendFeedback() {
		this.feedback = (document.getElementById("feedback") as HTMLTextAreaElement).value;

		return this.feedback && this.feedback !== '';
	}
}
