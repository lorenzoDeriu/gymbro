import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/services/firebase.service";
import { NotesDialogComponent } from "../notes-dialog/notes-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { Session, TrainingProgram } from "src/app/Models/TrainingProgram.model";
import { Workout } from "src/app/Models/Workout.model";
import { Set } from "src/app/Models/Exercise.model";
import { formatSets } from "src/app/utils/utils";
import { ThemeService } from "src/app/services/theme.service";

@Component({
	selector: "app-training-program-selector",
	templateUrl: "./training-program-selector.component.html",
	styleUrls: ["./training-program-selector.component.css"],
})
export class TrainingProgramSelectorComponent implements OnInit {
	public loading: boolean;
	public theme: "light" | "dark";
	public trainingPrograms: TrainingProgram[];

	constructor(
		private userService: UserService,
		private router: Router,
		private firebase: FirebaseService,
		private dialog: MatDialog,
		private themeService: ThemeService
	) {}

	async ngOnInit() {
		this.loading = true;

		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});

		this.trainingPrograms = await this.firebase.getTrainingPrograms();
		this.loading = false;
	}

	public selectWorkout(programIndex: number, sessionIndex: number) {
		this.userService.setWorkout(
			this.fromSessionToWorkout(
				this.trainingPrograms[programIndex].session[sessionIndex]
			)
		);
		this.userService.startChronometer();
		localStorage.setItem(
			"workoutTemplate",
			JSON.stringify({
				name: this.trainingPrograms[programIndex].name,
				exercises: [
					...this.trainingPrograms[programIndex].session[
						sessionIndex
					].exercises.map(exercise => ({
						name: exercise.name,
						intensity: exercise.intensity,
						rest: exercise.rest,
						note: exercise.note,
						groupId: exercise.groupId,
						template: exercise.set,
					})),
				],
			})
		);
		this.router.navigate(["/home/prebuild-workout"]);
	}

	formatSets(sets: Set[]) {
		return formatSets(sets);
	}

	private fromSessionToWorkout(session: Session): Workout {
		const workout: Workout = {
			...session,
			date: Date.now(),
			trainingTime: 0,
			exercises: session.exercises.map(exercise => ({
				name: exercise.name,
				intensity: exercise.intensity,
				rest: exercise.rest,
				note: exercise.note,
				groupId: exercise.groupId,
				template: exercise.set,
				set: exercise.set.map(set => ({
					reps: set.minimumReps,
					load: 0,
				})),
			})),
		};

		return workout;
	}

	public cancel() {
		this.router.navigate(["/home"]);
	}

	public createWorkout() {
		this.userService.startChronometer();
		this.router.navigate(["/home/prebuild-workout"]);
	}

	public focusCollapse(type: "program" | "session", index: number) {
		if (type === "program") {
			const collapsers: NodeListOf<Element> =
				document.querySelectorAll(".collapser");
			const collapses: NodeListOf<Element> =
				document.querySelectorAll(".collapse-body");

			for (let i = 0; i < collapsers.length; i++) {
				if (i !== index) {
					collapsers[i]?.classList.remove("collapsed");
					collapsers[i]?.setAttribute("aria-expanded", "false");
					collapses[i]?.classList.remove("show");
				}
			}
		}
	}

	public showNotes(
		trainingProgramIndex: number,
		sessionIndex: number,
		exerciseIndex: number
	) {
		this.dialog.open(NotesDialogComponent, {
			data: {
				notes: this.trainingPrograms[trainingProgramIndex].session[
					sessionIndex
				].exercises[exerciseIndex].note,
			},
			panelClass: [
				this.theme === "dark" ? "dark-dialog" : "light-dialog",
			],
		});
	}
}
