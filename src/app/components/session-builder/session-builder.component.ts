import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { FirebaseService } from "src/app/services/firebase.service";
import { UserService } from "src/app/services/user.service";
import { NewExerciseDialogComponent } from "../new-exercise-dialog/new-exercise-dialog.component";

@Component({
	selector: "app-session-builder",
	templateUrl: "./session-builder.component.html",
	styleUrls: ["./session-builder.component.css"],
})
export class SessionBuilderComponent {
	panelOpenState: boolean = false;
	date: Date = new Date();
	sessionName: string = "";

	constructor(
		private dialog: MatDialog,
		private userService: UserService,
		private router: Router,
		private firebase: FirebaseService
	) {}

	ngOnInit(): void {
		this.userService.exercisesReset();
	}

	openDialog() {
		this.dialog.open(NewExerciseDialogComponent, {
			width: "400px",
			height: "650px",
		});
	}

	public onDate(event: any): void {
		this.date = event.date;
	}

	getExercise() {
		return this.userService.getExercises();
	}

	removeElement(index: number) {
		this.userService.removeElement(index);
	}

	onCancel() {
		this.router.navigate(["/home/training-program-builder"]);
	}

	saveSession() {
		let exercises = this.userService.getExercises();
		let session = {
			name: this.sessionName,
			exercises: exercises,
		};

		console.log(session);

		this.userService.addSessionToTrainingProgram(session);
		this.router.navigate(["/home/training-program-builder"]);
	}
}
