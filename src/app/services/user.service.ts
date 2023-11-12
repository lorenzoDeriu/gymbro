import { BehaviorSubject } from "rxjs";
import { Exercise } from "../Models/Exercise.model";
import { TrainingProgram } from "../Models/TrainingProgram.model";
import { Workout } from "../Models/Workout.model";
import { FirebaseService } from "./firebase.service";
import { Injectable } from "@angular/core";
import { User } from "../Models/User.model";

@Injectable({
	providedIn: "root",
})
export class UserService {
	private user: User;
	private workout: Workout;

	// old
	public trainingProgram: TrainingProgram[] = [];
	public workoutSelected: Workout;

	/* private stopwatchTime: BehaviorSubject<Date | undefined> = new BehaviorSubject<Date | undefined>(localStorage.getItem('startTime')!! ? new Date(localStorage.getItem('startTime')) : undefined);
	public stopwatchTimeObs = this.stopwatchTime.asObservable(); */
	/* 	public setStopwatchTime(time: Date | undefined) {
		this.stopwatchTime.next(time);
		localStorage.setItem('startTime', String(time));
	} */

	constructor(private firebase: FirebaseService) {
		this.firebase.getUserData().then(user => {
			this.user = user;
		});

		this.workout = {
			name: "Nuovo Allenamento",
			date: new Date(Date.now()),
			exercises: [],
			trainingTime: 0,
		};
	}

	checkForBackup() {
		if (localStorage.getItem("workout") != null) {
			this.workout = JSON.parse(localStorage.getItem("workout")!!);
		}
	}

	public getWorkout() {
		return this.workout;
	}

	public async updateWorkout(workout: Workout) {
		this.workout = workout;
	}

	public async saveWorkout() {
		await this.firebase.saveWorkout(this.workout);
		this.cancelWorkout();
	}

	public cancelWorkout() {
		this.workout = {
			name: "Nuovo Allenamento",
			date: new Date(),
			exercises: [],
			trainingTime: 0,
		};
	}

	public getPlaylistURL() {
		return this.user?.playlistUrl ?? "";
	}

	private workoutSortingFunction(a: Workout, b: Workout) {
		let [day, month, year] = String(a.date).split("/");
		const dateA = +new Date(+year, +month - 1, +day);
		[day, month, year] = String(b.date).split("/");
		const dateB = +new Date(+year, +month - 1, +day);

		return dateB - dateA;
	}

	public updateWorkouts(workouts: Workout[]) {
		this.firebase.updateWorkouts(
			workouts.sort(this.workoutSortingFunction)
		);

		return this.firebase.getWorkouts();
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
