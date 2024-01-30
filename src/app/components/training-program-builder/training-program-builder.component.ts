import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/services/firebase.service";
import { MatDialog } from "@angular/material/dialog";
import { NewExerciseDialogComponent } from "../new-exercise-dialog/new-exercise-dialog.component";
import { SafetyActionConfirmDialogComponent } from "../safety-action-confirm-dialog/safety-action-confirm-dialog.component";
import { Session, TrainingProgram } from "src/app/Models/TrainingProgram.model";
import { UserService } from "src/app/services/user.service";
import { formatSets } from "src/app/utils/utils";
import { Set } from "src/app/Models/Exercise.model";
import { NotesDialogComponent } from "../notes-dialog/notes-dialog.component";

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

	public editMode = false;
	public showExercises = true;
	public loading = false;
	private index: number;
	private timerID: any;
	private pressHoldDuration = 800;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private firebase: FirebaseService,
		private dialog: MatDialog,
		private userService: UserService
	) {}

	async ngOnInit() {
		this.loading = true;

		if (
			!localStorage.getItem("trainingProgram") &&
			this.route.snapshot.paramMap.get("id")
		) {
			this.index = parseInt(this.route.snapshot.paramMap.get("id"));

			this.trainingProgram = (await this.firebase.getTrainingPrograms())[
				this.index
			];
			this.userService.setTrainingProgram(this.trainingProgram);

			this.editMode = true;
		} else {
			this.trainingProgram = this.userService.getTrainingProgram();
		}

		this.loading = false;

		setTimeout(() => {
			this.enableDragAndDrop();
		}, 0);
	}

	private initializeComponent() {
		this.showExercises = false;

		setTimeout(() => {
			this.showExercises = true;
			setTimeout(() => {
				this.enableDragAndDrop();
			}, 0);
		});
	}

	private isIOSDevice() {
		return (
			navigator.userAgent.includes("iPhone") ||
			navigator.userAgent.includes("iPad") ||
			navigator.userAgent.includes("iPod") ||
			navigator.userAgent.includes("iPhone Simulator") ||
			navigator.userAgent.includes("iPad Simulator") ||
			navigator.userAgent.includes("iPod Simulator")
		);
	}

	private enableDragAndDrop() {
		const exercises = document.querySelectorAll(".trow");
		const sessionsList = document.querySelectorAll(".tbody");

		let dragStartingPosition: number = -1;
		let dragEndingPosition: number = -1;

		let dragStartSessionIndex: number = -1;
		let dragEndSessionIndex: number = -1;

		let startingSessionIndex: number = -1;

		exercises.forEach(exercise => {
			if (!this.isIOSDevice()) {
				exercise.addEventListener("dragstart", () => {
					const sessionID =
						exercise.parentElement.parentElement.parentElement
							.parentElement.id;
					const sessionIndex = parseInt(sessionID.at(-1));
					dragStartSessionIndex = sessionIndex;
					dragStartingPosition = Array.from(
						sessionsList[sessionIndex].children
					).indexOf(exercise);
					startingSessionIndex = sessionIndex;
					dragEndingPosition = dragStartingPosition;
					exercise.classList.add("dragging");
					localStorage.setItem("dragging", "true");
				});

				exercise.addEventListener("dragend", () => {
					exercise.classList.remove("dragging");

					if (dragStartSessionIndex !== dragEndSessionIndex) {
						dragEndingPosition =
							this.trainingProgram.session[dragEndSessionIndex]
								.exercises.length - 1;

						this.swapExercises(
							startingSessionIndex,
							dragStartingPosition,
							dragEndingPosition + 1
						);
						return;
					}

					const sessionID =
						exercise.parentElement.parentElement.parentElement
							.parentElement.id;
					const sessionIndex = parseInt(sessionID.at(-1));
					this.swapExercises(
						sessionIndex,
						dragStartingPosition,
						dragEndingPosition
					);
					localStorage.removeItem("dragging");
				});
			}

			// Compatibility with mobile devices
			if (this.isIOSDevice()) {
				exercise.addEventListener("touchstart", (e: any) => {
					localStorage.setItem("scrolling", "false");
					this.timerID = setTimeout(() => {
						if (localStorage.getItem("scrolling") === "true")
							return;

						const sessionID =
							exercise.parentElement.parentElement.parentElement
								.parentElement.id;
						const sessionIndex = parseInt(sessionID.at(-1));
						dragStartingPosition = Array.from(
							sessionsList[sessionIndex].children
						).indexOf(exercise);
						exercise.classList.add("dragging");
						localStorage.setItem("dragging", "true");
					}, this.pressHoldDuration);
				});
			}

			exercise.addEventListener("touchend", () => {
				if (this.timerID) clearTimeout(this.timerID);
				exercise.classList.remove("dragging");
				const sessionID =
					exercise.parentElement.parentElement.parentElement
						.parentElement.id;
				const sessionIndex = parseInt(sessionID.at(-1));
				if (localStorage.getItem("dragging") === "true") {
					this.swapExercises(
						sessionIndex,
						dragStartingPosition,
						dragEndingPosition
					);
				}
				localStorage.removeItem("dragging");
			});
		});

		Array.from(sessionsList).forEach(exercisesList => {
			exercisesList.addEventListener("dragover", (e: any) => {
				e.preventDefault();

				const afterElement: Element = this.getDragAfterElement(
					exercisesList,
					e.clientY
				);
				dragEndSessionIndex = parseInt(
					exercisesList.parentElement.parentElement.parentElement.id.at(
						-1
					)
				);

				const draggingExercise: Node =
					document.querySelector(".dragging");

				if (dragEndSessionIndex !== dragStartSessionIndex) {
					dragEndingPosition =
						Array.from(exercisesList.children).length - 1;
					(
						Array.from(sessionsList).at(
							startingSessionIndex
						) as Node
					).appendChild(draggingExercise);
					return;
				}

				if (!afterElement) {
					exercisesList.appendChild(draggingExercise);
					dragEndingPosition =
						Array.from(exercisesList.children).length - 1;
				} else {
					exercisesList.insertBefore(draggingExercise, afterElement);
					dragEndingPosition =
						Array.from(exercisesList.children).indexOf(
							afterElement
						) - 1;
				}
			});

			exercisesList.addEventListener("touchmove", (e: any) => {
				localStorage.setItem("scrolling", "true");
				if (localStorage.getItem("dragging") !== "true") return;

				e.preventDefault();

				const afterElement: Element = this.getDragAfterElement(
					exercisesList,
					e.touches[0].clientY
				);

				const draggingExercise: Node =
					document.querySelector(".dragging");

				if (!draggingExercise) return;

				if (!afterElement) {
					exercisesList.appendChild(draggingExercise);
					dragEndingPosition = exercises.length - 1;
				} else {
					exercisesList.insertBefore(draggingExercise, afterElement);
					dragEndingPosition =
						Array.from(exercisesList.children).indexOf(
							afterElement
						) - 1;
				}
			});
		});
	}

	private getDragAfterElement(container: any, y: number) {
		const draggableExercises = [
			...container.querySelectorAll(".trow:not(.dragging)"),
		];

		return draggableExercises.reduce(
			(closest: any, child: any) => {
				const box = child.getBoundingClientRect();

				const offset = y - box.top - box.height / 2;

				if (offset < 0 && offset > closest.offset) {
					return { offset: offset, element: child };
				} else {
					return closest;
				}
			},
			{ offset: Number.NEGATIVE_INFINITY }
		).element;
	}

	private swapExercises(
		sessionIndex: number,
		startingPosition: number,
		endingPosition: number
	) {
		const exercises = this.trainingProgram.session[sessionIndex].exercises;
		const exerciseToSwap = exercises[startingPosition];

		exercises.splice(startingPosition, 1);
		exercises.splice(endingPosition, 0, exerciseToSwap);

		this.trainingProgram.session[sessionIndex].exercises = exercises;
		this.userService.updateTrainingProgram(this.trainingProgram);

		this.initializeComponent();
	}

	showNotes(sessionIndex: number, exerciseIndex: number) {
		const session = this.trainingProgram.session[sessionIndex];
		const exercise = session.exercises[exerciseIndex];

		this.dialog.open(NotesDialogComponent, {
			data: { notes: exercise.note },
		});
	}

	formatSets(sets: Set[]) {
		return formatSets(sets);
	}

	public savable() {
		return (
			this.trainingProgram.name !== "" &&
			this.trainingProgram.session.length > 0
		);
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
					this.userService.updateTrainingProgram(
						this.trainingProgram
					);

					this.initializeComponent();
				}
			});
	}

	public addSession() {
		this.trainingProgram = {
			...this.trainingProgram,
			session: [
				...this.trainingProgram.session,
				{ name: "Nuova sessione", exercises: [] },
			],
		};

		this.userService.updateTrainingProgram(this.trainingProgram);

		this.initializeComponent();
	}

	public deleteSessionDialog(index: number) {
		this.dialog.open(SafetyActionConfirmDialogComponent, {
			data: {
				title: "Elimina sessione",
				message: "Sei sicuro di voler eliminare questa sessione?",
				args: [index],
				confirm: async (index: number) => {
					this.deleteSession(index);
					this.userService.updateTrainingProgram(
						this.trainingProgram
					);

					this.initializeComponent();
				},
			},
		});
	}

	public deleteExerciseDialog(session: Session, index: number) {
		this.dialog.open(SafetyActionConfirmDialogComponent, {
			data: {
				title: "Elimina esercizio",
				message: "Sei sicuro di voler eliminare questo esercizio?",
				args: [session, index],
				confirm: async (session: Session, index: number) => {
					this.deleteExercise(session, index);
					this.userService.updateTrainingProgram(
						this.trainingProgram
					);

					this.initializeComponent();
				},
			},
		});
	}

	private deleteSession(index: number) {
		this.trainingProgram.session.splice(index, 1);
		this.userService.updateTrainingProgram(this.trainingProgram);
	}

	private deleteExercise(session: Session, exerciseIndex: number) {
		session.exercises.splice(exerciseIndex, 1);
		this.userService.updateTrainingProgram(this.trainingProgram);
	}

	public editExercise(session: Session, exerciseIndex: number) {
		this.dialog
			.open(NewExerciseDialogComponent, {
				data: session.exercises[exerciseIndex],
			})
			.afterClosed()
			.subscribe(exercise => {
				if (exercise && exercise.name !== "") {
					session.exercises[exerciseIndex] = exercise;
					this.userService.updateTrainingProgram(
						this.trainingProgram
					);
				}
			});
	}

	public async saveTrainingProgram() {
		await this.userService.saveTrainingProgram(this.editMode, this.index);
		this.router.navigate(["/home/training-programs"]);
	}

	public cancel() {
		localStorage.removeItem("trainingProgram");
	}
}
