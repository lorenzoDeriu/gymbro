import { Exercise } from "../Models/Exercise.model";
import { TrainingProgram } from "../Models/TrainingProgram.model";
import { Workout } from "../Models/Workout.model";
import { FirebaseService } from "./firebase.service";
import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class UserService {
	public exercises: Exercise[] = [];
	public trainingProgram: TrainingProgram[] = [];
	public workoutSelected: Workout;

	constructor(private firebase: FirebaseService) {}


	private workoutSortingFunction(a: Workout, b: Workout) {
		let [day, month, year] = String(a.date).split("/");
		const dateA = +new Date(+year, +month - 1, +day);
		[day, month, year] = String(b.date).split("/");
		const dateB = +new Date(+year, +month - 1, +day);

		return dateB - dateA;
	}

	public updateWorkouts(workouts: Workout[]) {
		this.firebase.updateWorkouts(
			workouts.sort(this.workoutSortingFunction),
		);

		return this.firebase.getWorkouts();
	}

	public async updateWorkout(workout: Workout, index: number) {
		let workouts = (await this.firebase.getWorkouts()).sort(this.workoutSortingFunction);

		workouts[index] = workout;

		this.firebase.updateWorkouts(workouts);
	}

	public removeSessionFromTrianingProgram(index: number) {
		this.trainingProgram.splice(index, 1);
	}

	public async getTrainingProgram() {
		return this.trainingProgram;
	}

	public async removeTrainingProgram(index: number) {
		let trainingPrograms = await this.firebase.getTrainingPrograms();
		trainingPrograms.splice(index, 1);

		await this.firebase.updateTrainingPrograms(trainingPrograms);
	}

	public setWorkoutSelected(workout: Workout) {
		this.workoutSelected = workout;
	}

	public getWorkoutSelected(): Workout {
		return this.workoutSelected;
	}
}
