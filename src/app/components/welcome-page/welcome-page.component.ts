import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { PasswordRecoverDialogComponent } from "../password-recover-dialog/password-recover-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
	selector: "app-welcome-page",
	templateUrl: "./welcome-page.component.html",
	styleUrls: ["./welcome-page.component.css"],
})
export class WelcomePageComponent implements OnInit {
	public email: string;
	public password: string;
	public hide: boolean = true;

	constructor(
		private authService: AuthService,
		private router: Router,
		private dialog: MatDialog
	) {}

	async ngOnInit() {
		if (this.authService.isAuthenticated()) {
			this.router.navigate(["/home/dashboard"]);
		}
	}

	isDesktop(): boolean {
		return window.innerWidth > 1050;
	}

	login() {
		this.authService.signin(this.email, this.password);
	}

	signUp() {
		this.router.navigate(["/access"]);
	}

	allowLogin(): boolean {
		return (
			this.email &&
			this.email != "" &&
			this.password &&
			this.password != ""
		);
	}

	accessWithGoogle() {
		this.authService.accessWithGoogle();
	}

	forgotPassword() {
		this.dialog.open(PasswordRecoverDialogComponent, {
			width: "300px",
			height: "135px",
			disableClose: false,
		});
	}
}
