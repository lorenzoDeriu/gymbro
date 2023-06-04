import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
	selector: 'app-password-recover-dialog',
	templateUrl: './password-recover-dialog.component.html',
	styleUrls: ['./password-recover-dialog.component.css']
})
export class PasswordRecoverDialogComponent {
	constructor(private firebase: FirebaseService, private router: Router) {}

	public sendRecoverPasswordEmail(form: NgForm) {
		let email = form.value.email;

		this.firebase.recoverPassword(email);

		alert("Ti abbiamo inviato un'email con le istruzioni per recuperare la password");
	}
}
