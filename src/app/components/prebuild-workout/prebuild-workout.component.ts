import { MatDialog } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { ExercisePickerDialogComponent } from '../exercise-picker-dialog/exercise-picker-dialog.component';
import { ExerciseStatsDialogComponent } from '../exercise-stats-dialog/exercise-stats-dialog.component';

@Component({
  selector: 'app-prebuild-workout',
  templateUrl: './prebuild-workout.component.html',
  styleUrls: ['./prebuild-workout.component.css']
})
export class PrebuildWorkoutComponent implements OnInit {
	public workout: any;
	public date: Date = new Date();

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

	ngOnInit(): void {
		this.workout = this.userService.getWorkoutSelected();

		if (this.workout == undefined) {
			const workoutjson = localStorage.getItem("workout");
			if (workoutjson != null) {
				this.workout = JSON.parse(workoutjson);
			} else {
				this.workout = {
					name: "",
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
	}

	formatLabel(value: number): string {
		return `${value}`;
	}

	saveExerciseData(exerciseIndex: number) {
		this.workout.exercises[exerciseIndex].completed = true;

		/* this.workout.exercises[exerciseIndex].series = form.value.series;
		this.workout.exercises[exerciseIndex].reps = form.value.reps;
		this.workout.exercises[exerciseIndex].load = form.value.load;
		this.workout.exercises[exerciseIndex].rpe = form.value.rpe; */

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
		if (this.date == null) return false;

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
		let exercisePicker = this.dialog.open(ExercisePickerDialogComponent, {width: "350px", height: "130px"})

		exercisePicker.afterClosed().subscribe(() => {
			let exerciseName = JSON.parse(localStorage.getItem("exercise"))
			localStorage.removeItem("exercise");

			if (exerciseName != null) {
				let exercise = {
					name: exerciseName.exercise,
					load: 0,
					RPE: 0,
					restTime: "",
					series: 0,
					reps: 0
				}

				this.workout.exercises.push(exercise)
				this.updateWorkoutOnLocalStorage();
			}
		});
	}
}
