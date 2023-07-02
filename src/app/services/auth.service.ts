import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { FirebaseService } from "./firebase.service";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private loggedIn: boolean = false;

	constructor(private firebase: FirebaseService, private router: Router) {}

	public async signup(email: string, password: string) {
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
		this.createNewUserInfo();
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

	sendWelcomeNotification() {
		Notification.requestPermission().then(
			(result: NotificationPermission) => {
				if (result === "granted") {
					let notification = new Notification("Benvenuto su GymBro", {
						body: "Grazie per aver scelto GymBro, l'applicazione che ti aiuta a gestire i tuoi allenamenti e monitora i tuoi progressi.",
						icon: "assets/icons/icon-72x72.png",
					});

					console.log(notification);
				}
			}
		);
	}

	public createNewUserInfo() {
		let user = JSON.parse(localStorage.getItem("user"));

		this.firebase.addUser({ workouts: [], trainingPrograms: [] }, user.uid);
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

		this.sendWelcomeNotification();

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
