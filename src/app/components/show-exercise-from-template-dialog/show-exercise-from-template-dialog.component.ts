import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Exercise } from "src/app/Models/Exercise.model";

@Component({
	selector: "app-show-exercise-from-template-dialog",
	templateUrl: "./show-exercise-from-template-dialog.component.html",
	styleUrls: ["./show-exercise-from-template-dialog.component.css"],
})
export class ShowExerciseFromTemplateDialogComponent {
	public name: string;
	public sets: string[];
	constructor(
		@Inject(MAT_DIALOG_DATA) private data: any,
		private dialogRef: MatDialogRef<ShowExerciseFromTemplateDialogComponent>
	) {}

	ngOnInit() {
		this.name = this.data.name;
		this.sets = this.data.sets;
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
