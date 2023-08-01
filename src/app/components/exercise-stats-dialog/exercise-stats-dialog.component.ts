import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FirebaseService } from "src/app/services/firebase.service";

import { Utils } from "src/app/utils/utils";

@Component({
	selector: "app-exercise-stats-dialog",
	templateUrl: "./exercise-stats-dialog.component.html",
	styleUrls: ["./exercise-stats-dialog.component.css"],
})
export class ExerciseStatsDialogComponent implements OnInit {
	private workouts: any[];
	public stats: any[] = [];

	public loading: boolean;

	private utils: Utils = new Utils();

	constructor(
		@Inject(MAT_DIALOG_DATA) private data: any,
		private firebase: FirebaseService
	) {}

	exerciseName() {
		return this.data.exerciseName;
	}

	async ngOnInit() {
		this.loading = true;
		this.workouts = await this.firebase.getWorkouts();

		let dates = this.utils.getDatesFor(
			this.data.exerciseName,
			this.workouts
		);

		this.stats = this.utils.getSessionExerciseFor(
			this.data.exerciseName,
			dates,
			this.workouts
		);

		this.stats.reverse();

		this.loading = false;
	}
}
