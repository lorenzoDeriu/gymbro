import { MatDialog } from "@angular/material/dialog";
import { FirebaseService } from "src/app/services/firebase.service";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { Component, OnInit } from "@angular/core";
import { ExerciseStatsDialogComponent } from "../exercise-stats-dialog/exercise-stats-dialog.component";
import { AddExerciseDialogComponent } from "../add-exercise-dialog/add-exercise-dialog.component";
import { SafetyActionConfirmDialogComponent } from "src/app/components/safety-action-confirm-dialog/safety-action-confirm-dialog.component";
import { Workout } from "src/app/Models/Workout.model";
import { EffectiveSet } from "src/app/Models/Exercise.model";
import { generateId } from "src/app/utils/utils";
import { ShowExerciseFromTemplateDialogComponent } from "../show-exercise-from-template-dialog/show-exercise-from-template-dialog.component";
import { WorkoutNotSavedDialogComponent } from "../workout-not-saved-dialog/workout-not-saved-dialog.component";

export interface Progress {
	/* access to the complete must refer to the following logic:
	 *	-> completed[exerciseIndex][setIndex]: boolean
	 */
	completed: boolean[][];
}

@Component({
	selector: "app-prebuild-workout",
	templateUrl: "./prebuild-workout.component.html",
	styleUrls: ["./prebuild-workout.component.css"],
})
export class PrebuildWorkoutComponent implements OnInit {
	public availableExercise: string[] = [];
	public workout: Workout;
	public workoutProgress: Progress = { completed: [] };
	public date: string = this.fromTimestampToString(Date.now());
	public loading: boolean = false;
	public editMode: boolean = false;
	public restMode: boolean = false;

	private timerID: any;
	private pressHoldDuration: number = 800;

	constructor(
		private userService: UserService,
		private router: Router,
		private firebase: FirebaseService,
		private dialog: MatDialog
	) {}

	async ngOnInit() {
		this.loading = true;

		this.userService.editModeObs.subscribe(editMode => {
			this.editMode = editMode;
		});

		this.userService.restModeObs.subscribe(restMode => {
			this.restMode = restMode;
		});

		this.availableExercise = await this.firebase.getExercise();

		this.workout = this.userService.getWorkout();
		this.date = this.fromTimestampToString(this.workout.date);
		this.initWorkoutProgress();

		// Check if 50 minutes have passed since the workout is completed
		const workoutStartTime: number = JSON.parse(
			localStorage.getItem("workoutStartTime")
		);
		const workoutCompleteTime: number = JSON.parse(
			localStorage.getItem("workoutCompleteTime")
		);

		if (
			workoutStartTime &&
			workoutCompleteTime &&
			Date.now() - workoutCompleteTime > 300000
		) {
			this.dialog.open(WorkoutNotSavedDialogComponent, {
				data: {
					trainingTime: workoutCompleteTime - workoutStartTime,
					confirm: () => {
						this.saveWorkout(
							workoutCompleteTime - workoutStartTime
						);
					},
					cancel: () => {
						localStorage.removeItem("workoutCompleteTime");
					},
				},
				disableClose: true,
			});
		}

		this.loading = false;

		setTimeout(() => {
			this.enableDragAndDrop();
		}, 0);
	}

	private isIOSDevice() {
		console.log(
			(navigator.userAgent.includes("iPhone") ||
			navigator.userAgent.includes("iPad") ||
			navigator.userAgent.includes("iPod") ||
			navigator.userAgent.includes("iPhone Simulator") ||
			navigator.userAgent.includes("iPad Simulator") ||
			navigator.userAgent.includes("iPod Simulator"))
		);
		return (
			(navigator.userAgent.includes("iPhone") ||
			navigator.userAgent.includes("iPad") ||
			navigator.userAgent.includes("iPod") ||
			navigator.userAgent.includes("iPhone Simulator") ||
			navigator.userAgent.includes("iPad Simulator") ||
			navigator.userAgent.includes("iPod Simulator"))
		);
	}

	private collapseAll() {
		const collapsers: NodeListOf<Element> =
			document.querySelectorAll(".collapser");
		const collapses: NodeListOf<Element> =
			document.querySelectorAll(".collapse-body");

		for (let i = 0; i < collapsers.length; i++) {
			collapsers[i]?.classList.remove("collapsed");
			collapsers[i]?.setAttribute("aria-expanded", "false");
			collapses[i]?.classList.remove("show");
		}
	}

	private enableDragAndDrop() {
		const exercisesList: Element = document.querySelector(".exercises");
		const exercises: NodeListOf<Element> =
			document.querySelectorAll(".exercise");

		let dragStartingPosition: number = -1;
		let dragEndingPosition: number = -1;

		exercises.forEach(exercise => {
			if (!this.isIOSDevice()) {
				exercise.addEventListener("dragstart", () => {
					console.log("dragstart", exercise);
					dragStartingPosition = Array.from(
						exercisesList.children
					).indexOf(exercise);
					dragEndingPosition = dragStartingPosition;
					exercise.classList.add("dragging");
					localStorage.setItem("dragging", "true");
					this.collapseAll();
				});

				exercise.addEventListener("dragend", () => {
					exercise.classList.remove("dragging");
					this.swapExercises(dragStartingPosition, dragEndingPosition);
				});
			}


			if (this.isIOSDevice()) {
				exercise.addEventListener("touchstart", () => {
					localStorage.setItem("scrolling", "false");
					this.timerID = setTimeout(() => {
						if (localStorage.getItem("scrolling") === "true") return;

						dragStartingPosition = Array.from(
							exercisesList.children
						).indexOf(exercise);
						exercise.classList.add("dragging");
						localStorage.setItem("dragging", "true");
						this.collapseAll();
					}, this.pressHoldDuration);
				});
			}

			exercise.addEventListener("touchend", () => {
				if (this.timerID) clearTimeout(this.timerID);
				exercise.classList.remove("dragging");
				console.log(localStorage.getItem("dragging"))
				if (localStorage.getItem("dragging") === "true") {
					this.swapExercises(
						dragStartingPosition,
						dragEndingPosition
					);
				}
				localStorage.removeItem("dragging");
			});
		});

		exercisesList.addEventListener("dragover", (e: any) => {
			e.preventDefault();

			const afterElement: Element = this.getDragAfterElement(
				exercisesList,
				e.clientY
			);
			const draggingExercise: Node = document.querySelector(".dragging");

			if (!afterElement) {
				exercisesList.appendChild(draggingExercise);
				dragEndingPosition = exercises.length - 1;
			} else {
				exercisesList.insertBefore(draggingExercise, afterElement);
				dragEndingPosition =
					Array.from(exercisesList.children).indexOf(afterElement) -
					1;
			}
		});

		exercisesList.addEventListener("touchmove", (e: any) => {
			localStorage.setItem("scrolling", "true");
			if (localStorage.getItem("dragging") !== "true") return;

			const afterElement: Element = this.getDragAfterElement(
				exercisesList,
				e.touches[0].clientY
			);

			const draggingExercise: Node = document.querySelector(".dragging");

			if (!draggingExercise) return;

			if (!afterElement) {
				exercisesList.appendChild(draggingExercise);
				dragEndingPosition = exercises.length - 1;
			} else {
				exercisesList.insertBefore(draggingExercise, afterElement);
				dragEndingPosition =
					Array.from(exercisesList.children).indexOf(afterElement) -
					1;
			}
		});
	}

	private getDragAfterElement(container: any, y: number) {
		const draggableExercises = [
			...container.querySelectorAll(".exercise:not(.dragging)"),
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

	private swapExercises(startingPosition: number, endingPosition: number) {
		const exerciseToSwap = this.workout.exercises[startingPosition];
		this.workout.exercises.splice(startingPosition, 1);
		this.workout.exercises.splice(endingPosition, 0, exerciseToSwap);

		const progressToSwap = this.workoutProgress.completed[startingPosition];
		this.workoutProgress.completed.splice(startingPosition, 1);
		this.workoutProgress.completed.splice(
			endingPosition,
			0,
			progressToSwap
		);

		localStorage.setItem(
			"workoutProgress",
			JSON.stringify(this.workoutProgress)
		);

		this.userService.updateWorkout(this.workout);
	}

	private initWorkoutProgress() {
		if (localStorage.getItem("workoutProgress")) {
			this.workoutProgress = JSON.parse(
				localStorage.getItem("workoutProgress")
			);

			localStorage.setItem(
				"workoutProgress",
				JSON.stringify(this.workoutProgress)
			);
		} else {
			this.workout.exercises.forEach((exercise, exerciseIndex) => {
				this.workoutProgress.completed[exerciseIndex] = [];

				exercise.set.forEach((_, setIndex) => {
					this.workoutProgress.completed[exerciseIndex][setIndex] =
						false;
				});
			});

			localStorage.setItem(
				"workoutProgress",
				JSON.stringify(this.workoutProgress)
			);
		}
	}

	public showTrainingProgram() {
		this.dialog.open(ShowExerciseFromTemplateDialogComponent, {
			data: {
				workout: JSON.parse(
					localStorage.getItem("workoutTemplate")
				) as Workout,
			},
			disableClose: false,
		});
	}

	public workoutHasTemplate() {
		return this.workout.exercises.some(exercise => exercise.template);
	}

	public pickDate() {
		const datePicker = document.getElementById(
			"date-picker"
		) as HTMLInputElement;
		datePicker.showPicker();
	}

	public workoutExists() {
		return localStorage.getItem("workout") !== null;
	}

	public savable(): boolean {
		return (
			this.workout.name !== "" &&
			this.workout.exercises.length !== 0 &&
			this.workoutProgress.completed.every(exercise =>
				exercise.every(setCompleted => setCompleted)
			)
		);
	}

	public saveWorkout(trainingTime?: number) {
		this.workout.date = this.fromStringToTimestamp(this.date);
		if (!this.editMode && !trainingTime)
			this.workout.trainingTime = this.userService.getTrainingTime();

		if (trainingTime) this.workout.trainingTime = trainingTime;

		this.userService.endChronometer();
		this.userService.endRest();
		this.userService.updateWorkout(this.workout);
		this.userService.saveWorkout();

		localStorage.removeItem("workoutProgress");
		localStorage.removeItem("workoutCompleteTime");
		this.router.navigate(["/home"]);
	}

	public isSetValid(exerciseIndex: number, setIndex: number) {
		return (
			!isNaN(+this.workout.exercises[exerciseIndex].set[setIndex].reps) &&
			this.workout.exercises[exerciseIndex].set[setIndex].reps !== null &&
			this.workout.exercises[exerciseIndex].set[setIndex].reps > 0 &&
			!isNaN(
				+this.workout.exercises[exerciseIndex].set[setIndex].load
					?.toString()
					?.replace(",", ".")
			) &&
			this.workout.exercises[exerciseIndex].set[setIndex].load !== null &&
			this.workout.exercises[exerciseIndex].set[setIndex].load >= 0
		);
	}

	public filterInput(
		event: Event,
		exerciseIndex: number,
		setIndex: number,
		type: string
	) {
		const e: InputEvent = event as InputEvent;

		const input: string = (e.target as HTMLInputElement).value;

		if ((e.data === "," || e.data === ".") && type === "reps") {
			(e.target as HTMLInputElement).value = input
				.replace(",", "")
				.replace(".", "");
		}

		if (e.data === "0" && +input === 0) {
			(e.target as HTMLInputElement).value = "0";
			return;
		}

		if (input === "") {
			if (type === "load") {
				this.workout.exercises[exerciseIndex].set[setIndex].load = 0;
			} else {
				this.workout.exercises[exerciseIndex].set[setIndex].reps = 0;
			}
			(e.target as HTMLInputElement).value = "0";
			return;
		}

		const value: number =
			type === "load"
				? +input.replace(",", ".")
				: +input.replace(",", "").replace(".", "");

		if (isNaN(value)) {
			(e.target as HTMLInputElement).value =
				type === "load"
					? this.workout.exercises[exerciseIndex].set[
							setIndex
					  ].load.toString()
					: this.workout.exercises[exerciseIndex].set[
							setIndex
					  ].reps.toString();
			return;
		}

		if (type === "load") {
			this.workout.exercises[exerciseIndex].set[setIndex].load = value;
		} else {
			this.workout.exercises[exerciseIndex].set[setIndex].reps = value;
		}
	}

	public toggleCompleted(exerciseIndex: number, setIndex: number) {
		if (
			!this.workoutProgress.completed[exerciseIndex][setIndex] &&
			!this.restMode
		) {
			const { minutes, seconds }: Record<string, string> =
				this.workout.exercises[exerciseIndex].rest; // Extract rest time from workout

			const rest: number = (+minutes * 60 + +seconds) * 1000; // Convert rest time to milliseconds

			this.userService.startTimer(rest);
		}

		this.workoutProgress.completed[exerciseIndex][setIndex] =
			!this.workoutProgress.completed[exerciseIndex][setIndex];

		localStorage.setItem(
			"workoutProgress",
			JSON.stringify(this.workoutProgress)
		);

		if (
			this.workoutProgress.completed.every(exercise =>
				exercise.every(setCompleted => setCompleted)
			)
		) {
			localStorage.setItem(
				"workoutCompleteTime",
				JSON.stringify(Date.now())
			);
		}

		this.userService.updateWorkout(this.workout);
	}

	public addExercise() {
		this.workout.exercises.push({
			name: "Nuovo Esercizio",
			intensity: "hard",
			rest: {
				minutes: "02",
				seconds: "00",
			},
			note: "",
			set: [],
			groupId: generateId(),
		});

		this.userService.updateWorkout(this.workout);
		this.workoutProgress.completed.push([]);

		localStorage.setItem(
			"workoutProgress",
			JSON.stringify(this.workoutProgress)
		);

		setTimeout(() => {
			this.enableDragAndDrop();
		}, 0);
	}

	public onCancel() {
		this.dialog.open(SafetyActionConfirmDialogComponent, {
			data: {
				title: this.editMode
					? "Annulla modifica"
					: "Annulla allenamento",
				message: this.editMode
					? "Sei sicuro di voler annullare la modifica dell'allenamento?"
					: "Sei sicuro di voler annullare l'allenamento?",
				args: [],
				confirm: () => {
					this.userService.resetWorkout();
					this.userService.endChronometer();
					this.userService.endRest();
					this.router.navigate(["/home"]);
				},
			},
		});
	}

	public openCustomExerciseDialog(exercise: number) {
		this.dialog
			.open(AddExerciseDialogComponent, {
				disableClose: false,
			})
			.afterClosed()
			.subscribe(async customExercise => {
				if (customExercise === undefined || customExercise === "")
					return;

				this.workout.exercises[exercise].name = customExercise;
				this.userService.updateWorkout(this.workout);

				this.availableExercise = await this.firebase.getExercise();
			});
	}

	public deleteSet(exerciseIndex: number, setIndex: number) {
		this.workout.exercises[exerciseIndex].set.splice(setIndex, 1);
		this.userService.updateWorkout(this.workout);

		this.workoutProgress.completed[exerciseIndex].splice(setIndex, 1);

		localStorage.setItem(
			"workoutProgress",
			JSON.stringify(this.workoutProgress)
		);
	}

	public addSet(exerciseIndex: number) {
		if (this.workout.exercises[exerciseIndex].set.length > 0) {
			const lastSet: EffectiveSet =
				this.workout.exercises[exerciseIndex].set[
					this.workout.exercises[exerciseIndex].set.length - 1
				];

			this.workout.exercises[exerciseIndex].set.push({
				reps: lastSet.reps,
				load: lastSet.load,
			});
		} else {
			this.workout.exercises[exerciseIndex].set.push({
				reps: 8,
				load: 0,
			});
		}

		this.userService.updateWorkout(this.workout);
		this.workoutProgress.completed[exerciseIndex].push(false);

		localStorage.setItem(
			"workoutProgress",
			JSON.stringify(this.workoutProgress)
		);
	}

	public showOldStats(exerciseIndex: number) {
		this.dialog.open(ExerciseStatsDialogComponent, {
			data: {
				exerciseName: this.workout.exercises[exerciseIndex].name,
			},
			disableClose: false,
		});
	}

	public delete(exerciseIndex: number) {
		this.dialog.open(SafetyActionConfirmDialogComponent, {
			data: {
				title: "Elimina esercizio",
				message: "Sei sicuro di voler eliminare questo esercizio?",
				args: [this.workout, exerciseIndex],
				confirm: (workout: Workout, index: number) => {
					workout.exercises.splice(index, 1);
					this.userService.updateWorkout(this.workout);

					this.workoutProgress.completed.splice(index, 1);

					localStorage.setItem(
						"workoutProgress",
						JSON.stringify(this.workoutProgress)
					);

					setTimeout(() => {
						this.enableDragAndDrop();
					}, 0);
				},
			},
		});
	}

	private fromStringToTimestamp(date: string): number {
		return Date.parse(date);
	}

	private fromTimestampToString(date: number): string {
		const d = new Date(date);
		return `${d.getFullYear()}-${
			d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
		}-${d.getDate() < 10 ? "0" + d.getDate() : d.getDate()}`;
	}
}
