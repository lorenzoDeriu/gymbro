import { FirebaseService } from "../../services/firebase.service";
import { Component, Inject } from "@angular/core";
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogRef,
} from "@angular/material/dialog";
import { AddExerciseDialogComponent } from "../add-exercise-dialog/add-exercise-dialog.component";
import { Set, TrainingProgramExercise } from "src/app/Models/Exercise.model";
import { generateId } from "src/app/utils/utils";

@Component({
	selector: "app-new-exercise-dialog",
	templateUrl: "./new-exercise-dialog.component.html",
	styleUrls: ["./new-exercise-dialog.component.css"],
})
export class NewExerciseDialogComponent {
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
		public dialogRef: MatDialogRef<NewExerciseDialogComponent>
	) {}

	async ngOnInit() {
		this.getExercises();
		if (this.data) {
			this.exercise = this.data;
			this.editMode = true;
		}
	}

	async getExercises() {
		this.options = await this.firebase.getExercise();
	}

	closeDialog() {
		this.dialogRef.close();
	}

	addSet() {
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

	removeSet(index: number) {
		this.exercise.set.splice(index, 1);
	}

	openCustomExerciseDialog() {
		let customExerciseDialog = this.dialog.open(AddExerciseDialogComponent);
		customExerciseDialog.afterClosed().subscribe(() => {
			this.getExercises();
		});
	}

	save() {
		this.dialogRef.close(this.exercise);
	}

	savable() {
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
