import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/services/firebase.service";
import { MatDialog } from "@angular/material/dialog";
import { NewExerciseDialogComponent } from "../new-exercise-dialog/new-exercise-dialog.component";
import { SafetyActionConfirmDialogComponent } from "../safety-action-confirm-dialog/safety-action-confirm-dialog.component";
import { Session, TrainingProgram } from "src/app/Models/TrainingProgram.model";

@Component({
	selector: "app-training-program-builder",
	templateUrl: "./training-program-builder.component.html",
	styleUrls: ["./training-program-builder.component.css"],
})
export class TrainingProgramBuilderComponent implements OnInit {
	public trainingProgram: TrainingProgram = {
		name: "",
		session: [],
	};

	private editMode = false;
	public loading = false;
	private index: number;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private firebase: FirebaseService,
		private dialog: MatDialog
	) {}

	async ngOnInit() {
		this.loading = true;

		if (this.route.snapshot.paramMap.get("id")) {
			this.index = parseInt(this.route.snapshot.paramMap.get("id"));
			this.trainingProgram = (await this.firebase.getTrainingPrograms())[
				this.index
			];
			this.editMode = true;
		}

		this.loading = false;
	}

	public savable() {
		return (
			this.trainingProgram.name !== "" &&
			this.trainingProgram.session.length > 0
		)
	}

	public onCancel() {
		this.router.navigate(["/home/training-programs"]);
	}

	public onNewSessionBuild() {
		this.router.navigate(["/home/session-builder"]);
	}

	public addExercise(session: Session) {
		this.dialog
			.open(NewExerciseDialogComponent, {
				disableClose: false,
			})
			.afterClosed()
			.subscribe(exercise => {
				if (exercise && exercise.name !== "") {
					session.exercises.push(exercise);
				}
			});
	}

	addSession() {
		this.trainingProgram = {
			...this.trainingProgram,
			session: [
				...this.trainingProgram.session,
				{ name: "Nuova sessione", exercises: [] },
			],
		};
	}

	deleteSessionDialog(index: number) {
		this.dialog.open(SafetyActionConfirmDialogComponent, {
			data: {
				title: "Elimina sessione",
				message: "Sei sicuro di voler eliminare questa sessione?",
				args: [index],
				confirm: async (index: number) => {
					this.deleteSession(index);
				},
			},
		});
	}

	deleteExerciseDialog(session: Session, index: number) {
		this.dialog.open(SafetyActionConfirmDialogComponent, {
			data: {
				title: "Elimina esercizio",
				message: "Sei sicuro di voler eliminare questo esercizio?",
				args: [session, index],
				confirm: async (session: Session, index: number) => {
					this.deleteExercise(session, index);
				},
			},
		});
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
				data: session.exercises[exerciseIndex],
			})
			.afterClosed()
			.subscribe(exercise => {
				if (exercise && exercise.name !== "") {
					session.exercises[exerciseIndex] = exercise;
				}
			});
	}

	async saveTrainingProgram() {
		if (this.editMode) {
			await this.firebase.editTrainingProgram(
				this.trainingProgram,
				this.index
			);
			this.router.navigate(["/home/training-programs"]);
		} else {
			await this.firebase.addTrainingProgram(this.trainingProgram);
			this.router.navigate(["/home/training-programs"]);
		}
	}
}
