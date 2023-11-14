import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { FeedbackDialogComponent } from "../feedback-dialog/feedback-dialog.component";
import { FirebaseService } from "src/app/services/firebase.service";
import { UserService } from "src/app/services/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
	trainingTime: Date | undefined = undefined;
	intervalID: any;
	isAdmin: boolean = false;

	constructor(
		private authservice: AuthService,
		private router: Router,
		private dialog: MatDialog,
		private firebase: FirebaseService,
	) {}

	ngOnInit(): void {
		this.firebase.userIsAdmin().then(isAdmin => {
			this.isAdmin = isAdmin;
		});
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
