import { Component, Inject, OnInit } from "@angular/core";
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogRef,
} from "@angular/material/dialog";
import { Set } from "src/app/Models/Exercise.model";
import { Workout } from "src/app/Models/Workout.model";
import { formatSets } from "src/app/utils/utils";
import { NotesDialogComponent } from "../notes-dialog/notes-dialog.component";
import { ThemeService } from "src/app/services/theme.service";

@Component({
	selector: "app-show-exercise-from-template-dialog",
	templateUrl: "./show-exercise-from-template-dialog.component.html",
	styleUrls: ["./show-exercise-from-template-dialog.component.css"],
})
export class ShowExerciseFromTemplateDialogComponent implements OnInit {
	public theme: "light" | "dark";
	public workout: Workout;

	constructor(
		@Inject(MAT_DIALOG_DATA) private data: { workout: Workout },
		private dialogRef: MatDialogRef<ShowExerciseFromTemplateDialogComponent>,
		private dialog: MatDialog,
		private themeService: ThemeService
	) {}

	public ngOnInit() {
		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});

		this.workout = this.data.workout;
	}

	public formatSets(sets: Set[]) {
		return formatSets(sets);
	}

	public showNotes(exerciseIndex: number) {
		this.dialog.open(NotesDialogComponent, {
			data: {
				notes: this.workout.exercises[exerciseIndex].note,
			},
			panelClass: [this.theme === "dark" ? "dark-dialog" : "light-dialog"]
		});
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
