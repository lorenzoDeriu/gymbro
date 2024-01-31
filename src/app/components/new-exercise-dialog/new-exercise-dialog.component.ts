import { FirebaseService } from "../../services/firebase.service";
import { Component, Inject, OnInit } from "@angular/core";
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogRef,
} from "@angular/material/dialog";
import { AddExerciseDialogComponent } from "../add-exercise-dialog/add-exercise-dialog.component";
import { Set, TrainingProgramExercise } from "src/app/Models/Exercise.model";
import { generateId } from "src/app/utils/utils";
import { ThemeService } from "src/app/services/theme.service";

@Component({
	selector: "app-new-exercise-dialog",
	templateUrl: "./new-exercise-dialog.component.html",
	styleUrls: ["./new-exercise-dialog.component.css"],
})
export class NewExerciseDialogComponent implements OnInit {
	public theme: "light" | "dark";
	public options: string[] = [];
	public exercise: TrainingProgramExercise = {
		name: "",
		intensity: "hard",
		rest: {
			minutes: "02",
			seconds: "00",
		},
		note: "",
		set: [
			{
				minimumReps: 8,
				maximumReps: 10,
			},
		],
		groupId: generateId(),
	};

	public editMode = false;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private firebase: FirebaseService,
		private dialog: MatDialog,
		private themeService: ThemeService,
		public dialogRef: MatDialogRef<NewExerciseDialogComponent>
	) {}

	public async ngOnInit() {
		this.getExercises();

		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});

		if (this.data) {
			this.exercise = this.data;
			this.editMode = true;
		}
	}

	public async getExercises() {
		this.options = await this.firebase.getExercise();
	}

	public closeDialog() {
		this.dialogRef.close();
	}

	public addSet() {
		if (this.exercise.set.length > 0) {
			const lastSet: Set =
				this.exercise.set[this.exercise.set.length - 1];

			this.exercise.set.push({
				minimumReps: lastSet.minimumReps,
				maximumReps: lastSet.maximumReps,
			});
		} else {
			this.exercise.set.push({
				minimumReps: 8,
				maximumReps: 10,
			});
		}
	}

	public removeSet(index: number) {
		this.exercise.set.splice(index, 1);
	}

	public openCustomExerciseDialog() {
		let customExerciseDialog = this.dialog.open(AddExerciseDialogComponent, {
			panelClass: [this.theme === "dark" ? "dark-dialog" : "light-dialog"]
		});
		customExerciseDialog.afterClosed().subscribe(() => {
			this.getExercises();
		});
	}

	public save() {
		this.dialogRef.close(this.exercise);
	}

	public savable() {
		return (
			this.exercise.name !== "" &&
			this.exercise.set.length > 0 &&
			this.exercise.set.every(
				set => set.minimumReps > 0 && set.maximumReps > 0
			) &&
			this.exercise.set.every(set => set.minimumReps <= set.maximumReps)
		);
	}
}
