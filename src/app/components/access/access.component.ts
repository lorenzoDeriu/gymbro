import { PasswordRecoverDialogComponent } from "../password-recover-dialog/password-recover-dialog.component";
import { Component, OnInit } from "@angular/core";
import {
	FormControl,
	FormGroupDirective,
	NgForm,
	Validators,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(
		control: FormControl | null,
		form: FormGroupDirective | NgForm | null
	): boolean {
		const isSubmitted = form && form.submitted;
		return !!(
			control &&
			control.invalid &&
			(control.dirty || control.touched || isSubmitted)
		);
	}
}

@Component({
	selector: "app-access",
	templateUrl: "./access.component.html",
	styleUrls: ["./access.component.css"],
})
export class AccessComponent implements OnInit {
	public username: string;
	public emailR: string;
	public passwordR: string;
	public confirmPasswordR: string;
	public email: string;
	public password: string;
	public hidePwd: boolean = true;
	public hidePwdC: boolean = true;
	public onLogin: boolean = true;

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

	register() {
		this.authService.signup(this.emailR, this.passwordR);
	}

	access() {
		this.router.navigate(["/access"]);
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

	allowRegister(): boolean {
		return (
			this.emailR &&
			!!this.emailR.match(
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
			) &&
			this.passwordR &&
			this.passwordR != "" &&
			this.passwordR.length >= 8 &&
			this.passwordR === this.confirmPasswordR &&
			this.username &&
			this.username != ""
		);
	}

	accessWithGoogle() {
		this.authService.accessWithGoogle();
	}

	accessWithFacebook() {
		this.authService.accessWithMeta();
	}

	accessWithTwitter() {
		this.authService.accessWithX();
	}

	showHidePassword() {
		this.hidePwd = !this.hidePwd;
	}

	showHidePasswordC() {
		this.hidePwdC = !this.hidePwdC;
	}

	switchToLogin() {
		this.clearForms();
		this.onLogin = true;
	}

	switchToRegister() {
		this.clearForms();
		this.onLogin = false;
	}

	clearForms() {
		this.email = "";
		this.password = "";
		this.emailR = "";
		this.passwordR = "";
		this.confirmPasswordR = "";
		this.username = "";
	}

	forgotPassword() {
		this.dialog.open(PasswordRecoverDialogComponent, {
			disableClose: false,
		});
	}
}
