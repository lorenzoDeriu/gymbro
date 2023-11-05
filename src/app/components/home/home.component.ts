import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { FeedbackDialogComponent } from "../feedback-dialog/feedback-dialog.component";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
	trainingTime: Date = new Date();

	constructor(
		private authservice: AuthService,
		private router: Router,
		private dialog: MatDialog
	) {}

	ngOnInit(): void {
		setInterval(() => {
			this.trainingTime = new Date();
		}, 1000);
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
