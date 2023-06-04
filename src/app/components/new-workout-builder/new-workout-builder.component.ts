import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NewExerciseDialogComponent } from '../new-exercise-dialog/new-exercise-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseStatsDialogComponent } from '../exercise-stats-dialog/exercise-stats-dialog.component';

@Component({
	selector: 'app-new-workout-builder',
	templateUrl: './new-workout-builder.component.html',
	styleUrls: ['./new-workout-builder.component.css']
})
export class NewWorkoutBuilderComponent {
	panelOpenState: boolean = false;
	date: Date = new Date();
	workoutName: string = "";

	constructor(private dialog: MatDialog, private userService: UserService, private router: Router, private firebase: FirebaseService) {}

	openDialog() {
		this.dialog.open(NewExerciseDialogComponent, {width: "400px", height: "650px"})
	}

	public onDate(event: any): void {
		this.date = event.date;
	}

	getExercise() {
		return this.userService.getExercises();
	}

	removeElement(index: number) {
		this.userService.removeElement(index)
	}

	onCancel() {
		this.userService.exercisesReset();
		this.router.navigate(["/home/dashboard"])
	}

	showOldStats(exerciseIndex: number) {
		this.dialog.open(ExerciseStatsDialogComponent, {width: "300px", height: "300px", data: {exerciseName: this.userService.getExercises()[exerciseIndex].name}})
	}

	saveWorkout() {
		let exercises = this.userService.getExercises()
		let workout = {
			name: this.workoutName,
			exercises: exercises,
			date: this.date.toLocaleDateString()
		}

		let user = JSON.parse(localStorage.getItem("user"))

		this.firebase.saveWorkout(workout, user.uid);
		this.userService.exercisesReset();

		this.router.navigate(["/home"]);
	}
}
