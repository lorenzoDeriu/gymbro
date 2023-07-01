import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-settings-page',
	templateUrl: './settings-page.component.html',
	styleUrls: ['./settings-page.component.css'],
})
export class SettingsPageComponent implements OnInit {
	public customExercises: any[] = [];
	public visibility: boolean;
	public username: string;

	constructor(
		private firebase: FirebaseService,
		private snackBar: MatSnackBar,
		private authService: AuthService,
		private router: Router
	) {}

	async ngOnInit() {
		let uid = JSON.parse(localStorage.getItem('user')).uid;

		let user = await this.firebase.getUserData(uid);

		this.customExercises =
			user['customExercises'] == undefined ? [] : user['customExercises'];
		this.visibility = user['visibility'];
		this.username = user['username'];
	}

	changePassword() {
		this.firebase.changePassword();
		this.snackBar.open(
			'Ti abbiamo inviato una mail per cambiare la password',
			'OK',
			{ duration: 3000 }
		);
	}

	deleteAccount() {
		this.authService.deleteAccount();
	}

	saveSettings(form: NgForm) {
		let uid = JSON.parse(localStorage.getItem('user')).uid;
		if (form.value.username != '') {
			this.firebase.updateUsername(uid, form.value.username);
		}

		this.firebase.updateVisibility(uid, this.visibility);

		this.snackBar.open('Impostazioni salvate', 'OK', { duration: 3000 });
		this.router.navigate(['/home']);
	}

	deleteItem(index: number) {
		let uid = JSON.parse(localStorage.getItem('user')).uid;

		this.firebase.deleteCustomExercise(uid, this.customExercises[index].id);
		this.customExercises.splice(index, 1);
	}

	backToHome() {
		this.router.navigate(['/home']);
	}
}
