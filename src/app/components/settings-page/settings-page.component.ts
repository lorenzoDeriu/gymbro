import { MatSnackBar } from "@angular/material/snack-bar";
import { FirebaseService } from "src/app/services/firebase.service";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { SafetyActionConfirmDialogComponent } from "src/app/components/safety-action-confirm-dialog/safety-action-confirm-dialog.component";
import { CustomExcerciseDialogComponent } from "../custom-excercise-dialog/custom-excercise-dialog.component";
import { ShareDialogComponent } from "../share-dialog/share-dialog.component";

@Component({
	selector: "app-settings-page",
	templateUrl: "./settings-page.component.html",
	styleUrls: ["./settings-page.component.css"],
})
export class SettingsPageComponent implements OnInit {
	public customExercises: any[] = [];
	public visibility: boolean;

	private originalUsername: string;
	public username: string;

	public loading: boolean = false;
	public onModify: boolean = false;

	constructor(
		private firebase: FirebaseService,
		private snackBar: MatSnackBar,
		private authService: AuthService,
		private router: Router,
		private dialog: MatDialog
	) {}

	async ngOnInit() {
		this.loading = true;
		let uid = JSON.parse(localStorage.getItem("user")).uid;

		let user: any = await this.firebase.getUserData(uid);

		//this.customExercises = user.customExercises == undefined ? [] : user.customExercises;
		this.customExercises = ['Hyperextension', 'Panca piana', 'Curl DB', 'Hyperextension', 'Panca piana', 'Curl DB', 'Hyperextension', 'Panca piana', 'Curl DB', 'Hyperextension', 'Panca piana', 'Curl DB', 'Hyperextension', 'Panca piana', 'Curl DB', 'Hyperextension', 'Panca piana', 'Curl DB'];
		this.visibility = user.visibility;
		this.username = user.username || 'Mxo';
		this.originalUsername = user.username;

		this.loading = false;
	}

	openExcerciseDialog() {
		this.dialog.open(CustomExcerciseDialogComponent, {
			data: {
				excercises: this.customExercises,
			},
			disableClose: false,
		});
	}

	shareUsername() {
		this.dialog.open(ShareDialogComponent, {
			data: {
				username: this.username,
			},
			disableClose: false,
		});
	}

	changePassword() {
		this.firebase.changePassword();
		this.snackBar.open(
			"Ti abbiamo inviato una mail per cambiare la password",
			"OK",
			{ duration: 3000 }
		);
	}

	deleteAccount() {
		this.dialog.open(SafetyActionConfirmDialogComponent, {
			data: {
				title: "Elimina account",
				message:
					"Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile",
				args: [this.authService],
				confirm: async (authService: any) => {
					await authService.deleteAccount();
				},
			},
		});
	}

	saveSettings() {
		this.onModify = false;

		let uid = JSON.parse(localStorage.getItem("user")).uid;
		if (this.username != "" && this.username != this.originalUsername) {
			this.firebase.updateUsername(uid, this.username);
		}

		this.firebase.updateVisibility(uid, this.visibility);
		this.firebase.updateCustomExercises(uid, this.customExercises);

		this.snackBar.open("Impostazioni salvate", "OK", { duration: 3000 });
		this.router.navigate(["/home"]);
	}

	backToHome() {
		this.router.navigate(["/home"]);
	}
}
