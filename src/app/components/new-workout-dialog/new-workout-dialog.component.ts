import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
	selector: "app-new-workout-dialog",
	templateUrl: "./new-workout-dialog.component.html",
	styleUrls: ["./new-workout-dialog.component.css"],
})
export class NewWorkoutDialogComponent {
	constructor(
		public dialogRef: MatDialogRef<NewWorkoutDialogComponent>,
		private router: Router,
		private userService: UserService
	) {}

	workoutExists() {
		return localStorage.getItem("workout") != null;
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

		// Set the stopwatch time to now
		/* this.userService.setStopwatchTime(new Date()); */
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
