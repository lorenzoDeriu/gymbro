import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
@Component({
	selector: "app-new-workout-dialog",
	templateUrl: "./new-workout-dialog.component.html",
	styleUrls: ["./new-workout-dialog.component.css"],
})
export class NewWorkoutDialogComponent {
	constructor(
		public dialogRef: MatDialogRef<NewWorkoutDialogComponent>,
		private router: Router
	) {}

	workoutExists() {
		return localStorage.getItem("workout") !== null;
	}

	allowNavigate() {
		return (
			(document.getElementById("selectTraining") as HTMLSelectElement)
				.value !== "Seleziona..."
		);
	}

	navigate(path: string) {
		this.router.navigate([path]);
		this.closeDialog();
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
