import { Component, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { FirebaseService } from "./firebase.service";
import { MatDialog, MatDialogContainer, _MatDialogBase } from "@angular/material/dialog";
import { ErrorLoginDialogComponent } from "../components/error-login-dialog/error-login-dialog.component";
import { ErrorRegisterDialogComponent } from "../components/error-register-dialog/error-register-dialog.component";
import { ErrorProviderDialogComponent } from "../components/error-provider-dialog/error-provider-dialog.component";
import { UserCredential } from "firebase/auth";

export type UserData = {
	uid: string;
	email: string;
	idToken: string;
	refreshToken: string;
};

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

	private async access(
		callbackFunc: (email?: string, psw?: string) => Promise<UserCredential>,
		args?: string[]
	) {
		const credential: UserCredential = await callbackFunc(...args);

		this.loginUser({
			uid: credential.user.uid,
			email: credential.user.email,
			idToken: await credential.user.getIdToken(),
			refreshToken: credential.user.refreshToken,
		});

		if (!(await this.firebase.existInfoOf(credential.user.uid))) {
			this.createNewUserInfo();
		}
	}

	public async signup(email: string, password: string, username: string) {
		try {
			await this.access(this.firebase.registerNewUser, [email, password, username]);
		} catch (error) {
			this.dialog.open(ErrorRegisterDialogComponent, {
				disableClose: false,
			});
		}
	}

	public async signin(email: string, password: string) {
		try {
			await this.access(this.firebase.loginEmailPsw, [email, password]);
		} catch (error) {
			console.log(error);
			this.dialog.open(ErrorLoginDialogComponent, {
				disableClose: false,
			});
		}
	}

	public async accessWithGoogle() {
		try {
			await this.access(this.firebase.accessWithGoogle);
		} catch (error) {
			this.dialog.open(ErrorProviderDialogComponent, {
				disableClose: false,
			})
		}
	}

	public async accessWithMeta() {
		try {
			await this.access(this.firebase.accessWithMeta);
		} catch (error) {
			this.dialog.open(ErrorProviderDialogComponent, {
				disableClose: false,
			})
		}
	}

	public async accessWithX() {
		try {
			await this.access(this.firebase.accessWithX);
		} catch (error) {
			this.dialog.open(ErrorProviderDialogComponent, {
				disableClose: false,
			})
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

	private loginUser(user: UserData) {
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
