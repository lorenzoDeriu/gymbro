import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { AddExerciseDialogComponent } from '../add-exercise-dialog/add-exercise-dialog.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NgForm } from '@angular/forms';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
	public loading: boolean = true;

	constructor(
		private authService: AuthService,
		private dialog: MatDialog,
		private firebase: FirebaseService
	) {}

	private _isAdmin: boolean = false;

	async ngOnInit() {
		this.loading = true;
		if (this.authService.isAuthenticated()) {
			this._isAdmin = await this.firebase.userIsAdmin();
			this.loading = false;
			return;
		}

		this.loading = false;
		this._isAdmin = false;
	}

	isAdmin() {
		return this._isAdmin;
	}

	addExercise() {
		this.dialog.open(AddExerciseDialogComponent, {
			width: '300px',
			height: '200px',
		});
	}

	changeAccount(form: NgForm) {
		this.authService.logout();
		this.authService.signin(form.value.email, form.value.password);
	}
}
