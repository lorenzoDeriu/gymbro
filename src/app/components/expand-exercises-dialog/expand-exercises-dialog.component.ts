import { Component, Inject } from "@angular/core";
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogRef,
} from "@angular/material/dialog";
import { SafetyActionConfirmDialogComponent } from "../safety-action-confirm-dialog/safety-action-confirm-dialog.component";
import { Exercise } from "src/app/Models/Exercise.model";

@Component({
	selector: "app-expand-exercises-dialog",
	templateUrl: "./expand-exercises-dialog.component.html",
	styleUrls: ["./expand-exercises-dialog.component.css"],
})
export class ExpandExercisesDialogComponent {
	constructor(
		public dialogRef: MatDialogRef<ExpandExercisesDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { exercises: string[] },
		private dialog: MatDialog
	) {}

	deleteItem(index: number) {
		this.dialog.open(SafetyActionConfirmDialogComponent, {
			data: {
				title: "Elimina esericizio",
				message:
					"Sei sicuro di voler eliminare questo esercizio? Questa azione è irreversibile.",
				args: [index, this.data.exercises],
				confirm: async (index: number, exercises: string[]) => {
					exercises.splice(index, 1);
				},
			},
		});
	}

	editItem(index: number) {}

	closeDialog() {
		this.dialogRef.close();
	}
}
