import { MatDialog } from "@angular/material/dialog";
import { FirebaseService } from "src/app/services/firebase.service";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { Component, OnInit } from "@angular/core";
import { ExerciseStatsDialogComponent } from "../exercise-stats-dialog/exercise-stats-dialog.component";
import { AddExerciseDialogComponent } from "../add-exercise-dialog/add-exercise-dialog.component";
import { SafetyActionConfirmDialogComponent } from "src/app/components/safety-action-confirm-dialog/safety-action-confirm-dialog.component";
import { Workout } from "src/app/Models/Workout.model";
import { EffectiveSet } from "src/app/Models/Exercise.model";
import { convertTimediffToTime, generateId } from "src/app/utils/utils";

export interface Progress {
	/* access to the complete must refer to the following logic:
	 *	-> completed[exerciseIndex][setIndex]: boolean
	 */
	completed: boolean[][];
}

@Component({
	selector: "app-prebuild-workout",
	templateUrl: "./prebuild-workout.component.html",
	styleUrls: ["./prebuild-workout.component.css"],
})
export class PrebuildWorkoutComponent implements OnInit {
	public availableExercise: string[] = [];
	public workout: Workout;
	public workoutProgress: Progress = { completed: [] };
	public date: string = this.fromTimestampToString(Date.now());
	public loading: boolean = false;
	public editMode: boolean = false;

	constructor(
		private userService: UserService,
		private router: Router,
		private firebase: FirebaseService,
		private dialog: MatDialog
	) {}

	async ngOnInit() {
		this.loading = true;

		this.userService.editModeObs.subscribe(editMode => {
			this.editMode = editMode;
		});

		this.availableExercise = await this.firebase.getExercise();

		this.workout = this.userService.getWorkout();
		this.date = this.fromTimestampToString(this.workout.date);
		this.initWorkoutProgress();

		localStorage.setItem(
			"workoutProgress",
			JSON.stringify(this.workoutProgress)
		);

		this.loading = false;
	}

	private initWorkoutProgress() {
		this.workout.exercises.forEach((exercise, exerciseIndex) => {
			this.workoutProgress.completed[exerciseIndex] = [];

			exercise.set.forEach((_, setIndex) => {
				this.workoutProgress.completed[exerciseIndex][setIndex] = false;
			});
		});
	}

	public savable(): boolean {
		return (
			this.workout.name !== "" &&
			this.workout.exercises.length !== 0 &&
			this.workoutProgress.completed.every(exercise =>
				exercise.every(setCompleted => setCompleted)
			)
		);
	}

	public finishWorkout() {
		if (
			this.workoutProgress.completed.some(exercise =>
				exercise.some(setCompleted => !setCompleted)
			)
		) {
			this.dialog.open(SafetyActionConfirmDialogComponent, {
				data: {
					title: "Allenamento incompleto",
					message: "Sei sicuro di voler terminare l'allenamento?",
					args: [],
					confirm: () => {
						this.saveWorkout();
					},
				},
			});
		} else {
			this.saveWorkout();
		}
	}

	public saveWorkout() {
		this.workout.date = this.fromStringToTimestamp(this.date);
		this.userService.updateWorkout(this.workout);

		this.userService.saveWorkout();

		localStorage.removeItem("workoutProgress");
		this.router.navigate(["/home"]);
	}

	public filterRepsInput(e: Event) {
		const event = e.target as HTMLInputElement;
		const inputValue = event.value;

		if (!"0123456789".includes(inputValue[inputValue.length - 1])) {
			event.value = inputValue.slice(0, inputValue.length - 1);
		}

		if (inputValue.startsWith("0")) {
			event.value = inputValue.slice(1);
		}
	}

	public filterLoadInput(e: Event) {
		const event = e.target as HTMLInputElement;
		const inputValue = event.value;

		if (!"0123456789".includes(inputValue[inputValue.length - 1])) {
			event.value = inputValue.slice(0, inputValue.length - 1);
		}

		if (inputValue.length > 1 && inputValue.startsWith("0")) {
			event.value = inputValue.slice(1);
		}
	}

	public isSetValid(exerciseIndex: number, setIndex: number) {
		return (
			this.workout.exercises[exerciseIndex].set[setIndex].reps !== null &&
			this.workout.exercises[exerciseIndex].set[setIndex].reps > 0 &&
			this.workout.exercises[exerciseIndex].set[setIndex].load !== null &&
			this.workout.exercises[exerciseIndex].set[setIndex].load >= 0
		);
	}

	public toggleCompleted(exerciseIndex: number, setIndex: number) {
		if (!this.workoutProgress.completed[exerciseIndex][setIndex]) {
			const { minutes, seconds } =
				this.workout.exercises[exerciseIndex].rest; // Extract rest time from workout

			const rest: number = (+minutes * 60 + +seconds) * 1000; // Convert rest time to milliseconds

			this.userService.startTimer(rest);
		}

		this.workoutProgress.completed[exerciseIndex][setIndex] =
			!this.workoutProgress.completed[exerciseIndex][setIndex];

		this.userService.updateWorkout(this.workout);
	}

	public markAllCompleted() {
		this.workoutProgress.completed.forEach((exercise, exerciseIndex) => {
			exercise.forEach((_, setIndex) => {
				this.workoutProgress.completed[exerciseIndex][setIndex] = true;
			});
		});

		this.userService.updateWorkout(this.workout);
	}

	public addExercise() {
		this.workout.exercises.push({
			name: "Nuovo Esercizio",
			intensity: "hard",
			rest: {
				minutes: "02",
				seconds: "00",
			},
			note: "",
			set: [],
			groupId: generateId(),
		});

		this.userService.updateWorkout(this.workout);
		this.workoutProgress.completed.push([]);
	}

	public onCancel() {
		this.dialog.open(SafetyActionConfirmDialogComponent, {
			data: {
				title: "Annulla allenamento",
				message: "Sei sicuro di voler annullare l'allenamento?",
				args: [],
				confirm: () => {
					this.userService.resetWorkout();
					localStorage.removeItem("workoutProgress");
					this.userService.endChronometer();
					this.userService.endRest();
					this.router.navigate(["/home"]);
				},
			},
		});
	}

	public openCustomExerciseDialog(exercise: number) {
		this.dialog
			.open(AddExerciseDialogComponent, {
				disableClose: false,
			})
			.afterClosed()
			.subscribe(async customExercise => {
				if (customExercise == undefined || customExercise === "")
					return;

				this.workout.exercises[exercise].name = customExercise;
				this.userService.updateWorkout(this.workout);

				this.availableExercise = await this.firebase.getExercise();
			});
	}

	public deleteSet(exerciseIndex: number, setIndex: number) {
		this.toggleCompleted(exerciseIndex, setIndex);

		this.workout.exercises[exerciseIndex].set.splice(setIndex, 1);
		this.userService.updateWorkout(this.workout);

		this.workoutProgress.completed[exerciseIndex].splice(setIndex, 1);
	}

	public addSet(exerciseIndex: number) {
		if (this.workout.exercises[exerciseIndex].set.length > 0) {
			const lastSet: EffectiveSet =
				this.workout.exercises[exerciseIndex].set[
					this.workout.exercises[exerciseIndex].set.length - 1
				];

			this.workout.exercises[exerciseIndex].set.push({
				reps: lastSet.reps,
				load: lastSet.load,
			});
		} else {
			this.workout.exercises[exerciseIndex].set.push({
				reps: 8,
				load: 0,
			});
		}

		this.userService.updateWorkout(this.workout);
		this.workoutProgress.completed[exerciseIndex].push(false);
	}

	public showOldStats(exerciseIndex: number) {
		this.dialog.open(ExerciseStatsDialogComponent, {
			data: {
				exerciseName: this.workout.exercises[exerciseIndex].name,
			},
			disableClose: false,
		});
	}

	public delete(exerciseIndex: number) {
		this.dialog.open(SafetyActionConfirmDialogComponent, {
			data: {
				title: "Elimina esercizio",
				message: "Sei sicuro di voler eliminare questo esercizio?",
				args: [this.workout, exerciseIndex],
				confirm: (workout: Workout, index: number) => {
					workout.exercises.splice(index, 1);
					this.userService.updateWorkout(this.workout);

					this.workoutProgress.completed.splice(index, 1);
				},
			},
		});
	}

	private fromStringToTimestamp(date: string): number {
		return Date.parse(date);
	}

	private fromTimestampToString(date: number): string {
		const d = new Date(date);
		return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
	}
}
