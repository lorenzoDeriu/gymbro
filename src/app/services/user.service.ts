import { FirebaseService } from "./firebase.service";
import { Exercise } from "../Models/Exercise.model";
import { Injectable, OnInit } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class UserService {
	exercises: any[] = [];
	trainingProgram: any[] = [];

	workoutSelected: any;

	constructor(private firebase: FirebaseService) {}

	addExercise(exercise: Exercise) {
		this.exercises.push({
			name: exercise.exerciseName,
			series: exercise.series,
			reps: exercise.reps,
			RPE: exercise.RPE,
			load: exercise.load,
			restTime: exercise.restTime,
			note: exercise.note,
			range: exercise.range,
		});

		localStorage.setItem("exercises", JSON.stringify(this.exercises));
	}

	exercisesReset() {
		this.exercises = [];
		localStorage.removeItem("exercises");
	}

	getExercises() {
		if (this.exercises.length == 0) {
			let exercises = JSON.parse(localStorage.getItem("exercises"));

			if (exercises != null) {
				this.exercises = exercises;
			}
		}

		return this.exercises;
	}

	removeElement(index: number) {
		this._remove(index);
		localStorage.setItem("exercises", JSON.stringify(this.exercises));
	}

	private _remove(element: number) {
		this.exercises.forEach((_, index) => {
			if (index == element) this.exercises.splice(index, 1);
		});
	}

	public updateWorkouts(workouts: any) {
		let user = JSON.parse(localStorage.getItem("user"));
		this.firebase.updateWorkouts(workouts, user.uid);

		return this.firebase.getWorkouts();
	}

	public addSessionToTrainingProgram(session: any) {
		this.trainingProgram.push(session);
	}

	public removeSessionFromTrianingProgram(index: number) {
		this.trainingProgram.splice(index, 1);
	}

	public async getTrainingProgram() {
		return this.trainingProgram;
	}

	public async removeTrainingProgram(index: number) {
		let user: any = JSON.parse(localStorage.getItem("user"));

		let trainingPrograms = await this.firebase.getTrainingPrograms();
		trainingPrograms.splice(index, 1);

		await this.firebase.updateTrainingPrograms(trainingPrograms, user.uid);
	}

	public setWorkoutSelected(workout: any) {
		this.workoutSelected = workout;
	}

	public getWorkoutSelected(): any {
		this.workoutSelected?.exercises?.forEach((exercise: any) => {
			if (!exercise.configurationType) {
				exercise.configurationType = "basic";
			}

			if (exercise.advanced == undefined) {
				exercise.advanced = {
					sets: [],
				};
			}

			if (exercise.configurationType === "advanced") {
				exercise.advanced?.sets?.forEach((set: any) => {
					if (set.load == undefined) {
						set.load = 0;
					}

					if (set.reps == undefined) {
						set.reps = set.min;
					}
				});
			}
		});

		return this.workoutSelected;
	}
}
