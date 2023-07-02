import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/services/firebase.service";
import { MatDialog } from "@angular/material/dialog";
import { NewExerciseDialogComponent } from "../new-exercise-dialog/new-exercise-dialog.component";

export interface TrainingProgram {
	name: string;
	session: any[];
}

@Component({
	selector: "app-training-program-builder",
	templateUrl: "./training-program-builder.component.html",
	styleUrls: ["./training-program-builder.component.css"],
})
export class TrainingProgramBuilderComponent implements OnInit {
	trainingProgram: TrainingProgram = {
		name: "",
		session: [{ name: "Sessione 1", exercises: [] }],
	};

	constructor(
		private router: Router,
		private userService: UserService,
		private firebase: FirebaseService,
		private dialog: MatDialog
	) {}

	async ngOnInit() {
		// this.trainingProgram.session =
		// 	await this.userService.getTrainingProgram();
	}

	onCancel() {
		this.router.navigate(["/home/training-programs"]);
	}

	onNewSessionBuild() {
		this.router.navigate(["/home/session-builder"]);
	}

	async removeElement(index: number) {
		this.userService.removeSessionFromTrianingProgram(index);
		this.trainingProgram.session =
			await this.userService.getTrainingProgram();
	}

	addExercise(session: any) {
		this.dialog
			.open(NewExerciseDialogComponent, {
				width: "500px",
				maxWidth: "95vw",
			})
			.afterClosed()
			.subscribe(exercise => {
				if (exercise.name != "") {
					session.exercises.push(exercise);
				}
			});
	}

	addSession() {
		this.trainingProgram = {
			...this.trainingProgram,
			session: [
				...this.trainingProgram.session,
				{ name: "", exercises: [] },
			],
		};
	}

	deleteSession(index: number) {
		this.trainingProgram.session.splice(index, 1);
	}

	deleteExercise(session: any, exerciseIndex: number) {
		session.exercises.splice(exerciseIndex, 1);
	}

	editExercise(session: any, exerciseIndex: number) {
		this.dialog
			.open(NewExerciseDialogComponent, {
				width: "500px",
				maxWidth: "95vw",
				data: session.exercises[exerciseIndex],
			})
			.afterClosed()
			.subscribe(exercise => {
				if (exercise.name != "") {
					session.exercises[exerciseIndex] = exercise;
				}
			});
	}
	async onSaveTrainingProgram() {
		// this.trainingProgram.name = this.trainingProgramName;
		// await this.firebase.addTrainingProgram(this.trainingProgram);
		// this.router.navigate(["/home/training-programs"]);
	}
}
