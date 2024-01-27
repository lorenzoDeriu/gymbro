import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { WelcomeDialogComponent } from "../welcome-dialog/welcome-dialog.component";
import { Workout } from "src/app/Models/Workout.model";
import { SafetyActionConfirmDialogComponent } from "../safety-action-confirm-dialog/safety-action-confirm-dialog.component";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
	public editMode: boolean;
	public workoutPrevision: Workout;
	public screenWidth: number = window.innerWidth;

	constructor(
		private userService: UserService,
		private dialog: MatDialog,
		private snackbar: MatSnackBar,
		private router: Router
	) {}

	async ngOnInit() {
		if (localStorage.getItem("welcomeDialog") !== null)
			localStorage.removeItem("welcomeDialog_v12");

		if (localStorage.getItem("welcomeDialog_v10.0") !== "true") {
			this.dialog.open(WelcomeDialogComponent, {
				disableClose: false,
			});
			localStorage.setItem("welcomeDialog_v10.0", "true");
		}

		this.userService.editModeObs.subscribe(editMode => {
			this.editMode = editMode;
		});

		this.workoutPrevision = await this.userService.getWorkoutPrevision();
		this.screenWidth = window.innerWidth;

		window.onresize = () => {
			this.screenWidth = window.innerWidth;
		};
	}

	public workoutExists() {
		return localStorage.getItem("workout") != null;
	}

	public workout(): void {
		if (this.workoutExists()) {
			this.router.navigate(["/home/prebuild-workout"]);
			return;
		}

		this.router.navigate(["/home/training-program-selector"]);
	}

	public openWIPSnackbar(): void {
		this.snackbar.open("Presto disponibile...", "Ok!", {
			duration: 5000,
		});
	}

	public useWorkoutPrevision() {
		if (this.workoutExists()) {
			this.dialog.open(SafetyActionConfirmDialogComponent, {
				data: {
					title: "Attenzione",
					message:
						"Hai già un allenamento in corso, utilizzando questo ne perderai i dati. Sei sicuro di voler continuare?",
					args: [],
					confirm: async () => {
						this.userService.reuseWorkout(this.workoutPrevision);
					},
				},
			});

			return;
		}

		this.userService.reuseWorkout(this.workoutPrevision);
	}
}
