import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/services/firebase.service";
import { MatDialog } from "@angular/material/dialog";
import { NotesDialogComponent } from "../notes-dialog/notes-dialog.component";
import { SafetyActionConfirmDialogComponent } from "src/app/components/safety-action-confirm-dialog/safety-action-confirm-dialog.component";
import { Workout } from "src/app/Models/Workout.model";

@Component({
	selector: "app-old-workouts",
	templateUrl: "./old-workouts.component.html",
	styleUrls: ["./old-workouts.component.css"],
})
export class OldWorkoutsComponent implements OnInit {
	public workouts: Workout[] = [];
	public loading: boolean;

	constructor(
		private userService: UserService,
		private router: Router,
		private firebase: FirebaseService,
		private dialog: MatDialog
	) {}

	async ngOnInit() {
		this.loading = true;
		await this.firebase.getWorkouts();
		this.loading = false;
	}

	public getDateFromTimestamp(timestamp: number) {
		return new Date(timestamp);
	}

	public focusCollapse(type: "program" | "session", index: number) {
		if (type === "program") {
			const collapsers: NodeListOf<Element> =
				document.querySelectorAll(".collapser");
			const collapses: NodeListOf<Element> =
				document.querySelectorAll(".collapse-body");

			for (let i = 0; i < collapsers.length; i++) {
				if (i !== index) {
					collapsers[i].classList.remove("collapsed");
					collapsers[i].setAttribute("aria-expanded", "false");
					collapses[i].classList.remove("show");
				}
			}
		}
	}

	public backToHomeButton() {
		this.router.navigate(["/home/dashboard"]);
	}

	public createWorkoutButton() {
		this.router.navigate(["/home/new-workout-choice"]);
	}

	public deleteWorkout(index: number) {
		this.dialog.open(SafetyActionConfirmDialogComponent, {
			data: {
				title: "Elimina allenamento",
				message: "Sei sicuro di voler eliminare questo allenamento?",
				args: [index, this.workouts, this.userService],
				confirm: async (
					index: number,
					workouts: Workout[],
					userService: UserService
				) => {
					workouts.splice(index, 1);
					await userService.updateWorkouts(workouts);
				},
			},
		});
	}

	public editWorkout(index: number) {
		this.router.navigate(["/home/prebuild-workout"]);
		this.userService.setWorkout(this.workouts[index]);
	}

	public showNotes(workoutIndex: number, exerciseIndex: number) {
		this.dialog.open(NotesDialogComponent, {
			width: "300px",
			data: {
				notes: this.workouts[workoutIndex].exercises[exerciseIndex].note,
			},
		});
	}
}
