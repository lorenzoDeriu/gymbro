import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/services/firebase.service";
import { MatDialog } from "@angular/material/dialog";
import { NotesDialogComponent } from "../notes-dialog/notes-dialog.component";
import { SafetyActionConfirmDialogComponent } from "src/app/safety-action-confirm-dialog/safety-action-confirm-dialog.component";

@Component({
	selector: "app-training-programs",
	templateUrl: "./training-programs.component.html",
	styleUrls: ["./training-programs.component.css"],
})
export class TrainingProgramsComponent implements OnInit {
	loading: boolean;
	trainingPrograms: any[] = [];

	displayedColumns: string[] = [
		"Esercizio",
		"Serie x Ripetizioni",
		"Recupero",
		"RPE",
	];

	constructor(
		private router: Router,
		private userService: UserService,
		private firebase: FirebaseService,
		private dialog: MatDialog
	) {}

	async ngOnInit() {
		this.loading = true;
		this.trainingPrograms = await this.firebase.getTrainingPrograms();
		this.loading = false;

		console.log(this.trainingPrograms);
	}

	backToHomeButton() {
		this.router.navigate(["/home/dashboard"]);
	}

	buildTrainingProgramButton() {
		this.router.navigate(["/home/training-program-builder"]);
	}

	editTrainingProgram(trainingProgramIndex: number) {
		this.router.navigate(["/home/training-program-builder"]);

		localStorage.setItem(
			"trainingProgramToEdit",
			JSON.stringify({ index: trainingProgramIndex })
		);
	}

	async removeTrainingProgram(index: number) {
		this.dialog.open(SafetyActionConfirmDialogComponent, {
			data: {
				title: "Elimina programma di allenamento",
				message:
					"Sei sicuro di voler eliminare questo programma di allenamento?",
				args: [index, this.trainingPrograms, this.userService],
				confirm: async (
					index: number,
					trainingPrograms: any,
					userService: any
				) => {
					trainingPrograms.splice(index, 1);
					await userService.updateTrainingPrograms(trainingPrograms);
				}
			},
		});
	}

	showNotes(
		trainingProgramIndex: number,
		sessionIndex: number,
		exerciseIndex: number
	) {
		this.dialog.open(NotesDialogComponent, {
			width: "300px",
			data: {
				notes: this.trainingPrograms[trainingProgramIndex]["session"][
					sessionIndex
				]["exercises"][exerciseIndex]["note"],
			},
		});
	}
}
