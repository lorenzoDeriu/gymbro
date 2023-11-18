import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FirebaseService } from "src/app/services/firebase.service";
import { UserService } from "src/app/services/user.service";
import { SearchResult } from "../friends/friends.component";

@Component({
	selector: "app-search-result",
	templateUrl: "./search-result.component.html",
	styleUrls: ["./search-result.component.css"],
})
export class SearchResultComponent implements OnInit {
	public searchResult: SearchResult[];
	public loading: boolean = false;

	constructor(private router: Router, private route: ActivatedRoute, private firebase: FirebaseService, private userService: UserService) {}

	async ngOnInit() {
		this.loading = true;
		this.searchResult = this.userService.getSearchResult();

		if (this.searchResult.length === 0 && this.route.snapshot.paramMap.get('username')) {
			this.searchResult = await this.firebase.getMatchingUsername(
				this.route.snapshot.paramMap.get('username')
			);
		};

		this.loading = false;
	}

	public onCancel() {
		this.router.navigate(["/home/friends"]);
	}

	public async onFollow(index: number) {
		await this.firebase.addFollow(this.searchResult[index].uid);

		this.router.navigate(["/home/friends"]);
	}

	public viewProfile(index: number) {
		this.userService.setUidProfile(this.searchResult[index].uid);

		this.router.navigate(["/home/profile"]);
	}
}
