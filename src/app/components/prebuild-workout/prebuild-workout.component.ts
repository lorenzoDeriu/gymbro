import { MatDialog } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { ExerciseStatsDialogComponent } from '../exercise-stats-dialog/exercise-stats-dialog.component';

@Component({
  selector: 'app-prebuild-workout',
  templateUrl: './prebuild-workout.component.html',
  styleUrls: ['./prebuild-workout.component.css']
})
export class PrebuildWorkoutComponent implements OnInit {
	public workout: any;
	public date: Date = new Date();

	public availableExercise: string[];

	public chosenDate: Date;

	constructor(private userService: UserService, private router: Router, private firebase: FirebaseService, private dialog: MatDialog) {}

	get dateUTC() {
		if(this.chosenDate) {
		  return new Date(this.chosenDate.getUTCFullYear(),
		  this.chosenDate.getUTCMonth(), this.chosenDate.getUTCDate(),
			this.chosenDate.getUTCHours(), this.chosenDate.getUTCMinutes(),
			this.chosenDate.getUTCSeconds());
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
					exercises: []
				}
			}
		} else {
			localStorage.setItem("workout", JSON.stringify(this.workout))
		}

		for (let i = 0; i < this.workout.exercises.length; i++) {
			this.workout.exercises[i]["completed"] = (
				this.workout.exercises[i].completed != undefined ?
				this.workout.exercises[i].completed :
				false
			);
		}

		this.availableExercise = await this.firebase.getExercise(JSON.parse(localStorage.getItem("user")).uid);
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
		this.dialog.open(ExerciseStatsDialogComponent, {width: "300px", height: "300px", data: {exerciseName: this.workout.exercises[exerciseIndex].name}})
	}

	saveWorkout() {
		let user = JSON.parse(localStorage.getItem("user"))

		this.workout["date"] = this.date.toLocaleDateString();

		localStorage.removeItem("workout");

		this.firebase.saveWorkout(this.workout, user.uid);
		this.router.navigate(["/home"]);
	}

	savable() {
		if (this.workout.name == "" || this.workout.exercises.length == 0) return false;

		for (let exercise of this.workout.exercises) {
			if (!exercise.completed) return false
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

	addExerciseToPrebuiltWorkout() {
		localStorage.removeItem("exercise");

		let exercise = {
			name: "",
			load: 0,
			RPE: 0,
			restTime: "",
			series: 0,
			reps: 0,
		}

		this.workout.exercises.push(exercise)
		this.updateWorkoutOnLocalStorage();
	}
}
