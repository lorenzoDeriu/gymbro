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
	public username: string;
	public emailRegister: string;
	public passwordRegister: string;
	public confirmPassword: string;
	public hidePwd: boolean = true;
	public hidePwdConfirm: boolean = true;
	public onLogin: boolean = true;
	public scrollableContainer: HTMLElement =
		document.querySelector(".scrollable");

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
			this.password !== "" &&
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
			this.passwordRegister !== "" &&
			this.passwordRegister.length >= 8 &&
			this.passwordRegister === this.confirmPassword &&
			this.username &&
			this.username !== ""
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
