import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { EffectiveSet } from "src/app/Models/Exercise.model";
import { Workout } from "src/app/Models/Workout.model";
import { FirebaseService } from "src/app/services/firebase.service";
import { ThemeService } from "src/app/services/theme.service";

import {
	formatEffectiveSets,
	getDatesFor,
	getSessionExerciseFor,
} from "src/app/utils/utils";

@Component({
	selector: "app-exercise-stats-dialog",
	templateUrl: "./exercise-stats-dialog.component.html",
	styleUrls: ["./exercise-stats-dialog.component.css"],
})
export class ExerciseStatsDialogComponent implements OnInit {
	public theme: "light" | "dark";
	private workouts: Workout[];
	public stats: any[] = [];

	public loading: boolean;

	constructor(
		@Inject(MAT_DIALOG_DATA) private data: any,
		private firebase: FirebaseService,
		private themeService: ThemeService,
		private dialogRef: MatDialogRef<ExerciseStatsDialogComponent>
	) {}

	exerciseName() {
		return this.data.exerciseName;
	}

	async ngOnInit() {
		this.loading = true;

		this.themeService.themeObs.subscribe((theme) => {
			this.theme = theme;
		});

		this.workouts = await this.firebase.getWorkouts();

		let dates = getDatesFor(this.data.exerciseName, this.workouts);

		this.stats = getSessionExerciseFor(
			this.data.exerciseName,
			dates,
			this.workouts
		);

		this.stats.reverse();

		this.loading = false;
	}

	formatEffectiveSets(sets: EffectiveSet[]) {
		return formatEffectiveSets(sets);
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
