import { FirebaseService } from "../../services/firebase.service";
import { Component, Inject } from "@angular/core";
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogRef,
} from "@angular/material/dialog";
import { AddExerciseDialogComponent } from "../add-exercise-dialog/add-exercise-dialog.component";
import { TrainingProgramExercises } from "src/app/Models/Exercise.model";

@Component({
	selector: "app-new-exercise-dialog",
	templateUrl: "./new-exercise-dialog.component.html",
	styleUrls: ["./new-exercise-dialog.component.css"],
})
export class NewExerciseDialogComponent {
	public options: string[] = [];
	public exercise: TrainingProgramExercises = {
		name: "",
		intensity: "hard",
		rest: {
			minutes: "02",
			seconds: "00",
		},
		note: "",
		set: [
			{
				minimumReps: 6,
				maximumReps: 8,
			},
		],
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
		this.exercise.set.push({ minimumReps: 6, maximumReps: 8 });
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
			this.exercise.set.every(
				set =>
					set.minimumReps < set.maximumReps &&
					set.maximumReps > set.minimumReps
			)
		);
	}
}
