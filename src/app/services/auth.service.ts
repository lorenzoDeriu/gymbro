import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { FirebaseService } from "./firebase.service";
import { MatDialog } from "@angular/material/dialog";
import { ErrorLoginDialogComponent } from "../components/error-login-dialog/error-login-dialog.component";
import { ErrorRegisterDialogComponent } from "../components/error-register-dialog/error-register-dialog.component";
import { ErrorProviderDialogComponent } from "../components/error-provider-dialog/error-provider-dialog.component";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private loggedIn: boolean = false;

	constructor(
		private firebase: FirebaseService,
		private router: Router,
		private dialog: MatDialog
	) {}

	public async signup(email: string, password: string, username: string) {
		let credential: any = await this.firebase.registerNewUser(
			email,
			password
		);

		if (credential == null) {
			this.dialog.open(ErrorRegisterDialogComponent, {
				disableClose: false,
			});

			return;
		}

		this.loginUser({
			uid: credential.user.uid,
			email: credential.email,
			expiresIn: credential.user.stsTokenManager.expirationTime,
			idToken: credential.user.accessToken,
			refreshToken: credential.user.stsTokenManager.refreshToken,
		});

		this.createNewUserInfo(username);
	}

	public async accessWithGoogle() {
		let credential: any = await this.firebase.accessWithGoogle();

		if (credential != null) {
			this.loginUser({
				uid: credential.user.uid,
				email: credential.email,
				expiresIn: credential.user.stsTokenManager.expirationTime,
				idToken: credential.user.accessToken,
				refreshToken: credential.user.stsTokenManager.refreshToken,
			});

			if (!(await this.firebase.existInfoOf(credential.user.uid))) {
				this.createNewUserInfo();
			}
		} else {
			this.dialog.open(ErrorProviderDialogComponent, {
				disableClose: false,
			});

			return;
		}
	}

	public async accessWithMeta() {
		let credential: any = await this.firebase.accessWithMeta();

		if (credential != null) {
			this.loginUser({
				uid: credential.user.uid,
				email: credential.email,
				expiresIn: credential.user.stsTokenManager.expirationTime,
				idToken: credential.user.accessToken,
				refreshToken: credential.user.stsTokenManager.refreshToken,
			});

			if (!(await this.firebase.existInfoOf(credential.user.uid))) {
				this.createNewUserInfo();
			}
		} else {
			this.dialog.open(ErrorProviderDialogComponent, {
				disableClose: false,
			});

			return;
		}
	}

	public async accessWithX() {
		let credential: any = await this.firebase.accessWithX();

		if (credential != null) {
			this.loginUser({
				uid: credential.user.uid,
				email: credential.email,
				expiresIn: credential.user.stsTokenManager.expirationTime,
				idToken: credential.user.accessToken,
				refreshToken: credential.user.stsTokenManager.refreshToken,
			});

			if (!(await this.firebase.existInfoOf(credential.user.uid))) {
				this.createNewUserInfo();
			}
		} else {
			this.dialog.open(ErrorProviderDialogComponent, {
				disableClose: false,
			});

			return;
		}
	}

	public createNewUserInfo(username?: string) {
		let user = JSON.parse(localStorage.getItem("user"));

		let userObj: any = {
			trainingPrograms: [],
			workouts: [],
		};

		if (username) userObj = { ...userObj, username: username };

		this.firebase.addUser(userObj, user.uid);
	}

	public async signin(email: string, password: string) {
		let credential: any = await this.firebase.loginEmailPsw(
			email,
			password
		);

		if (credential == null) {
			this.dialog.open(ErrorLoginDialogComponent, {
				disableClose: false,
			});

			return;
		}

		this.loginUser({
			uid: credential.user.uid,
			email: credential.email,
			expiresIn: credential.user.stsTokenManager.expirationTime,
			idToken: credential.user.accessToken,
			refreshToken: credential.user.stsTokenManager.refreshToken,
		});
	}

	private loginUser(user: any) {
		this.loggedIn = true;
		localStorage.setItem("user", JSON.stringify(user));

		this.router.navigate(["/home/dashboard"]);
	}

	public isAuthenticated() {
		if (!this.loggedIn && localStorage.getItem("user") != null) {
			this.loggedIn = true;
		}

		return this.loggedIn;
	}

	public logout() {
		this.firebase.signout();
		this.loggedIn = false;
		localStorage.removeItem("user");
		this.router.navigate(["/welcome"]);
	}

	public getUserToken() {
		let user = JSON.parse(localStorage.getItem("user"));

		return user.idToken;
	}

	public async deleteAccount() {
		await this.firebase.deleteUser();
		this.logout();
	}
}
