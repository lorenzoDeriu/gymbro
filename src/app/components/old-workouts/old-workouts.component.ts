import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/services/firebase.service";
import { MatDialog } from "@angular/material/dialog";
import { NotesDialogComponent } from "../notes-dialog/notes-dialog.component";
import { SafetyActionConfirmDialogComponent } from "src/app/components/safety-action-confirm-dialog/safety-action-confirm-dialog.component";
import { Workout } from "src/app/Models/Workout.model";
import {
	formatEffectiveSets,
	convertTimediffToTime,
} from "src/app/utils/utils";
import { EffectiveSet } from "src/app/Models/Exercise.model";
import { th } from "date-fns/locale";

@Component({
	selector: "app-old-workouts",
	templateUrl: "./old-workouts.component.html",
	styleUrls: ["./old-workouts.component.css"],
})
export class OldWorkoutsComponent implements OnInit {
	public workouts: Workout[] = [];
	public loading: boolean;
	public splittedWorkouts: Workout[][] = [];
	public currentPage: number;
	public lastPage: number = Math.ceil(this.workouts.length / 6);
	public current6Workouts: Workout[] = [];

	constructor(
		private userService: UserService,
		private router: Router,
		private firebase: FirebaseService,
		private dialog: MatDialog
	) {}

	async ngOnInit() {
		this.loading = true;
		this.currentPage = localStorage.getItem("currentPage") ? parseInt(localStorage.getItem("currentPage")) : 1;
		this.workouts = await this.firebase.getWorkouts();
		this.current6Workouts = this.get6WorkoutsByPage(this.currentPage);
		this.loading = false;
	}

	public get6WorkoutsByPage(page: number): Workout[] {
		const workouts: Workout[] = this.workouts.slice(
			(page - 1) * 6,
			page * 6
		);

		return workouts;
	}

	public goToFirstPage() {
		this.currentPage = 1;
		localStorage.setItem("currentPage", this.currentPage.toString());
		this.current6Workouts = this.get6WorkoutsByPage(this.currentPage);
	}

	public goToLastPage() {
		this.currentPage = Math.ceil(this.workouts.length / 6);
		localStorage.setItem("currentPage", this.currentPage.toString());
		this.current6Workouts = this.get6WorkoutsByPage(this.currentPage);
	}

	public previousPage() {
		if (this.currentPage > 1) {
			this.currentPage--;
			localStorage.setItem("currentPage", this.currentPage.toString());
			this.current6Workouts = this.get6WorkoutsByPage(this.currentPage);
		}
	}

	public nextPage() {
		if (this.currentPage < this.workouts.length / 6) {
			this.currentPage++;
			localStorage.setItem("currentPage", this.currentPage.toString());
			this.current6Workouts = this.get6WorkoutsByPage(this.currentPage);
		}
	}

	public formatEffectiveSets(sets: EffectiveSet[]): string[] {
		return formatEffectiveSets(sets);
	}

	public getTimeFromTimestamp(timestamp: number) {
		const timeFromTimestamp: string = convertTimediffToTime(timestamp);
		const splittedTimeFromTimestamp: string[] =
			timeFromTimestamp.split(":");
		const hours: string = splittedTimeFromTimestamp[0];
		const minutes: string = splittedTimeFromTimestamp[1];
		const seconds: string = splittedTimeFromTimestamp[2];
		const hoursFiltered: string = hours.startsWith("0")
			? hours.split("")[1]
			: hours;
		const minutesFiltered: string = minutes.startsWith("0")
			? minutes.split("")[1]
			: minutes;
		const secondsFiltered: string = seconds.startsWith("0")
			? seconds.split("")[1]
			: seconds;

		if (hoursFiltered === "0") {
			if (minutesFiltered === "0") {
				return secondsFiltered + "s";
			}
			return minutesFiltered + "m " + secondsFiltered + "s";
		}

		return (
			hoursFiltered +
			"h " +
			minutesFiltered +
			"m " +
			secondsFiltered +
			"s"
		);
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

	workoutExists() {
		return localStorage.getItem("workout") !== null;
	}

	public editWorkout(index: number) {
		if (this.workoutExists()) {
			this.dialog.open(SafetyActionConfirmDialogComponent, {
				data: {
					title: "Attenzione",
					message:
						"Hai già un allenamento in corso, modificando questo ne perderai i dati. Sei sicuro di voler continuare?",
					args: [index],
					confirm: async (index: number) => {
						this.userService.setWorkout(this.workouts[index]);
						this.userService.setEditMode(true);
						this.userService.setWorkoutToEditIndex(index);

						this.router.navigate(["/home/prebuild-workout"]);
					},
				},
			});

			return;
		}

		this.userService.setWorkout(this.workouts[index]);
		this.userService.setEditMode(true);
		this.userService.setWorkoutToEditIndex(index);

		this.router.navigate(["/home/prebuild-workout"]);
	}

	public showNotes(workoutIndex: number, exerciseIndex: number) {
		this.dialog.open(NotesDialogComponent, {
			width: "300px",
			data: {
				notes: this.workouts[workoutIndex].exercises[exerciseIndex]
					.note,
			},
		});
	}

	public goToHome() {
		localStorage.removeItem("currentPage");
		this.router.navigate(["/home/dashboard"]);
	}
}
