import { TrainingProgram } from "../Models/TrainingProgram.model";
import { Workout } from "../Models/Workout.model";
import { FirebaseService } from "./firebase.service";
import { Injectable } from "@angular/core";
import { User } from "../Models/User.model";
import { SearchResult } from "../components/friends/friends.component";

@Injectable({
	providedIn: "root",
})
export class UserService {
	private user: User;
	private workout: Workout;
	private trainingProgram: TrainingProgram;

	private searchResult: SearchResult[];
	private uidProfile: string;

	private editMode: boolean = false;
	private workoutToEditIndex: number;

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

	private checkForBackup() {
		if (localStorage.getItem("workout") !== null) {
			this.workout = JSON.parse(localStorage.getItem("workout"));
		}

		if (localStorage.getItem("trainingProgram") !== null) {
			this.trainingProgram = JSON.parse(
				localStorage.getItem("trainingProgram")
			);
		}

		if (localStorage.getItem("editMode") !== null) {
			this.editMode = JSON.parse(localStorage.getItem("editMode"));
		}

		if (localStorage.getItem("workoutToEditIndex") !== null) {
			this.workoutToEditIndex = JSON.parse(
				localStorage.getItem("workoutToEditIndex")
			);
		}
	}

	public getWorkout() {
		localStorage.setItem("workout", JSON.stringify(this.workout));
		return this.workout;
	}

	public async updateWorkout(workout: Workout) {
		this.workout = workout;
		localStorage.setItem("workout", JSON.stringify(workout));
	}

	public async saveWorkout() {
		if (this.editMode) {
			await this.firebase.updateWorkout(
				this.workout,
				this.workoutToEditIndex
			);
			this.setEditMode(false);
			this.resetWorkout();
			return;
		}

		await this.firebase.saveWorkout(this.workout);
		this.resetWorkout();
	}

	public resetWorkout() {
		this.workout = {
			name: "Nuovo Allenamento",
			date: Date.now(),
			exercises: [],
			trainingTime: 0,
		};
		localStorage.removeItem("workout");
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
		localStorage.setItem(
			"trainingProgram",
			JSON.stringify(trainingProgram)
		);
	}

	public saveTrainingProgram(edit: boolean, index?: number) {
		localStorage.removeItem("trainingProgram");
		if (edit) {
			this.firebase.editTrainingProgram(this.trainingProgram, index);
			return;
		}

		this.firebase.addTrainingProgram(this.trainingProgram);
	}

	public setSearchResult(searchResult: SearchResult[]) {
		this.searchResult = searchResult;
	}

	public getSearchResult() {
		return this.searchResult ?? [];
	}

	public setUidProfile(uidProfile: string) {
		this.uidProfile = uidProfile;
	}

	public getUidProfile() {
		return this.uidProfile;
	}

	public setEditMode(editMode: boolean) {
		this.editMode = editMode;
		localStorage.setItem("editMode", String(editMode));
	}

	public getEditMode() {
		return this.editMode;
	}

	public setWorkoutToEditIndex(index: number) {
		this.workoutToEditIndex = index;
		localStorage.setItem("workoutToEditIndex", String(index));
	}

	public getWorkoutToEditIndex() {
		return this.workoutToEditIndex;
	}
}
