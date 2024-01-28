import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FirebaseService } from "src/app/services/firebase.service";
import { NotificationService } from "src/app/services/notification.service";

@Component({
	selector: "app-feedback-dialog",
	templateUrl: "./feedback-dialog.component.html",
	styleUrls: ["./feedback-dialog.component.css"],
})
export class FeedbackDialogComponent {
	feedback: string = "";

	constructor(
		private firebase: FirebaseService,
		private snackBar: MatSnackBar,
		public dialogRef: MatDialogRef<FeedbackDialogComponent>,
		private notification: NotificationService
	) {}

	public sendFeedback() {
		this.feedback = (
			document.getElementById("feedback") as HTMLTextAreaElement
		).value;

		this.firebase.addFeedback(this.feedback);

		this.snackBar.open("Grazie per il tuo Feedback", "Ok!", {
			duration: 3000,
		});

		this.notification.sendFeedbackNotification();
		this.closeDialog();
	}

	public closeDialog() {
		this.dialogRef.close();
	}

	public allowSendFeedback() {
		this.feedback = (
			document.getElementById("feedback") as HTMLTextAreaElement
		).value;

		return this.feedback && this.feedback !== "";
	}
}
