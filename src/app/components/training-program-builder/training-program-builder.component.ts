import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/services/firebase.service";
import { MatDialog } from "@angular/material/dialog";
import { NewExerciseDialogComponent } from "../new-exercise-dialog/new-exercise-dialog.component";

@Component({
	selector: "app-training-program-builder",
	templateUrl: "./training-program-builder.component.html",
	styleUrls: ["./training-program-builder.component.css"],
})
export class TrainingProgramBuilderComponent implements OnInit {
	trainingProgram: any = {
		name: "",
		session: [{ name: "Sessione 1", exercises: [] }],
	};

	private editMode = false;
	private index: number;

	constructor(
		private router: Router,
		private userService: UserService,
		private firebase: FirebaseService,
		private dialog: MatDialog
	) {}

	async ngOnInit() {
		if (localStorage.getItem("trainingProgramToEdit")) {
			this.index = JSON.parse(
				localStorage.getItem("trainingProgramToEdit")
			).index;
			localStorage.removeItem("trainingProgramToEdit");

			this.trainingProgram = (await this.firebase.getTrainingPrograms())[
				this.index
			];
			this.trainingProgram = this.legacyConversion(this.trainingProgram);
			this.editMode = true;
		}
	}

	legacyConversion(trainingProgram: any) {
		trainingProgram.session = trainingProgram.session.map(
			(session: any) => {
				session.exercises = session.exercises.map((exercise: any) => {
					if (!exercise.configurationType) {
						exercise.configurationType = "basic";
					}

					if (exercise.advanced == undefined) {
						exercise.advanced = {
							sets: [],
						};
					}

					if (exercise.configurationType === "advanced") {
						exercise.advanced?.sets?.forEach((set: any) => {
							if (set.load == undefined) {
								set.load = 0;
							}

							if (set.reps == undefined) {
								set.reps = set.min;
							}
						});
					}

					if (exercise.reps) {
						exercise.range = [exercise.reps, exercise.reps];
						delete exercise.reps;
					}

					if (exercise.load != undefined) {
						delete exercise.load;
					}

					if (exercise.restTime) {
						exercise.rest = {
							minutes: exercise.restTime.split(":")[0],
							seconds: exercise.restTime.split(":")[1],
						};

						delete exercise.restTime;
					}

					return exercise;
				});

				return session;
			}
		);

		return trainingProgram;
	}

	onCancel() {
		this.router.navigate(["/home/training-programs"]);
	}

	onNewSessionBuild() {
		this.router.navigate(["/home/session-builder"]);
	}

	async removeElement(index: number) {
		this.userService.removeSessionFromTrianingProgram(index);
		this.trainingProgram.session =
			await this.userService.getTrainingProgram();
	}

	addExercise(session: any) {
		this.dialog
			.open(NewExerciseDialogComponent, {
				width: "500px",
				maxWidth: "95vw",
			})
			.afterClosed()
			.subscribe(exercise => {
				if (exercise.name != "") {
					session.exercises.push(exercise);
				}
			});
	}

	addSession() {
		this.trainingProgram = {
			...this.trainingProgram,
			session: [
				...this.trainingProgram.session,
				{ name: "", exercises: [] },
			],
		};
	}

	deleteSession(index: number) {
		this.trainingProgram.session.splice(index, 1);
	}

	deleteExercise(session: any, exerciseIndex: number) {
		session.exercises.splice(exerciseIndex, 1);
	}

	editExercise(session: any, exerciseIndex: number) {
		this.dialog
			.open(NewExerciseDialogComponent, {
				width: "500px",
				maxWidth: "95vw",
				data: session.exercises[exerciseIndex],
			})
			.afterClosed()
			.subscribe(exercise => {
				if (exercise.name != "") {
					session.exercises[exerciseIndex] = exercise;
				}
			});
	}
	async saveTrainingProgram() {
		if (this.editMode) {
			await this.firebase.editTrainingProgram(
				this.trainingProgram,
				this.index
			);
			this.router.navigate(["/home/training-programs"]);
		} else {
			await this.firebase.addTrainingProgram(this.trainingProgram);
			this.router.navigate(["/home/training-programs"]);
		}
	}
}
