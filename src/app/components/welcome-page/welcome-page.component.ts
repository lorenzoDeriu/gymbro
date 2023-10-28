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
	public hidePwd: boolean = true;

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

	login() {
		this.authService.signin(this.email, this.password);
	}

	signUp() {
		this.router.navigate(["/access"]);
	}

	allowLogin(): boolean {
		return (
			this.email &&
			!!this.email.match(
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
			) &&
			this.password &&
			this.password != "" &&
			this.password.length >= 8
		);
	}

	accessWithGoogle() {
		this.authService.accessWithGoogle();
	}

	accessWithFacebook() {
		this.authService.accessWithMeta();
	}

	accessWithApple() {
		// to do
	}

	showHidePassword() {
		this.hidePwd = !this.hidePwd;
	}

	forgotPassword() {
		this.dialog.open(PasswordRecoverDialogComponent, {
			disableClose: false,
		});
	}

	toFirstSlide() {
		document.getElementById("0")!.scrollIntoView(true);
		document.getElementById("ctrl0")!.classList.add("active");
		document.getElementById("ctrl1")!.classList.remove("active");
		document.getElementById("ctrl2")!.classList.remove("active");
	}

	toSecondSlide() {
		document.getElementById("1")!.scrollIntoView(true);
		document.getElementById("ctrl1")!.classList.add("active");
		document.getElementById("ctrl0")!.classList.remove("active");
		document.getElementById("ctrl2")!.classList.remove("active");
	}

	toThirdSlide() {
		document.getElementById("2")!.scrollIntoView(true);
		document.getElementById("ctrl2")!.classList.add("active");
		document.getElementById("ctrl0")!.classList.remove("active");
		document.getElementById("ctrl1")!.classList.remove("active");
	}
}
