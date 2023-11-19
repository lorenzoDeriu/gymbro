import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { FeedbackDialogComponent } from "../feedback-dialog/feedback-dialog.component";
import { FirebaseService } from "src/app/services/firebase.service";
import { UserService } from "src/app/services/user.service";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
	public trainingTime: number;
	public restTime: number;
	public inTraining: boolean = false;
	public inRest: boolean = false;
	public isAdmin: boolean = false;
	public playlistUrl: string;

	constructor(
		private authservice: AuthService,
		private router: Router,
		private dialog: MatDialog,
		private firebase: FirebaseService,
		private userService: UserService,
	) {}

	async ngOnInit() {
		this.isAdmin = await this.firebase.userIsAdmin();
		this.playlistUrl = this.userService.getPlaylistURL();
	}

	fixDB() {
		this.firebase.fixDB();
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
		});
	}

	toContinueWorkout() {
		this.router.navigate(["/home/prebuild-workout"]);
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
