import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { PasswordRecoverDialogComponent } from "../password-recover-dialog/password-recover-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { ThemeService } from "src/app/services/theme.service";
import { NotificationService } from "src/app/services/notification.service";

@Component({
	selector: "app-welcome-page",
	templateUrl: "./welcome-page.component.html",
	styleUrls: ["./welcome-page.component.css"],
})
export class WelcomePageComponent implements OnInit {
	public theme: "light" | "dark";
	public email: string;
	public password: string;
	public username: string;
	public emailRegister: string;
	public passwordRegister: string;
	public confirmPassword: string;
	public hidePwd: boolean = true;
	public hidePwdConfirm: boolean = true;
	public onLogin: boolean = true;
	public agreePrivacy: boolean = false;
	public scrollableContainer: HTMLElement =
		document.querySelector(".scrollable");
	private installButton: HTMLElement | undefined = document.getElementById(
		"install"
	) as HTMLButtonElement;
	private installPrompt: any;

	public installButtonMobile: HTMLElement | undefined =
		document.getElementById("installMobile") as HTMLButtonElement;
	private installPromptMobile: any;

	constructor(
		private authService: AuthService,
		private router: Router,
		private dialog: MatDialog,
		private themeService: ThemeService,
		private notificationService: NotificationService
	) {}

	async ngOnInit() {
		if (this.authService.isAuthenticated()) {
			this.router.navigate(["/home/dashboard"]);
		}

		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});

		this.installButton = document.getElementById(
			"install"
		) as HTMLButtonElement;
		this.installButtonMobile = document.getElementById(
			"installMobile"
		) as HTMLButtonElement;

		window.addEventListener("beforeinstallprompt", event => {
			event.preventDefault();
			this.installPrompt = event;
			this.installButton.removeAttribute("hidden");
			this.installPromptMobile = event;
			this.installButtonMobile.removeAttribute("hidden");
		});
	}

	async ngAfterViewInit() {
		this.scrollableContainer = document.querySelector(".scrollable");

		this.scrollableContainer.addEventListener("scroll", () => {
			const scrollLeft: number = this.scrollableContainer.scrollLeft;

			if (scrollLeft === 0) {
				this.activeSlide(0, false);
				this.activeSlide(0, true);
			}

			if (scrollLeft === innerWidth) {
				this.activeSlide(1, false);
				this.activeSlide(1, true);
			}

			if (scrollLeft === 2 * innerWidth) {
				this.activeSlide(2, false);
				this.activeSlide(2, true);
			}
		});
	}

	async ngOnDestroy() {
		this.scrollableContainer.removeEventListener("scroll", () => {});
	}

	public mobileInstallBtnVisiblity() {
		return !this.installButtonMobile.hasAttribute("hidden");
	}

	async installApp(device: "desktop" | "mobile") {
		if (device === "desktop") {
			if (!this.installPrompt) {
				return;
			}

			const result = await this.installPrompt.prompt();
			this.disableInAppInstallPrompt();
			if (result.outcome === "dismissed") window.location.reload();
		} else {
			if (!this.installPromptMobile) {
				return;
			}

			const result = await this.installPromptMobile.prompt();
			this.disableInAppInstallPrompt();
			if (result.outcome === "dismissed") window.location.reload();
		}
	}

	disableInAppInstallPrompt() {
		this.installPrompt = null;
		this.installButton.setAttribute("hidden", "");
		this.installPromptMobile = null;
		this.installButtonMobile.setAttribute("hidden", "");
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

	allowLogin(): boolean {
		return (
			this.agreePrivacy &&
			this.email &&
			!!this.email.match(
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
			) &&
			this.password &&
			this.password !== "" &&
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
			this.passwordRegister !== "" &&
			this.passwordRegister.length >= 8 &&
			this.passwordRegister === this.confirmPassword &&
			this.username &&
			this.username !== ""
		);
	}

	accessWithGoogle() {
		if (!this.agreePrivacy) {
			this.notificationService.showSnackBarNotification(
				"Devi accettare la Privacy Policy per accedere!",
				"Ok",
				{
					duration: 3000,
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
				"Ok",
				{
					duration: 3000,
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
				"Ok",
				{
					duration: 3000,
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

	activeSlide(slide: number, mobile: boolean) {
		if (mobile) {
			switch (slide) {
				case 0:
					document.getElementById("ctrl0-m")!.classList.add("active");
					document
						.getElementById("ctrl1-m")!
						.classList.remove("active");
					document
						.getElementById("ctrl2-m")!
						.classList.remove("active");
					break;
				case 1:
					document.getElementById("ctrl1-m")!.classList.add("active");
					document
						.getElementById("ctrl0-m")!
						.classList.remove("active");
					document
						.getElementById("ctrl2-m")!
						.classList.remove("active");
					break;
				case 2:
					document.getElementById("ctrl2-m")!.classList.add("active");
					document
						.getElementById("ctrl0-m")!
						.classList.remove("active");
					document
						.getElementById("ctrl1-m")!
						.classList.remove("active");
					break;
			}
		} else {
			switch (slide) {
				case 0:
					document.getElementById("ctrl0")!.classList.add("active");
					document
						.getElementById("ctrl1")!
						.classList.remove("active");
					document
						.getElementById("ctrl2")!
						.classList.remove("active");
					break;
				case 1:
					document.getElementById("ctrl1")!.classList.add("active");
					document
						.getElementById("ctrl0")!
						.classList.remove("active");
					document
						.getElementById("ctrl2")!
						.classList.remove("active");
					break;
				case 2:
					document.getElementById("ctrl2")!.classList.add("active");
					document
						.getElementById("ctrl0")!
						.classList.remove("active");
					document
						.getElementById("ctrl1")!
						.classList.remove("active");
					break;
			}
		}
	}

	toFirstSlide() {
		document.getElementById("0")!.scrollIntoView(true);
		this.activeSlide(0, false);
	}

	toSecondSlide() {
		document.getElementById("1")!.scrollIntoView(true);
		this.activeSlide(1, false);
	}

	toThirdSlide() {
		document.getElementById("2")!.scrollIntoView(true);
		this.activeSlide(2, false);
	}

	toFirstSlideM() {
		document.getElementById("0-m")!.scrollIntoView(true);
		this.activeSlide(0, true);
	}

	toSecondSlideM() {
		document.getElementById("1-m")!.scrollIntoView(true);
		this.activeSlide(1, true);
	}

	toThirdSlideM() {
		document.getElementById("2-m")!.scrollIntoView(true);
		this.activeSlide(2, true);
	}
}
