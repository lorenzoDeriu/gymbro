import { Component, Inject, OnInit } from "@angular/core";
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogRef,
} from "@angular/material/dialog";
import { SafetyActionConfirmDialogComponent } from "../safety-action-confirm-dialog/safety-action-confirm-dialog.component";
import { ThemeService } from "src/app/services/theme.service";

@Component({
	selector: "app-custom-excercise-dialog",
	templateUrl: "./custom-excercise-dialog.component.html",
	styleUrls: ["./custom-excercise-dialog.component.css"],
})
export class CustomExcerciseDialogComponent implements OnInit {
	public theme: "light" | "dark";

	constructor(
		public dialogRef: MatDialogRef<CustomExcerciseDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { exercises: string[] },
		private dialog: MatDialog,
		private themeService: ThemeService
	) {}

	public ngOnInit() {
		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});
	}

	public deleteItem(index: number) {
		this.dialog.open(SafetyActionConfirmDialogComponent, {
			data: {
				title: "Elimina esericizio",
				message:
					"Sei sicuro di voler eliminare questo esercizio? Questa azione è irreversibile.",
				args: [index, this.data.exercises],
				confirm: async (index: number, customExercises: any) => {
					customExercises.splice(index, 1);
				},
			},
			panelClass: [this.theme === "dark" ? "dark-dialog" : "light-dialog"]
		});
	}

	public closeDialog() {
		this.dialogRef.close();
	}
}
