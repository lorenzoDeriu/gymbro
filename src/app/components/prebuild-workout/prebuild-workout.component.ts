import { MatDialog } from "@angular/material/dialog";
import { FirebaseService } from "src/app/services/firebase.service";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ExerciseStatsDialogComponent } from "../exercise-stats-dialog/exercise-stats-dialog.component";
import { AddExerciseDialogComponent } from "../add-exercise-dialog/add-exercise-dialog.component";
import { SafetyActionConfirmDialogComponent } from "src/app/components/safety-action-confirm-dialog/safety-action-confirm-dialog.component";

@Component({
	selector: "app-prebuild-workout",
	templateUrl: "./prebuild-workout.component.html",
	styleUrls: ["./prebuild-workout.component.css"],
})
export class PrebuildWorkoutComponent implements OnInit, OnDestroy {
	public workout: any = {
		name: "",
		exercises: [],
	};
	public workoutIndex: number;
	public restTime: any[] = [];
	public availableExercise: string[] = [];

	constructor(
		private userService: UserService,
		private router: Router,
		private firebase: FirebaseService,
		private dialog: MatDialog
	) {}

	async ngOnInit() {
		if (localStorage.getItem("workoutToEdit") != null) {
			this.workout = JSON.parse(
				localStorage.getItem("workoutToEdit")
			).workout;
			this.workoutIndex = JSON.parse(
				localStorage.getItem("workoutToEdit")
			).index;

			let [day, month, year] = String(this.workout.date).split("/");
			this.workout.date = this.adaptDate(
				new Date(+year, +month - 1, +day)
			);
		} else if (!this.userService.getWorkoutSelected()) {
			const workoutJson = localStorage.getItem("workout");
			if (workoutJson != null) {
				this.workout = JSON.parse(workoutJson);
				this.workout.date = this.adaptDate(new Date());
			} else {
				this.workout = {
					name: "Nuovo Allenamento",
					date: this.adaptDate(new Date()),
					exercises: [],
				};
			}
		} else {
			this.workout = this.userService.getWorkoutSelected();
			this.workout.date = this.adaptDate(new Date());
		}

		localStorage.setItem("workout", JSON.stringify(this.workout));

		for (let i = 0; i < this.workout.exercises.length; i++) {
			this.workout.exercises[i].completed =
				this.workout.exercises[i].completed != undefined
					? this.workout.exercises[i].completed
					: false;

			this.restTime.push(
				this.workout.exercises[i].rest
					? { ...this.workout.exercises[i].rest, running: false }
					: { minutes: "00", seconds: "00", running: false }
			);

			if (!this.workout.exercises[i].reps) {
				if (!this.workout.exercises[i].range) {
					this.workout.exercises[i].range = [0, 0];
				}

				this.workout.exercises[i].reps =
					this.workout.exercises[i].range[0];
			}
		}

		this.availableExercise = await this.firebase.getExercise(
			JSON.parse(localStorage.getItem("user")).uid
		);

		this.availableExercise.sort();
	}

	ngOnDestroy(): void {
		if (localStorage.getItem("workoutToEdit") != null) {
			localStorage.removeItem("workoutToEdit");
			localStorage.removeItem("workout");
		}
	}

	private formatDate(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");

		return `${day}/${month}/${year}`;
	}

	private adaptDate(date: Date): string {
		return this.formatDate(date).split("/").reverse().join("-");
	}

	isDesktop() {
		return window.innerWidth > 1250;
	}

	formatLabel(value: number): string {
		return `${value}`;
	}

	saveExerciseData(exerciseIndex: number) {
		this.workout.exercises[exerciseIndex].completed = true;
		this.updateWorkoutOnLocalStorage();
	}

	updateWorkoutOnLocalStorage() {
		localStorage.removeItem("workout");
		localStorage.setItem("workout", JSON.stringify(this.workout));
	}

	onChangeExerciseData(exerciseIndex: number) {
		this.workout.exercises[exerciseIndex].completed = false;

		this.updateWorkoutOnLocalStorage();
	}

	showOldStats(exerciseIndex: number) {
		this.dialog.open(ExerciseStatsDialogComponent, {
			width: "300px",
			height: "300px",
			data: { exerciseName: this.workout.exercises[exerciseIndex].name },
		});
	}

	saveWorkout() {
		this.workout.date = this.workout.date.split("-").reverse().join("/");

		let user = JSON.parse(localStorage.getItem("user"));

		localStorage.removeItem("workout");

		if (localStorage.getItem("workoutToEdit") != null) {
			this.userService.updateWorkout(this.workout, this.workoutIndex);
			localStorage.removeItem("workoutToEdit");
		} else {
			this.firebase.saveWorkout(this.workout, user.uid);
		}

		this.router.navigate(["/home"]);
	}

	savable() {
		if (this.workout.name == "" || this.workout.exercises.length == 0)
			return false;

		for (let exercise of this.workout.exercises) {
			if (!exercise.completed) return false;
		}

		return true;
	}

	delete(exerciseIndex: number) {
		this.dialog.open(SafetyActionConfirmDialogComponent, {
			data: {
				title: "Elimina esercizio",
				message: "Sei sicuro di voler eliminare questo esercizio?",
				args: [this.workout, exerciseIndex],
				confirm: (workout: any, index: number) => {
					workout.exercises.splice(index, 1);
				},
			},
		});
	}

	onCancel() {
		this.dialog.open(SafetyActionConfirmDialogComponent, {
			data: {
				title: "Annulla",
				message: "Sei sicuro di voler annullare l'allenamento?",
				args: [],
				confirm: () => {
					localStorage.removeItem("workout");
					this.router.navigate(["/home"]);
				},
			},
		});
	}

	public totalSeconds: number = 0;
	public secondsRemaining: number = 0;
	public stopTimer: boolean = false;

	async timer(exerciseIndex: number) {
		this.restTime[exerciseIndex].running = true;
		this.stopTimer = false;

		let minutes = parseInt(this.restTime[exerciseIndex].minutes);
		let seconds = parseInt(this.restTime[exerciseIndex].seconds);

		this.totalSeconds = minutes * 60 + seconds;
		this.secondsRemaining = minutes * 60 + seconds;

		const startTime = Date.now();

		while (
			Date.now() - startTime < this.totalSeconds * 1000 &&
			!this.stopTimer
		) {
			minutes = Math.floor(this.secondsRemaining / 60);
			seconds = this.secondsRemaining % 60;

			minutes = minutes < 10 ? minutes : minutes;
			seconds = seconds < 10 ? seconds : seconds;

			await (() => new Promise(resolve => setTimeout(resolve, 1000)))();
			this.secondsRemaining =
				this.totalSeconds - Math.floor((Date.now() - startTime) / 1000);
		}

		this.restTime[exerciseIndex].running = false;
	}

	stopRestTime(exerciseIndex: number) {
		this.stopTimer = true;
		this.restTime[exerciseIndex].running = false;
	}

	percentageRemaining(): string {
		return String((this.secondsRemaining / this.totalSeconds) * 100) + "%";
	}

	formatTime(time: number) {
		let minutes = Math.floor(time / 60);
		let seconds = time % 60;

		return (
			(minutes < 10 ? "0" + minutes : minutes) +
			":" +
			(seconds < 10 ? "0" + seconds : seconds)
		);
	}

	openCustomExerciseDialog(exercise: any) {
		this.dialog
			.open(AddExerciseDialogComponent)
			.afterClosed()
			.subscribe(async customExercise => {
				if (customExercise == undefined || customExercise === "")
					return;

				exercise.name = customExercise;

				this.availableExercise = await this.firebase.getExercise(
					JSON.parse(localStorage.getItem("user")).uid
				);
			});
	}

	addExerciseToPrebuiltWorkout() {
		localStorage.removeItem("exercise");

		let exercise = {
			name: "",
			load: 0,
			RPE: 9,
			rest: {
				minutes: "02",
				seconds: "00",
				running: false,
			},
			series: 0,
			range: [0, 0],
			reps: 0,
			configurationType: "basic",

			// superset data:
			secondExercise: "",

			// advanced data:
			advanced: {
				sets: [{ reps: 0, load: 0 }],
			},
		};

		this.workout.exercises.push(exercise);
		this.restTime.push({ minutes: "00", seconds: "00", running: false });
		this.updateWorkoutOnLocalStorage();
	}

	deleteSet(exerciseIndex: number, setIndex: number) {
		this.workout.exercises[exerciseIndex].advanced.sets.splice(setIndex, 1);
	}

	addSet(exerciseIndex: number) {
		this.workout.exercises[exerciseIndex].advanced.sets.push({
			reps: 0,
			load: 0,
		});
	}

	setExerciseConfigurationType(exercise: any, type: string) {
		exercise.configType = type;
	}
}
