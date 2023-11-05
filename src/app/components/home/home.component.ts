import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { FeedbackDialogComponent } from "../feedback-dialog/feedback-dialog.component";
import { FirebaseService } from "src/app/services/firebase.service";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
	constructor(
		private authservice: AuthService,
		private router: Router,
		private dialog: MatDialog,
		private firebase: FirebaseService,
	) {}

	ngOnInit(): void {}

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
			width: "600px",
			height: "370px",
		});
	}

	onAbout() {
		this.router.navigate(["/home/about"]);
	}

	onSettings() {
		this.router.navigate(["/home/settings"]);
	}

	goToHome() {
		this.router.navigate(["/home/dashboard"]);
	}
}
