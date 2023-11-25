import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog, _MatDialogBase } from "@angular/material/dialog";
import { FirebaseService } from "./firebase.service";
import { ErrorLoginDialogComponent } from "../components/error-login-dialog/error-login-dialog.component";
import { ErrorRegisterDialogComponent } from "../components/error-register-dialog/error-register-dialog.component";
import { ErrorProviderDialogComponent } from "../components/error-provider-dialog/error-provider-dialog.component";
import { UserCredential } from "firebase/auth";
import { User } from "../Models/User.model";
import { UserService } from "./user.service";

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
		private userService: UserService,
		private router: Router,
		private dialog: MatDialog
	) {}

	private async access(credential: UserCredential, username?: string) {
		if (credential) {
			this.loginUser();

			if (
				!(await this.firebase.existInfoOf(credential.user.uid)).exists
			) {
				this.createNewUserInfo(username);
			}
		}

        else throw "Credential Error";
	}

	public async signup(email: string, password: string, username: string) {
		try {
			await this.access(
				await this.firebase.registerNewUser(email, password),
				username
			);
		} catch (error) {
			this.dialog.open(ErrorRegisterDialogComponent, {
				disableClose: false,
			});
		}
	}

	public async signin(email: string, password: string) {
		try {
			await this.access(
				await this.firebase.loginEmailPsw(email, password)
			);
		} catch (error) {
			this.dialog.open(ErrorLoginDialogComponent, {
				disableClose: false,
			});
		}
	}

	public async accessWithGoogle() {
		try {
			await this.access(await this.firebase.accessWithGoogle());
		} catch (error) {
			this.dialog.open(ErrorProviderDialogComponent, {
				disableClose: false,
			});
		}
	}

	public async accessWithMeta() {
		try {
			await this.access(await this.firebase.accessWithMeta());
		} catch (error) {
			this.dialog.open(ErrorProviderDialogComponent, {
				disableClose: false,
			});
		}
	}

	public async accessWithX() {
		try {
			await this.access(await this.firebase.accessWithX());
		} catch (error) {
			this.dialog.open(ErrorProviderDialogComponent, {
				disableClose: false,
			});
		}
	}

	public async createNewUserInfo(username: string = "") {
		let uid = await this.firebase.getUid();

		let userObj: User = {
			username: username,
			trainingPrograms: [],
			workout: [],
			visibility: true,
			follow: [],
			customExercises: [],
			admin: false,
			playlistUrl: "",
		};

		this.firebase.addUser(userObj, uid);
	}

	private loginUser() {
		this.loggedIn = true;
		this.userService.setupUser();
		this.router.navigate(["/home/dashboard"]);
	}

	public async isAuthenticated() {
		if (!this.loggedIn && (await this.firebase.getUid()) !== "") {
			this.loggedIn = true;
		}

		return this.loggedIn;
	}

	public logout() {
		this.firebase.signout();
		this.loggedIn = false;
		window.location.href = "/welcome";
	}

	public async deleteAccount() {
		await this.firebase.deleteUser();
		this.logout();
	}
}
