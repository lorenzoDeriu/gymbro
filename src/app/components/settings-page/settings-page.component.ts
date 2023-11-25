import { MatSnackBar } from "@angular/material/snack-bar";
import { FirebaseService } from "src/app/services/firebase.service";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { SafetyActionConfirmDialogComponent } from "src/app/components/safety-action-confirm-dialog/safety-action-confirm-dialog.component";
import { CustomExcerciseDialogComponent } from "../custom-excercise-dialog/custom-excercise-dialog.component";
import { ShareDialogComponent } from "../share-dialog/share-dialog.component";
import { User } from "src/app/Models/User.model";

@Component({
	selector: "app-settings-page",
	templateUrl: "./settings-page.component.html",
	styleUrls: ["./settings-page.component.css"],
})
export class SettingsPageComponent implements OnInit {
	public customExercises: string[] = [];
	public visibility: boolean;
	public playlistUrl: string;
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

		let user: User = await this.firebase.getUserData();

		this.customExercises =
			user.customExercises == undefined ? [] : user.customExercises;
		this.visibility = user.visibility;
		this.username = user.username;
		this.playlistUrl = user.playlistUrl;
		this.originalUsername = user.username;

		this.loading = false;
	}

	public isPlaylistUrlValid() {
		return (
			this.playlistUrl === "" ||
			(this.playlistUrl &&
				this.playlistUrl.includes("https://open.spotify.com/"))
		);
	}

	public isUsernameValid() {
		return (
			this.username &&
			this.username !== "" &&
			this.username !== this.originalUsername
		);
	}

	public openExcerciseDialog() {
		this.dialog.open(CustomExcerciseDialogComponent, {
			data: {
				exercises: this.customExercises,
			},
			disableClose: false,
		});
	}

	public shareUsername() {
		this.dialog.open(ShareDialogComponent, {
			data: {
				username: this.username,
			},
			disableClose: false,
		});
	}

	public changePassword() {
		this.firebase.changePassword();
		this.snackBar.open(
			"Ti abbiamo inviato una mail per cambiare la password",
			"OK",
			{ duration: 3000 }
		);
	}

	public deleteAccount() {
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

	public cancel() {
		this.username = this.originalUsername;
		this.onModify = false;
	}

	public async saveSettings() {
		if (this.isUsernameValid()) {
			await this.firebase.updateUsername(this.username);
		}

		if (this.isPlaylistUrlValid()) {
			await this.firebase.updatePlaylistUrl(this.playlistUrl);
		}

		await this.firebase.updateVisibility(this.visibility);
		await this.firebase.updateCustomExercises(this.customExercises);

		this.onModify = false;
		this.snackBar.open("Impostazioni salvate", "OK", { duration: 3000 });
		window.location.reload();
	}

	public backToHome() {
		this.router.navigate(["/home"]);
	}
}
