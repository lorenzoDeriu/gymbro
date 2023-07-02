import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/services/firebase.service";

@Component({
	selector: "app-feedback-list",
	templateUrl: "./feedback-list.component.html",
	styleUrls: ["./feedback-list.component.css"],
})
export class FeedbackListComponent implements OnInit {
	public loading: boolean;
	private feedbacks: any = [];

	constructor(private firebase: FirebaseService) {}

	async ngOnInit() {
		this.loading = true;
		this.feedbacks = await this.firebase.getFeedbacks();
		this.loading = false;
	}

	getFeedbacks() {
		return this.feedbacks;
	}

	async removeFeedback(index: number) {
		await this.firebase.removeFeedback(this.feedbacks[index].id);
		this.ngOnInit();
	}
}
