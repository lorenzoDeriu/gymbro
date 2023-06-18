import { UserService } from '../../services/user.service';
import { Exercise } from '../../Models/Exercise.model';
import { FirebaseService } from '../../services/firebase.service';
import { Component } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddExerciseDialogComponent } from '../add-exercise-dialog/add-exercise-dialog.component';

@Component({
  selector: 'app-new-exercise-dialog',
  templateUrl: './new-exercise-dialog.component.html',
  styleUrls: ['./new-exercise-dialog.component.css']
})
export class NewExerciseDialogComponent {
public myControl = new FormControl('');
public options: string[] = [];
public filteredOptions: Observable<string[]>;
public exercise: Exercise;

public seriesCount: number = 0;
public repsCount: number = 0;
public load: number = 0;

	constructor(private firebase: FirebaseService, private userService: UserService, private dialog: MatDialog) {}

	async ngOnInit() {
		this.getExercises();
		this.exercise = new Exercise();
	}

	async getExercises() {
		let uid = JSON.parse(localStorage.getItem("user"))["uid"];
		this.options = (await this.firebase.getExercise(uid)).sort((a:string, b:string) => a.localeCompare(b));
	}

	formatLabel(value: number): string {
		return `${value}`;
	}

	onSubmit(form: NgForm) {
		// let exercise = new Exercise(
		// 	form.value.exerciseName,
		// 	form.value.series,
		// 	form.value.reps,
		// 	form.value.load,
		// 	form.value.rpe,
		// 	form.value.restTime.toString(),
		// 	form.value.note,
		// );

		this.exercise.reps = this.exercise.range[0];

		this.userService.addExercise(this.exercise);
		this.exercise = new Exercise();
	}

	onAddCustomExercise() {
		let customExerciseDialog = this.dialog.open(AddExerciseDialogComponent);
		customExerciseDialog.afterClosed().subscribe(() => {
			this.getExercises();
		});
	}
}
