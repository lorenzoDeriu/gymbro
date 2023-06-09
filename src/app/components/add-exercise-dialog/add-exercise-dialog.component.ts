import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { FirebaseService } from "src/app/services/firebase.service";

@Component({
	selector: "app-add-exercise-dialog",
	templateUrl: "./add-exercise-dialog.component.html",
	styleUrls: ["./add-exercise-dialog.component.css"],
})
export class AddExerciseDialogComponent {
	exercise: string;

	constructor(
		private firebase: FirebaseService,
		private snackBar: MatSnackBar,
		private router: Router,
		public dialogRef: MatDialogRef<AddExerciseDialogComponent>
	) {}

	addExercise(form: NgForm) {
		if (this.router.url == "/admin") {
			this.firebase.addExercise(form.value.exercise);
		} else {
			let uid = JSON.parse(localStorage.getItem("user"))["uid"];
			this.firebase.addCustomExercise(form.value.exercise, uid);
			this.exercise = form.value.exercise;
		}

		this.snackBar.open("Esercizio aggiunto correttamente", "Ok", {
			duration: 3000,
		});
		this.closeDialog();
	}

	closeDialog() {
		this.dialogRef.close(this.exercise);
	}
}
