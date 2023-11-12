import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
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

	constructor(private router: Router, private firebase: FirebaseService, private userService: UserService) {}

	ngOnInit(): void {
		this.searchResult = this.userService.getSearchResult();
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
