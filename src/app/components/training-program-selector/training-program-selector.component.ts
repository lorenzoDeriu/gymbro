import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/services/firebase.service";
import { NotesDialogComponent } from "../notes-dialog/notes-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
	selector: "app-training-program-selector",
	templateUrl: "./training-program-selector.component.html",
	styleUrls: ["./training-program-selector.component.css"],
})
export class TrainingProgramSelectorComponent implements OnInit {
	public loading: boolean;

	public trainingPrograms: any[];
	public displayedColumns: string[] = [
		"Esercizio",
		"Serie x Ripetizioni",
		"Recupero",
		"RPE",
	];

	constructor(
		private userService: UserService,
		private router: Router,
		private firebase: FirebaseService,
		private dialog: MatDialog
	) {}

	async ngOnInit() {
		this.loading = true;
		this.trainingPrograms = await this.firebase.getTrainingPrograms();
		this.loading = false;
	}

	public selectWorkout(programIndex: number, sessionIndex: number) {
		this.userService.setWorkoutSelected(
			this.trainingPrograms[programIndex].session[sessionIndex]
		);
		this.router.navigate(["/home/prebuild-workout"]);
	}

	cancel() {
		this.router.navigate(["/home"]);
	}

	focusCollapse(type: "program" | "session", index: number) {
		if (type === "program") {
			const collapsers: NodeListOf<Element> =
				document.querySelectorAll(".collapser");
			const collapses: NodeListOf<Element> =
				document.querySelectorAll(".collapse-body");

			for (let i = 0; i < collapsers.length; i++) {
				if (i !== index) {
					collapsers[i].classList.remove("collapsed");
					collapsers[i].setAttribute("aria-expanded", "false");
					collapses[i].classList.remove("show");
				}
			}
		}
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
