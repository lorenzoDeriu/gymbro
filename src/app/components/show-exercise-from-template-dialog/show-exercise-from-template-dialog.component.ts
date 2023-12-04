import { Component, Inject } from "@angular/core";
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogRef,
} from "@angular/material/dialog";
import { Set } from "src/app/Models/Exercise.model";
import { Workout } from "src/app/Models/Workout.model";
import { formatSets } from "src/app/utils/utils";
import { NotesDialogComponent } from "../notes-dialog/notes-dialog.component";

@Component({
	selector: "app-show-exercise-from-template-dialog",
	templateUrl: "./show-exercise-from-template-dialog.component.html",
	styleUrls: ["./show-exercise-from-template-dialog.component.css"],
})
export class ShowExerciseFromTemplateDialogComponent {
	public workout: Workout;

	constructor(
		@Inject(MAT_DIALOG_DATA) private data: any,
		private dialogRef: MatDialogRef<ShowExerciseFromTemplateDialogComponent>,
		private dialog: MatDialog
	) {}

	ngOnInit() {
		this.workout = this.data.workout;
		console.log(this.workout);
	}

	public formatSets(sets: Set[]) {
		return formatSets(sets);
	}

	public showNotes(exerciseIndex: number) {
		this.dialog.open(NotesDialogComponent, {
			data: {
				notes: this.workout.exercises[exerciseIndex].note,
			},
		});
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
