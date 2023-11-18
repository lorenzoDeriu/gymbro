import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { NewWorkoutDialogComponent } from "../new-workout-dialog/new-workout-dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
	public editMode: boolean;

	constructor(
		private userService: UserService,
		private dialog: MatDialog,
		private snackbar: MatSnackBar,
		private router: Router
	) {}

	ngOnInit() {
		this.editMode = this.userService.getEditMode();
	}

	workoutExists() {
		return localStorage.getItem("workout") != null;
	}

	openNewWorkoutDialog(): void {
		if (this.workoutExists()) {
			this.router.navigate(["/home/prebuild-workout"]);
			return;
		}

		this.dialog.open(NewWorkoutDialogComponent, {
			disableClose: false,
		});
	}

	openWIPSnackbar(): void {
		this.snackbar.open("Presto disponibile...", "Ok!", {
			duration: 5000,
		});
	}
}
