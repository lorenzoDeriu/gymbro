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
	public originalPlaylistUrl: string;
	public username: string;
	public originalUsername: string;
	public loading: boolean = false;

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
		this.originalUsername = this.username;
		this.playlistUrl = user.playlistUrl;
		this.originalPlaylistUrl = this.playlistUrl;

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

	public resetUsernameInput() {
		this.username = this.originalUsername;
	}

	public resetPlaylistUrlInput() {
		this.playlistUrl = this.originalPlaylistUrl;
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

	public async saveSettings(e: Event) {
		if (this.isUsernameValid()) {
			await this.firebase.updateUsername(this.username);
		}

		if (this.isPlaylistUrlValid()) {
			await this.firebase.updatePlaylistUrl(this.playlistUrl);
		}

		await this.firebase.updateVisibility(this.visibility);
		await this.firebase.updateCustomExercises(this.customExercises);

		let user: User = await this.firebase.getUserData();
		this.visibility = user.visibility;
		this.username = user.username;
		this.originalUsername = this.username;
		this.playlistUrl = user.playlistUrl;
		this.originalPlaylistUrl = this.playlistUrl;

		const target = e.target as HTMLElement;
		this.collapseSettings(target);

		this.snackBar.open("Impostazioni salvate", "OK", { duration: 3000 });
	}

	collapseSettings(target: HTMLElement) {
		if (target.classList.contains("saveUsernameBtn")) {
			(
				document.getElementById("usernameBtn") as HTMLButtonElement
			).click();
		}

		if (target.classList.contains("saveUsernameBtnMobile")) {
			(
				document.getElementById(
					"usernameBtnMobile"
				) as HTMLButtonElement
			).click();
		}

		if (target.classList.contains("savePlaylistBtn")) {
			(
				document.getElementById("playlistBtn") as HTMLButtonElement
			).click();
		}

		if (target.classList.contains("savePlaylistBtnMobile")) {
			(
				document.getElementById(
					"playlistBtnMobile"
				) as HTMLButtonElement
			).click();
		}

		if (target.classList.contains("updateVisibilityBtn")) {
			(
				document.getElementById("visibilityBtn") as HTMLButtonElement
			).click();
		}

		if (target.classList.contains("updateVisibilityBtnMobile")) {
			(
				document.getElementById(
					"visibilityBtnMobile"
				) as HTMLButtonElement
			).click();
		}
	}

	public backToHome() {
		this.router.navigate(["/home"]);
	}
}
