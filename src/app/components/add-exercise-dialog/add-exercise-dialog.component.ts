import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { FirebaseService } from "src/app/services/firebase.service";
import { NotificationService } from "src/app/services/notification.service";
import { ThemeService } from "src/app/services/theme.service";

@Component({
	selector: "app-add-exercise-dialog",
	templateUrl: "./add-exercise-dialog.component.html",
	styleUrls: ["./add-exercise-dialog.component.css"],
})
export class AddExerciseDialogComponent implements OnInit {
	public theme: "light" | "dark";
	public exercise: string;

	constructor(
		private firebase: FirebaseService,
		private router: Router,
		public dialogRef: MatDialogRef<AddExerciseDialogComponent>,
		private themeService: ThemeService,
		private notificationService: NotificationService
	) {}

	public ngOnInit() {
		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});
	}

	addExercise(form: NgForm) {
		if (this.router.url == "/admin") {
			this.firebase.addExercise(form.value.exercise);
		} else {
			this.firebase.addCustomExercise(form.value.exercise);
			this.exercise = form.value.exercise;
		}

		this.notificationService.showSnackBarNotification(
			"Esercizio aggiunto correttamente",
			"Ok",
			{
				duration: 3000,
				panelClass: [this.theme == "dark" ? "dark-snackbar" : "light-snackbar"],
			}
		);
		
		this.closeDialog();
	}

	closeDialog() {
		this.dialogRef.close(this.exercise);
	}
}
