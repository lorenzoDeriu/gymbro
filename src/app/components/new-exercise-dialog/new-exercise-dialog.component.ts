import { UserService } from "../../services/user.service";
import { Exercise } from "../../Models/Exercise.model";
import { FirebaseService } from "../../services/firebase.service";
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AddExerciseDialogComponent } from "../add-exercise-dialog/add-exercise-dialog.component";

@Component({
	selector: "app-new-exercise-dialog",
	templateUrl: "./new-exercise-dialog.component.html",
	styleUrls: ["./new-exercise-dialog.component.css"],
})
export class NewExerciseDialogComponent {
	public options: string[] = [];
	public exercise = {
		name: "",
		series: 0,
		range: [0, 0],
		rest: {
			minutes: 0,
			seconds: 0,
		},
		RPE: 0,
		notes: "",
	};

	private editMode = false;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private firebase: FirebaseService,
		private dialog: MatDialog,
		public dialogRef: MatDialogRef<NewExerciseDialogComponent>,
	) {}

	async ngOnInit() {
		this.getExercises();
		if (this.data) {
			this.exercise = this.data;
			this.editMode = true;
		}
	}

	async getExercises() {
		let uid = JSON.parse(localStorage.getItem("user"))["uid"];
		this.options = (await this.firebase.getExercise(uid)).sort(
			(a: string, b: string) => a.localeCompare(b)
		);
	}

	openCustomExerciseDialog() {
		let customExerciseDialog = this.dialog.open(AddExerciseDialogComponent);
		customExerciseDialog.afterClosed().subscribe(() => {
			this.getExercises();
		});
	}

	isDesktop() {
		return window.innerWidth > 500;
	}

	save() {
		this.dialogRef.close(this.exercise);
	}

	savable() {
		return (
			this.exercise.name != "" &&
			this.exercise.series != 0 &&
			this.exercise.range[0] != 0 &&
			this.exercise.range[1] != 0
		);
	}
}
