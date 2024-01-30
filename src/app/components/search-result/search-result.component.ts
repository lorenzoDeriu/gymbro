import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FirebaseService } from "src/app/services/firebase.service";
import { UserService } from "src/app/services/user.service";
import { SearchResult } from "../friends/friends.component";
import { ThemeService } from "src/app/services/theme.service";
import { NotificationService } from "src/app/services/notification.service";

@Component({
	selector: "app-search-result",
	templateUrl: "./search-result.component.html",
	styleUrls: ["./search-result.component.css"],
})
export class SearchResultComponent implements OnInit {
	public searchResult: SearchResult[];
	public loading: boolean = false;
	public theme: "dark" | "light";
	public following: boolean = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private firebase: FirebaseService,
		private themeService: ThemeService,
		private userService: UserService,
		private notification: NotificationService
	) {}

	async ngOnInit() {
		this.loading = true;
		this.searchResult = this.userService.getSearchResult();

		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});

		if (
			this.searchResult.length === 0 &&
			this.route.snapshot.paramMap.get("searchUsername")
		) {
			this.searchResult = await this.firebase.getMatchingUsername(
				this.route.snapshot.paramMap.get("searchUsername")
			);
		}

		this.loading = false;
	}

	public onCancel() {
		this.router.navigate(["/home/friends"]);
	}

	public async onFollow(index: number) {
		this.following = true;
		await this.firebase.addFollow(this.searchResult[index].uid);
		this.notification.sendNotification(
			this.searchResult[index].uid,
			"follow"
		);
		this.following = false;

		this.router.navigate(["/home/friends"]);
	}

	public viewProfile(index: number) {
		this.userService.setUidProfile(this.searchResult[index].uid);

		this.router.navigate([
			"/home/profile",
			{ searchUsername: this.searchResult[index].username },
		]);
	}
}
