import { NgForm } from "@angular/forms";
import { FirebaseService } from "src/app/services/firebase.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { ThemeService } from "src/app/services/theme.service";

export interface FollowedUserInfo {
	uid: string;
	username: string;
	visibilityPermission: boolean;
	profilePicUrl: string;
}

export interface SearchResult {
	uid: string;
	username: string;
	profilePicUrl: string;
}

@Component({
	selector: "app-friends",
	templateUrl: "./friends.component.html",
	styleUrls: ["./friends.component.css"],
})
export class FriendsComponent implements OnInit {
	private _hasFollow: boolean;
	private username: string;
	public theme: "dark" | "light";
	public loading: boolean;
	public unfollowing: boolean;
	public friends: string;
	public followed: FollowedUserInfo[];

	constructor(
		private firebase: FirebaseService,
		private router: Router,
		private userService: UserService,
		private themeService: ThemeService
	) {}

	async ngOnInit() {
		this.loading = true;

		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});

		this.username = await this.firebase.getUsername();
		this.followed = await this.firebase.getFollowed();

		this._hasFollow = this.followed.length > 0;
		this.loading = false;
	}

	public hasUsername() {
		return this.username !== undefined;
	}

	async addUsername(form: NgForm) {
		let username = form.value.username;

		await this.firebase.updateUsername(username);
		this.username = await this.firebase.getUsername();
	}

	public hasFollow() {
		return this._hasFollow;
	}

	public async onUsernameSearch(userSearchForm: NgForm) {
		let username = userSearchForm.value.username;

		let matchingUsername = await this.firebase.getMatchingUsername(
			username
		);

		this.userService.setSearchResult(matchingUsername);
		this.router.navigate([
			"/home/search-result",
			{ searchUsername: username },
		]);
	}

	public async onUnfollow(index: number) {
		this.unfollowing = true;
		await this.firebase.unfollow(this.followed[index].uid);
		this.followed = await this.firebase.getFollowed();
		this._hasFollow = this.followed.length > 0;
		this.unfollowing = false;
	}

	public backToHome() {
		this.router.navigate(["/home"]);
	}

	public viewProfile(index: number) {
		this.userService.setUidProfile(this.followed[index].uid);

		this.router.navigate([
			"/home/profile",
			{ username: this.followed[index].username },
		]);
	}
}
