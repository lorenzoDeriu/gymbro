import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/services/firebase.service";
import { NotesDialogComponent } from "../notes-dialog/notes-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { Session, TrainingProgram } from "src/app/Models/TrainingProgram.model";
import { Workout } from "src/app/Models/Workout.model";

@Component({
	selector: "app-training-program-selector",
	templateUrl: "./training-program-selector.component.html",
	styleUrls: ["./training-program-selector.component.css"],
})
export class TrainingProgramSelectorComponent implements OnInit {
	public loading: boolean;
	public trainingPrograms: TrainingProgram[];

	constructor(
		private userService: UserService,
		private router: Router,
		private firebase: FirebaseService,
		private dialog: MatDialog
	) {}

	async ngOnInit() {
		this.loading = true;
		this.trainingPrograms = await this.firebase.getTrainingPrograms();
		this.loading = false;
	}

	public selectWorkout(programIndex: number, sessionIndex: number) {
		this.userService.setWorkoutSelected(
			this.fromSessionToWorkout(
				this.trainingPrograms[programIndex].session[sessionIndex]
			)
		);
		this.router.navigate(["/home/prebuild-workout"]);
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

	public showNotes(
		trainingProgramIndex: number,
		sessionIndex: number,
		exerciseIndex: number
	) {
		this.dialog.open(NotesDialogComponent, {
			width: "300px",
			data: {
				notes: this.trainingPrograms[trainingProgramIndex]["session"][
					sessionIndex
				]["exercises"][exerciseIndex]["note"],
			},
		});
	}
}
