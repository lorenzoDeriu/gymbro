import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "src/app/services/auth.service";
import { NewWorkoutDialogComponent } from "../new-workout-dialog/new-workout-dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
	constructor(private authService: AuthService, private dialog: MatDialog, private snackbar: MatSnackBar) {}

	ngOnInit() {
		this.authService.isAuthenticated(); // rimuovere e sostituire con GUARD
	}

	workoutExists() {
		return localStorage.getItem("workout") != null;
	}

	openNewWorkoutDialog(): void {
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
