import { TrainingProgram } from "../Models/TrainingProgram.model";
import { Workout } from "../Models/Workout.model";
import { FirebaseService } from "./firebase.service";
import { Injectable } from "@angular/core";
import { User } from "../Models/User.model";
import { SearchResult } from "../components/friends/friends.component";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
	providedIn: "root",
})
export class UserService {
	private user: User;
	private workout: Workout;
	private trainingProgram: TrainingProgram;

	private searchResult: SearchResult[];
	private uidProfile: string;

	private workoutToEditIndex: number;

	private editMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
		false
	);
	public editModeObs = this.editMode.asObservable();

	private restMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
		false
	);
	public restModeObs = this.restMode.asObservable();

	private workoutStartTime: number = 0;
	private restStartTime: number = 0;
	private trainingTime: number = 0;
	private timeToRest: number = 0;
	private restTime: number = 0;

	private interval: any;

	private workoutPrevision: Promise<Workout>;

	constructor(private firebase: FirebaseService, private router: Router) {
		this.firebase
			.getUserData()
			.then(user => {
				this.user = user;
			})
			.catch(() => {
				this.user = null;
			});

		this.workout = {
			name: "Nuovo Allenamento",
			date: Date.now(),
			exercises: [],
			trainingTime: 0,
		};

		this.trainingProgram = {
			name: "Nuovo Scheda",
			session: [],
		};

		this.checkForBackup();
		this.workoutPrevision = this.makeWorkoutPrevision();
	}

	public async makeWorkoutPrevision(): Promise<Workout> {
		const workouts = await this.firebase.getWorkouts();

		if (workouts.length === 0) {
			return null;
		}

		if (
			new Date(workouts[0].date).toISOString().slice(0, 10) ===
			new Date(Date.now()).toISOString().slice(0, 10)
		) {
			return null;
		}

		// get the workout from one week ago
		const oneWeek = 7 * 24 * 60 * 60 * 1000;
		const workout = workouts.find(
			w =>
				new Date(w.date).toISOString().slice(0, 10) ===
				new Date(Date.now() - oneWeek).toISOString().slice(0, 10)
		);

		return workout;
	}

	public getWorkoutPrevision(): Promise<Workout> {
		return this.workoutPrevision;
	}

	public reuseWorkout(workout: Workout) {
		this.workout = workout;

		this.workout.exercises.forEach(exercise => {
			delete exercise.template;
		});

		this.workout.date = Date.now();
		this.workout.trainingTime = 0;

		localStorage.setItem("workout", JSON.stringify(workout));
		this.startChronometer();
		this.router.navigate(["/home/prebuild-workout"]);
	}

	public setupUser() {
		this.firebase
			.getUserData()
			.then(user => {
				this.user = user;
			})
			.catch(() => {
				this.user = null;
			});
	}

	public startChronometer() {
		this.workoutStartTime = Date.now();
		localStorage.setItem("workoutStartTime", String(this.workoutStartTime));
		this.interval = setInterval(() => {
			this.trainingTime = Date.now() - this.workoutStartTime;
			this.restTime = this.restStartTime + this.timeToRest - Date.now();

			if (this.restMode.value && this.restTime <= 0) {
				this.endRest();
			}
		});
	}

	public startTimer(time: number) {
		this.setRestMode(true);
		this.restStartTime = Date.now();
		localStorage.setItem("restStartTime", String(this.restStartTime));
		this.timeToRest = time;
		localStorage.setItem("timeToRest", String(this.timeToRest));
	}

	public getChronometerTime() {
		if (this.restMode.value) {
			return this.restTime;
		}

		return this.trainingTime;
	}

	public endChronometer() {
		clearInterval(this.interval);
		localStorage.removeItem("workoutStartTime");
	}

	public endRest() {
		this.setRestMode(false);
		localStorage.removeItem("restStartTime");
		localStorage.removeItem("timeToRest");
		localStorage.removeItem("restMode");
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
			this.setEditMode(JSON.parse(localStorage.getItem("editMode")));
		}

		if (localStorage.getItem("workoutToEditIndex") !== null) {
			this.workoutToEditIndex = JSON.parse(
				localStorage.getItem("workoutToEditIndex")
			);
		}

		if (localStorage.getItem("restMode") !== null) {
			this.setRestMode(JSON.parse(localStorage.getItem("restMode")));
		}

		if (localStorage.getItem("workoutStartTime") !== null) {
			this.workoutStartTime = JSON.parse(
				localStorage.getItem("workoutStartTime")
			);

			this.interval = setInterval(() => {
				this.trainingTime = Date.now() - this.workoutStartTime;
				this.restTime =
					this.restStartTime + this.timeToRest - Date.now();

				if (this.restMode.value && this.restTime <= 0) {
					this.endRest();
				}
			});
		}

		if (localStorage.getItem("restStartTime") !== null) {
			this.restStartTime = JSON.parse(
				localStorage.getItem("restStartTime")
			);
		}

		if (localStorage.getItem("timeToRest") !== null) {
			this.timeToRest = JSON.parse(localStorage.getItem("timeToRest"));
		}
	}

	public getTrainingTime() {
		return this.trainingTime;
	}

	public getWorkout() {
		localStorage.setItem("workout", JSON.stringify(this.workout));
		return this.workout;
	}

	public updateWorkout(workout: Workout) {
		this.workout = workout;
		localStorage.setItem("workout", JSON.stringify(workout));
	}

	public async saveWorkout() {
		if (!this.workout.date) {
			this.workout.date = Date.now();
		}

		if (this.editMode.value) {
			await this.firebase.updateWorkout(
				this.workout,
				this.workoutToEditIndex
			);
			this.setEditMode(false);
			this.resetWorkout();
			return;
		}

		await this.firebase.saveWorkout(this.workout);
		this.workoutPrevision = this.makeWorkoutPrevision();
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
		localStorage.removeItem("workoutTemplate");
		localStorage.removeItem("workoutProgress");
		localStorage.removeItem("workoutCompleteTime");
		this.setEditMode(false);
		localStorage.removeItem("editMode");
		this.setRestMode(false);
		localStorage.removeItem("restMode");
		localStorage.removeItem("workoutToEditIndex");
		localStorage.removeItem("scrolling");
	}

	public getPlaylistURL() {
		return this.user?.playlistUrl ?? "";
	}

	private workoutSortingFunction(a: Workout, b: Workout) {
		return b.date - a.date;
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

	public resetTrainingProgram() {
		this.trainingProgram = {
			name: "Nuova Scheda",
			session: [],
		};
		localStorage.removeItem("trainingProgram");
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

	public async saveTrainingProgram(edit: boolean, index?: number) {
		localStorage.removeItem("trainingProgram");
		if (edit) {
			await this.firebase.editTrainingProgram(
				this.trainingProgram,
				index
			);
			return;
		}

		await this.firebase.addTrainingProgram(this.trainingProgram);
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
		this.editMode.next(editMode);
		localStorage.setItem("editMode", String(editMode));
	}

	public setRestMode(restMode: boolean) {
		this.restMode.next(restMode);
		localStorage.setItem("restMode", String(restMode));
	}

	public setWorkoutToEditIndex(index: number) {
		this.workoutToEditIndex = index;
		localStorage.setItem("workoutToEditIndex", String(index));
	}

	public getWorkoutToEditIndex() {
		return this.workoutToEditIndex;
	}
}
