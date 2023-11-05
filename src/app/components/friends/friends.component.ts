import { NgForm } from "@angular/forms";
import { FirebaseService } from "src/app/services/firebase.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
	selector: "app-friends",
	templateUrl: "./friends.component.html",
	styleUrls: ["./friends.component.css"],
})
export class FriendsComponent implements OnInit {
	public username: string;
	public uid: string;
	public friends: string;
	private _hasFollow: boolean;
	private userData: any;
	public loading: boolean;

	public followed: any[];

	constructor(private firebase: FirebaseService, private router: Router) {}

	async ngOnInit() {
		this.uid = JSON.parse(localStorage.getItem("user"))["uid"];

		this.loading = true;
		this.userData = await this.firebase.getUserData(this.uid);

		this.username = this.userData["username"];

/* 		this._hasFollow =
			this.userData["follow"] != undefined
				? this.userData.follow.length > 0
				: false;
		this.followed = await this.firebase.getFollowed(this.uid); */

		this._hasFollow = true;
		this.followed = [
			{
				username: 'Lorenzo',
				visibilityPermission: true
			},
			{
				username: 'Mario',
				visibilityPermission: true
			},
			{
				username: 'Marco',
				visibilityPermission: true
			},
			{
				username: 'Lorenzo',
				visibilityPermission: true
			},
			{
				username: 'Mario',
				visibilityPermission: true
			}
		]

		this.loading = false;
	}

	hasUsername() {
		return this.username != undefined;
	}

	async addUsername(form: NgForm) {
		let username = form.value.username;

		this.firebase.updateUsername(this.uid, username);
		this.username = await this.firebase.getUsername(this.uid);
	}

	hasFollow() {
		return this._hasFollow;
	}

	async onUsernameSearch(userSearchForm: NgForm) {
		let username = userSearchForm.value.username;

		let matchingUsername = await this.firebase.getMatchingUsername(
			username
		);

		localStorage.setItem("search-result", JSON.stringify(matchingUsername));

		this.router.navigate(["/home/search-result"]);
	}

	async onUnfollow(index: number) {
		await this.firebase.unfollow(this.uid, this.followed[index].uid);
		this.followed = await this.firebase.getFollowed(this.uid);
		this._hasFollow = await this.firebase.hasFollow(this.uid);
	}

	backToHome() {
		this.router.navigate(["/home"]);
	}

	viewProfile(index: number) {
		localStorage.setItem(
			"profile",
			JSON.stringify({ uid: this.followed[index].uid })
		);
		this.router.navigate(["/home/profile"]);
	}
}
