import { PasswordRecoverDialogComponent } from "../password-recover-dialog/password-recover-dialog.component";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "src/app/services/auth.service";
import { NotificationService } from "src/app/services/notification.service";
import { ThemeService } from "src/app/services/theme.service";

@Component({
	selector: "app-access",
	templateUrl: "./access.component.html",
	styleUrls: ["./access.component.css"],
})
export class AccessComponent implements OnInit {
	public theme: "light" | "dark";
	public username: string;
	public emailRegister: string;
	public passwordRegister: string;
	public confirmPassword: string;
	public email: string;
	public password: string;
	public hidePwd: boolean = true;
	public hidePwdConfirm: boolean = true;
	public onLogin: boolean = true;
	public agreePrivacy: boolean = false;

	constructor(
		private authService: AuthService,
		private dialog: MatDialog,
		private themeService: ThemeService,
		private notificationService: NotificationService
	) {}

	ngOnInit() {
		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});
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

	allowLogin(): boolean {
		return (
			this.agreePrivacy &&
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
			this.agreePrivacy &&
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
		if (!this.agreePrivacy) {
			this.notificationService.showSnackBarNotification(
				"Devi accettare la Privacy Policy per accedere!",
				"OK",
				{
					duration: 5000,
					panelClass: ["warning-snackbar"],
				}
			);

			return;
		}
		this.authService.accessWithGoogle();
	}

	accessWithFacebook() {
		if (!this.agreePrivacy) {
			this.notificationService.showSnackBarNotification(
				"Devi accettare la Privacy Policy per accedere!",
				"OK",
				{
					duration: 5000,
					panelClass: ["warning-snackbar"],
				}
			);

			return;
		}
		this.authService.accessWithMeta();
	}

	accessWithTwitter() {
		if (!this.agreePrivacy) {
			this.notificationService.showSnackBarNotification(
				"Devi accettare la Privacy Policy per accedere!",
				"OK",
				{
					duration: 5000,
					panelClass: ["warning-snackbar"],
				}
			);

			return;
		}
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
			panelClass: [
				this.theme === "dark" ? "dark-dialog" : "light-dialog",
			],
		});
	}
}
