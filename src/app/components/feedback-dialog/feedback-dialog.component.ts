import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FirebaseService } from "src/app/services/firebase.service";
import { ThemeService } from "src/app/services/theme.service";
import { NotificationService } from "src/app/services/notification.service";

@Component({
	selector: "app-feedback-dialog",
	templateUrl: "./feedback-dialog.component.html",
	styleUrls: ["./feedback-dialog.component.css"],
})
export class FeedbackDialogComponent implements OnInit {
	public theme: "light" | "dark";
	public feedback: string = "";

	constructor(
		private firebase: FirebaseService,
		public dialogRef: MatDialogRef<FeedbackDialogComponent>,
		private themeService: ThemeService,
		private notification: NotificationService
	) {}

	public ngOnInit() {
		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});
	}

	public sendFeedback() {
		this.feedback = (
			document.getElementById("feedback") as HTMLTextAreaElement
		).value;

		this.firebase.addFeedback(this.feedback);

		this.notification.showSnackBarNotification(
			"Grazie per il tuo Feedback",
			"Ok!",
			{
				duration: 3000,
				panelClass: [
					this.theme == "dark" ? "dark-snackbar" : "light-snackbar",
				],
			}
		);

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
