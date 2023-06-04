import { Exercise } from '../../Models/Exercise.model';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatDialog } from '@angular/material/dialog';
import { NotesDialogComponent } from '../notes-dialog/notes-dialog.component';

@Component({
	selector: 'app-old-workouts',
	templateUrl: './old-workouts.component.html',
	styleUrls: ['./old-workouts.component.css']
})
export class OldWorkoutsComponent implements OnInit {
	public workouts: any[] = [];
	displayedColumns: string[] = ['name', 'series-reps', 'load', 'rpe'];

	public loading: boolean;

	constructor(private userService: UserService, private router: Router, private firebase: FirebaseService, private dialog: MatDialog) {	}

	async ngOnInit() {
		this.loading = true;
		await this.getWorkouts();
		this.loading = false;
	}

	async getWorkouts() {
		this.workouts = (await this.firebase.getWorkouts()).sort((a: any, b: any) => {
			let [day, month, year] = String(a.date).split("/");
			const dateA = +new Date(+year, +month - 1, +day);
			[day, month, year] = String(b.date).split("/");
			const dateB = +new Date(+year, +month - 1, +day);
			return dateB - dateA;
		});
	}

	backToHomeButton() {
		this.router.navigate(["/home/dashboard"]);
	}

	createWorkoutButton() {
		this.router.navigate(["/home/new-workout-choice"]);
	}

	deleteWorkout(index: number) {
		this.workouts.splice(index, 1);

		this.userService.updateWorkouts(this.workouts);
	}

	showNotes(workoutIndex: number, exerciseIndex: number) {
		this.dialog.open(NotesDialogComponent, {
			width: "300px",
			data: {
				notes: this.workouts[workoutIndex]["exercises"][exerciseIndex]["note"]
			}
		});
	}
}
