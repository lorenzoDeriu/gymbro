import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { FirebaseService } from "./firebase.service";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private loggedIn: boolean = false;

	constructor(private firebase: FirebaseService, private router: Router) {}

	public async signup(email: string, password: string, username: string) {
		let credential: any = await this.firebase.registerNewUser(
			email,
			password
		);

		if (credential == null) {
			alert("La registrazione non è andata a buon fine");
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
		}
	}

	public createNewUserInfo(username?: string) {
		let user = JSON.parse(localStorage.getItem("user"));

		this.firebase.addUser({username: username, workouts: [], trainingPrograms: [] }, user.uid);
	}

	public async signin(email: string, password: string) {
		let credential: any = await this.firebase.loginEmailPsw(
			email,
			password
		);

		if (credential == null) {
			alert("L'accesso non è andata a buon fine");
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

		// //check if browser is safari: if not, send welcome notification
		// if (!navigator.userAgent.includes("Safari"))
		// 	this.sendWelcomeNotification();

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
