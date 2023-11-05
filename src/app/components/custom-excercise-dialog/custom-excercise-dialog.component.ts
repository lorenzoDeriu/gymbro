import { Component, Inject } from "@angular/core";
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogRef,
} from "@angular/material/dialog";
import { SafetyActionConfirmDialogComponent } from "../safety-action-confirm-dialog/safety-action-confirm-dialog.component";

@Component({
	selector: "app-custom-excercise-dialog",
	templateUrl: "./custom-excercise-dialog.component.html",
	styleUrls: ["./custom-excercise-dialog.component.css"],
})
export class CustomExcerciseDialogComponent {
	constructor(
		public dialogRef: MatDialogRef<CustomExcerciseDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { excercises: string[] },
		private dialog: MatDialog
	) {}

	deleteItem(index: number) {
		this.dialog.open(SafetyActionConfirmDialogComponent, {
			data: {
				title: "Elimina esericizio",
				message:
					"Sei sicuro di voler eliminare questo esercizio? Questa azione è irreversibile.",
				args: [index, this.data.excercises],
				confirm: async (index: number, customExercises: any) => {
					customExercises.splice(index, 1);
				},
			},
		});
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
