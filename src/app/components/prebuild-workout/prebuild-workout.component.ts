import { MatDialog } from "@angular/material/dialog";
import { FirebaseService } from "src/app/services/firebase.service";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { Component, OnInit } from "@angular/core";
import { ExerciseStatsDialogComponent } from "../exercise-stats-dialog/exercise-stats-dialog.component";
import { AddExerciseDialogComponent } from "../add-exercise-dialog/add-exercise-dialog.component";

@Component({
	selector: "app-prebuild-workout",
	templateUrl: "./prebuild-workout.component.html",
	styleUrls: ["./prebuild-workout.component.css"],
})
export class PrebuildWorkoutComponent implements OnInit {
	public workout: any = {
		name: "",
		exercises: [],
	};
	public restTime: any[] = [];
	public date: Date = new Date();

	public availableExercise: string[] = [];

	public chosenDate: Date;

	constructor(
		private userService: UserService,
		private router: Router,
		private firebase: FirebaseService,
		private dialog: MatDialog
	) {}

	get dateUTC() {
		if (this.chosenDate) {
			return new Date(
				this.chosenDate.getUTCFullYear(),
				this.chosenDate.getUTCMonth(),
				this.chosenDate.getUTCDate(),
				this.chosenDate.getUTCHours(),
				this.chosenDate.getUTCMinutes(),
				this.chosenDate.getUTCSeconds()
			);
		}

		return null;
	}

	async ngOnInit() {
		this.workout = this.userService.getWorkoutSelected();

		if (this.workout == undefined) {
			const workoutjson = localStorage.getItem("workout");
			if (workoutjson != null) {
				this.workout = JSON.parse(workoutjson);
			} else {
				this.workout = {
					name: "Nuovo Allenamento",
					exercises: [],
				};
			}
		} else {
			localStorage.setItem("workout", JSON.stringify(this.workout));
		}

		for (let i = 0; i < this.workout.exercises.length; i++) {
			this.workout.exercises[i]["completed"] =
				this.workout.exercises[i].completed != undefined
					? this.workout.exercises[i].completed
					: false;

			this.restTime.push(
				this.workout.exercises[i].rest
					? { ...this.workout.exercises[i].rest, running: false }
					: { minutes: "00", seconds: "00", running: false }
			);

			this.workout.exercises[i].reps =
				this.workout.exercises[i].range[0] ?? 0;
		}

		this.workout.date = this.formatDate(this.date);
		this.availableExercise = await this.firebase.getExercise(
			JSON.parse(localStorage.getItem("user")).uid
		);
	}

	private formatDate(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
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
		let user = JSON.parse(localStorage.getItem("user"));

		this.workout["date"] = this.date.toLocaleDateString();

		localStorage.removeItem("workout");

		this.firebase.saveWorkout(this.workout, user.uid);
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
		this.workout.exercises.splice(exerciseIndex, 1);
	}

	onDate(event: any): void {
		this.date = event.date;
	}

	onCancel() {
		localStorage.removeItem("workout");
		this.router.navigate(["/home"]);
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

			minutes = minutes < 10 ? 0 + minutes : minutes;
			seconds = seconds < 10 ? 0 + seconds : seconds;

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
				exercise.name = customExercise;

				console.log(exercise.name, customExercise);
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
			RPE: 0,
			rest: { minutes: "00", seconds: "00", running: false },
			series: 0,
			range: [0, 0],
			reps: 0,
		};

		this.workout.exercises.push(exercise);
		this.restTime.push({ minutes: "00", seconds: "00", running: false });
		this.updateWorkoutOnLocalStorage();
	}
}
