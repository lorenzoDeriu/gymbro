import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/services/firebase.service";
import { MatDialogRef } from "@angular/material/dialog";
import { ThemeService } from "src/app/services/theme.service";
import { NotificationService } from "src/app/services/notification.service";

@Component({
	selector: "app-password-recover-dialog",
	templateUrl: "./password-recover-dialog.component.html",
	styleUrls: ["./password-recover-dialog.component.css"],
})
export class PasswordRecoverDialogComponent implements OnInit {
	public theme: "light" | "dark";
	public email: string;

	constructor(
		private firebase: FirebaseService,
		private themeService: ThemeService,
		private notificationService: NotificationService,
		public dialogRef: MatDialogRef<PasswordRecoverDialogComponent>
	) {}

	public ngOnInit(): void {
		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});
	}

	public sendRecoverPasswordEmail() {
		this.firebase.recoverPassword(this.email);

		this.notificationService.showSnackBarNotification(
			"Ti abbiamo inviato un'email per recuperare la password",
			"Ok!",
			{
				duration: 3000,
				panelClass: [
					this.theme == "dark" ? "dark-snackbar" : "light-snackbar",
				],
			}
		);

		this.closeDialog();
	}

	public closeDialog() {
		this.dialogRef.close();
	}

	public allowSend(): boolean {
		return (
			this.email &&
			!!this.email.match(
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
			)
		);
	}
}
