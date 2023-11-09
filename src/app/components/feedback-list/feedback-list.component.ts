import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/services/firebase.service";
import { SafetyActionConfirmDialogComponent } from "../safety-action-confirm-dialog/safety-action-confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
	selector: "app-feedback-list",
	templateUrl: "./feedback-list.component.html",
	styleUrls: ["./feedback-list.component.css"],
})
export class FeedbackListComponent implements OnInit {
	public loading: boolean;
	private feedbacks: any = [];

	constructor(private firebase: FirebaseService, private dialog: MatDialog) {}

	async ngOnInit() {
		this.loading = true;
		this.feedbacks = await this.firebase.getFeedbacks();
		this.loading = false;
	}

	getFeedbacks() {
		return this.feedbacks;
	}

	async removeFeedback(index: number) {
		this.dialog.open(SafetyActionConfirmDialogComponent, {
			data: {
				title: "Elimina feedback",
				message:
					"Sei sicuro di voler eliminare questo feedback?",
				args: [index],
				confirm: async (
					index: number,
				) => {
					await this.firebase.removeFeedback(this.feedbacks[index].id);
					this.ngOnInit();
				},
			},
		});
	}
}
