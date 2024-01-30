import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { FeedbackDialogComponent } from "../feedback-dialog/feedback-dialog.component";
import { FirebaseService } from "src/app/services/firebase.service";
import { UserService } from "src/app/services/user.service";
import { convertTimediffToTime } from "src/app/utils/utils";
import { ThemeService } from "src/app/services/theme.service";
import { NotificationService } from "src/app/services/notification.service";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
	public theme: "light" | "dark";
	public restMode: boolean = false;
	public isAdmin: boolean = false;
	public editMode: boolean = false;
	public playlistUrl: string;

	constructor(
		private authservice: AuthService,
		private router: Router,
		private dialog: MatDialog,
		private firebase: FirebaseService,
		private userService: UserService,
		private themeService: ThemeService,
		private notification: NotificationService
	) {}

	async ngOnInit() {
		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});

		this.userService.editModeObs.subscribe(editMode => {
			this.editMode = editMode;
		});

		this.userService.restModeObs.subscribe(restMode => {
			this.restMode = restMode;
		});

		this.isAdmin = await this.firebase.userIsAdmin();
		this.playlistUrl = this.userService.getPlaylistURL();
	}

	getWorkoutTime() {
		return convertTimediffToTime(this.userService.getChronometerTime());
	}

	public toggleTheme() {
		this.theme = this.theme === "light" ? "dark" : "light";
		this.themeService.setTheme(this.theme);
	}

	workoutExists() {
		return localStorage.getItem("workout") !== null;
	}

	fixDB() {
		this.firebase.fixDB();
	}

	hasNotifications() {
		return this.notification.getNotifications().length > 0;
	}

	onLogout() {
		this.authservice.logout();
	}

	onSocial() {
		this.router.navigate(["/home/friends"]);
	}

	onFeedback() {
		this.dialog.open(FeedbackDialogComponent, {
			disableClose: false,
			panelClass: [this.theme === "dark" ? "dark-dialog" : "light-dialog"]
		});
	}

	toContinueWorkout() {
		this.router.navigate(["/home/prebuild-workout"]);
	}

	stopTimer() {
		this.userService.endRest();
	}

	onAbout() {
		window.location.href = "/home/about";
	}

	onSettings() {
		this.router.navigate(["/home/settings"]);
	}

	onAdmin() {
		this.router.navigate(["/admin"]);
	}

	goToHome() {
		this.router.navigate(["/home/dashboard"]);
	}
}
