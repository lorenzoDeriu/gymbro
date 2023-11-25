import { PasswordRecoverDialogComponent } from "../password-recover-dialog/password-recover-dialog.component";
import { Component } from "@angular/core";
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
export class AccessComponent {
	public username: string;
	public emailRegister: string;
	public passwordRegister: string;
	public confirmPassword: string;
	public email: string;
	public password: string;
	public hidePwd: boolean = true;
	public hidePwdConfirm: boolean = true;
	public onLogin: boolean = true;

	constructor(
		private authService: AuthService,
		private router: Router,
		private dialog: MatDialog
	) {}

	login() {
		this.authService.signin(this.email, this.password);
	}

	register() {
		this.authService.signup(
			this.emailRegister,
			this.passwordRegister,
			this.username
		);
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
			this.emailRegister &&
			!!this.emailRegister.match(
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
			) &&
			this.passwordRegister &&
			this.passwordRegister != "" &&
			this.passwordRegister.length >= 8 &&
			this.passwordRegister === this.confirmPassword &&
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
		this.hidePwdConfirm = !this.hidePwdConfirm;
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
		this.emailRegister = "";
		this.passwordRegister = "";
		this.confirmPassword = "";
		this.username = "";
	}

	forgotPassword() {
		this.dialog.open(PasswordRecoverDialogComponent, {
			disableClose: false,
		});
	}
}
