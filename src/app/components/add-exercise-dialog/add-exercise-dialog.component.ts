import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
	selector: 'app-add-exercise-dialog',
	templateUrl: './add-exercise-dialog.component.html',
	styleUrls: ['./add-exercise-dialog.component.css']
})
export class AddExerciseDialogComponent {
	constructor(private firebase: FirebaseService, private snackBar: MatSnackBar, private router: Router) { }

	addExercise(form: NgForm) {
		if (this.router.url == "/admin") {
			this.firebase.addExercise(form.value.exercise);
		} else {
			let uid = JSON.parse(localStorage.getItem("user"))["uid"];
			this.firebase.addCustomExercise(form.value.exercise, uid);
		}

		this.snackBar.open("Esercizio aggiunto correttamente", "Ok", {duration: 3000});
	}
}
