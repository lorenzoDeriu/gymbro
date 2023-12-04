import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/services/firebase.service";
import { MatDialog } from "@angular/material/dialog";
import { NotesDialogComponent } from "../notes-dialog/notes-dialog.component";
import { SafetyActionConfirmDialogComponent } from "src/app/components/safety-action-confirm-dialog/safety-action-confirm-dialog.component";
import { TrainingProgram } from "src/app/Models/TrainingProgram.model";
import { formatSets } from "src/app/utils/utils";
import { Set } from "src/app/Models/Exercise.model";

@Component({
	selector: "app-training-programs",
	templateUrl: "./training-programs.component.html",
	styleUrls: ["./training-programs.component.css"],
})
export class TrainingProgramsComponent implements OnInit {
	public loading: boolean;
	public trainingPrograms: TrainingProgram[] = [];

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
	}

	focusCollapse(type: "program" | "session", index: number) {
		if (type === "program") {
			const collapsers: NodeListOf<Element> =
				document.querySelectorAll(".collapser");
			const collapses: NodeListOf<Element> =
				document.querySelectorAll(".collapse-body");

			for (let i = 0; i < collapsers.length; i++) {
				if (i !== index) {
					collapsers[i]?.classList.remove("collapsed");
					collapsers[i]?.setAttribute("aria-expanded", "false");
					collapses[i]?.classList.remove("show");
				}
			}
		}
	}

	formatSets(sets: Set[]) {
		return formatSets(sets);
	}

	backToHomeButton() {
		this.router.navigate(["/home/dashboard"]);
	}

	buildTrainingProgramButton() {
		this.userService.resetTrainingProgram();
		this.router.navigate(["/home/training-program-builder"]);
	}

	editTrainingProgram(trainingProgramIndex: number) {
		this.router.navigate([
			"/home/training-program-builder",
			{ id: trainingProgramIndex },
		]);
	}

	async removeTrainingProgram(index: number) {
		this.dialog.open(SafetyActionConfirmDialogComponent, {
			data: {
				title: "Elimina scheda",
				message:
					"Sei sicuro di voler eliminare questo programma di allenamento?",
				args: [index, this.trainingPrograms, this.userService],
				confirm: async (
					index: number,
					trainingPrograms: TrainingProgram[],
					userService: UserService
				) => {
					trainingPrograms.splice(index, 1);
					await userService.removeTrainingProgram(index);
				},
			},
		});
	}

	showNotes(
		trainingProgramIndex: number,
		sessionIndex: number,
		exerciseIndex: number
	) {
		const trainingProgram = this.trainingPrograms[trainingProgramIndex];
		const session = trainingProgram.session[sessionIndex];
		const exercise = session.exercises[exerciseIndex];

		this.dialog.open(NotesDialogComponent, {
			data: { notes: exercise.note },
		});
	}
}
