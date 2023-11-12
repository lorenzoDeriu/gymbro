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
	private trainingProgram: TrainingProgram;

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
			date: Date.now(),
			exercises: [],
			trainingTime: 0,
		};

		this.trainingProgram = {
			name: "Nuovo Programma",
			session: [],
		};

		this.checkForBackup();
	}

	checkForBackup() {
		if (localStorage.getItem("workout") !== null) {
			this.workout = JSON.parse(localStorage.getItem("workout"));
		}

		if (localStorage.getItem("trainingProgram") !== null) {
			this.trainingProgram = JSON.parse(localStorage.getItem("trainingProgram"));
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
			date: Date.now(),
			exercises: [],
			trainingTime: 0,
		};
	}

	public getPlaylistURL() {
		return this.user?.playlistUrl ?? "";
	}

	private workoutSortingFunction(a: Workout, b: Workout) {
		return a.date - b.date;
	}

	public updateWorkouts(workouts: Workout[]) {
		this.firebase.updateWorkouts(
			workouts.sort(this.workoutSortingFunction)
		);

		return this.firebase.getWorkouts();
	}

	public getTrainingProgram() {
		return this.trainingProgram;
	}

	public async removeTrainingProgram(index: number) {
		let trainingPrograms = await this.firebase.getTrainingPrograms();
		trainingPrograms.splice(index, 1);

		await this.firebase.updateTrainingPrograms(trainingPrograms);
	}

	public setWorkout(workout: Workout) {
		this.workout = workout;
	}

	public setTrainingProgram(trainingProgram: TrainingProgram) {
		this.trainingProgram = trainingProgram;
	}

	public updateTrainingProgram(trainingProgram: TrainingProgram) {
		this.trainingProgram = trainingProgram;
		localStorage.setItem("trainingProgram", JSON.stringify(trainingProgram));
	}

	public saveTrainingProgram(edit: boolean, index?: number) {
		if (edit) {
			this.firebase.editTrainingProgram(this.trainingProgram, index);
			return;
		}

		this.firebase.addTrainingProgram(this.trainingProgram);
	}
}
