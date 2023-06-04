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
	myControl = new FormControl('');
	exercise: any[];
	options: string[] = [];
	filteredOptions: Observable<string[]>;

	seriesCount: number = 0;
	repsCount: number = 0;
	load: number = 0;

	constructor(private firebase: FirebaseService, private userService: UserService, private dialog: MatDialog) {}

	async ngOnInit() {
		this.getExercises();
	}

	async getExercises() {
		let uid = JSON.parse(localStorage.getItem("user"))["uid"];
		this.options = (await this.firebase.getExercise(uid)).sort((a:string, b:string) => a.localeCompare(b));
	}

	formatLabel(value: number): string {
		return `${value}`;
	}

	onSubmit(form: NgForm) {
		let exercise = new Exercise(
			form.value.exerciseName,
			form.value.series,
			form.value.reps,
			form.value.load,
			form.value.rpe,
			form.value.restTime.toString(),
			form.value.note
		);

		this.userService.addExercise(exercise);
	}

	onAddCustomExercise() {
		let customExerciseDialog = this.dialog.open(AddExerciseDialogComponent);
		customExerciseDialog.afterClosed().subscribe(() => {
			this.getExercises();
		});
	}
}
