import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
	selector: 'app-password-recover-dialog',
	templateUrl: './password-recover-dialog.component.html',
	styleUrls: ['./password-recover-dialog.component.css']
})
export class PasswordRecoverDialogComponent {
	public email: string;

	constructor(private firebase: FirebaseService, private snackBar: MatSnackBar, public dialogRef: MatDialogRef<PasswordRecoverDialogComponent>) {}

	public sendRecoverPasswordEmail() {
		this.firebase.recoverPassword(this.email);

		this.snackBar.open("Ti abbiamo inviato un'email per recuperare la password", "Ok", {duration: 3000});
		this.closeDialog();
	}

	private closeDialog() {
		this.dialogRef.close();
	}

	public allowSend(): boolean {
		return this.email && this.email != "" && this.email.includes("@");
	}
}
