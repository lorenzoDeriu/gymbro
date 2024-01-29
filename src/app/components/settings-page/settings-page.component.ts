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
import { EditProfilePicDialogComponent } from "../edit-profile-pic-dialog/edit-profile-pic-dialog.component";
import { ThemeService } from "src/app/services/theme.service";
import { Notification } from "src/app/Models/Notification.model";
import { NotificationService } from "src/app/services/notification.service";
import { UserService } from "src/app/services/user.service";

@Component({
	selector: "app-settings-page",
	templateUrl: "./settings-page.component.html",
	styleUrls: ["./settings-page.component.css"],
})
export class SettingsPageComponent implements OnInit {
	public customExercises: string[] = [];
	public theme: "light" | "dark";
	public visibility: boolean;
	public playlistUrl: string;
	public originalPlaylistUrl: string;
	public username: string;
	private uid: string;
	public loading: boolean = false;
	public onModify: boolean = false;
	public screenWidth: number = window.innerWidth;
	public isThinMobile: boolean = this.screenWidth <= 280;
	public profilePic: string;
	public originalUsername: string;
	public section: "settings" | "notifications" = "settings";

	constructor(
		private firebase: FirebaseService,
		private snackBar: MatSnackBar,
		private authService: AuthService,
		private router: Router,
		private dialog: MatDialog,
		private themeService: ThemeService,
		private notification: NotificationService,
		private userService: UserService
	) {}

	async ngOnInit() {
		this.loading = true;

		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});

		this.screenWidth = window.innerWidth;

		window.onresize = () => {
			this.screenWidth = window.innerWidth;
			this.isThinMobile = this.screenWidth <= 280;
		};

		this.isThinMobile = this.screenWidth <= 280;
		let user: User = await this.firebase.getUserData();

		this.uid = await this.firebase.getUid();

		this.profilePic = user.profilePicUrl;
		this.customExercises =
			user.customExercises == undefined ? [] : user.customExercises;
		this.visibility = user.visibility;
		this.username = user.username;
		this.originalUsername = this.username;
		this.playlistUrl = user.playlistUrl;
		this.originalPlaylistUrl = this.playlistUrl;

		this.loading = false;
	}

	public openProfilePicDialog() {
		this.dialog.open(EditProfilePicDialogComponent, {
			data: {
				uid: this.uid,
				profilePic: this.profilePic,
				updateProfilePic: (profilePic: string) => {
					this.profilePic = profilePic;
				},
			},
			disableClose: false,
		});
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
				confirm: async (authService: AuthService) => {
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

	public getNotifications() {
		return this.notification.getNotifications();
	}

	public deleteNotification(id: string) {
		this.notification.deleteNotification(id);
	}

	public async deleteAllNotifications() {
		this.notification.deleteAllNotifications();
	}

	public backToHome() {
		this.router.navigate(["/home"]);
	}

	public viewProfile(uid: string, username: string) {
		this.userService.setUidProfile(uid);

		this.router.navigate(["/home/profile", { searchUsername: username }]);
	}
}
