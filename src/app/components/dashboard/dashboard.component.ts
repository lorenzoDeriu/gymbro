import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { WelcomeDialogComponent } from "../welcome-dialog/welcome-dialog.component";

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

	async ngOnInit() {
		if (localStorage.getItem("welcomeDialog") !== "true") {
			this.dialog.open(WelcomeDialogComponent, {
				disableClose: false,
			});
			localStorage.setItem("welcomeDialog", "true");
		}

		this.userService.editModeObs.subscribe(editMode => {
			this.editMode = editMode;
		});
	}

	workoutExists() {
		return localStorage.getItem("workout") != null;
	}

	workout(): void {
		if (this.workoutExists()) {
			this.router.navigate(["/home/prebuild-workout"]);
			return;
		}

		this.router.navigate(["/home/training-program-selector"]);
	}

	openWIPSnackbar(): void {
		this.snackbar.open("Presto disponibile...", "Ok!", {
			duration: 5000,
		});
	}
}
