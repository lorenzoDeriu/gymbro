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
	public emailRegister: string;
	public passwordRegister: string;
	public confirmPassword: string;
	public email: string;
	public password: string;
	public hidePwd: boolean = true;
	public hidePwdConfirm: boolean = true;
	public onLogin: boolean = true;
	private installButton: HTMLElement | undefined = document.getElementById(
		"install"
	) as HTMLButtonElement;
	private installPrompt: any;

	constructor(
		private authService: AuthService,
		private router: Router,
		private dialog: MatDialog
	) {}

	async ngOnInit() {
		if (this.authService.isAuthenticated()) {
			this.router.navigate(["/home/dashboard"]);
		}

		this.installButton = document.getElementById(
			"install"
		) as HTMLButtonElement;

		window.addEventListener("beforeinstallprompt", event => {
			event.preventDefault();
			this.installPrompt = event;
			this.installButton.removeAttribute("hidden");
		});
	}

	async installApp() {
		if (!this.installPrompt) {
			return;
		}

		const result = await this.installPrompt.prompt();
		this.disableInAppInstallPrompt();
		if (result.outcome === "dismissed") window.location.reload();
	}

	disableInAppInstallPrompt() {
		this.installPrompt = null;
		this.installButton.setAttribute("hidden", "");
	}

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
