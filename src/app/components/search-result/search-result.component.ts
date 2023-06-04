import { UserService } from '../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
	selector: 'app-search-result',
	templateUrl: './search-result.component.html',
	styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
	public searchResult: any;

	constructor(private router: Router, private firebase: FirebaseService) {}

	ngOnInit(): void {
		this.searchResult = JSON.parse(localStorage.getItem("search-result"));
	}

	onCancel() {
		this.router.navigate(["/home/friends"]);
	}

	async onFollow(index: number) {
		await this.firebase.addFollow(this.searchResult[index].uid);

		this.router.navigate(["/home/friends"])
	}
}
