import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

import { initializeApp } from "firebase/app";
import "firebase/firestore";
import {
	setDoc,
	doc,
	updateDoc,
	query,
	where,
	getDocs,
	collection,
	DocumentSnapshot,
	limit,
	addDoc,
	deleteDoc,
	initializeFirestore,
	CACHE_SIZE_UNLIMITED,
	enableIndexedDbPersistence,
	getDocFromCache,
	DocumentReference,
	getDoc,
	getDocsFromCache,
	WithFieldValue,
	DocumentData,
} from "firebase/firestore";
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	GoogleAuthProvider,
	sendEmailVerification,
	sendPasswordResetEmail,
	Auth,
	signInWithPopup,
	FacebookAuthProvider,
	TwitterAuthProvider,
	UserCredential,
} from "firebase/auth";
import { Router } from "@angular/router";
import { User } from "../Models/User.model";
import { Session, TrainingProgram } from "../Models/TrainingProgram.model";
import {
	EffectiveExercise,
	EffectiveSet,
	IntensityType,
	Set,
	TrainingProgramExercises,
} from "../Models/Exercise.model";
import { Workout } from "../Models/Workout.model";
import { Feedback } from "../Models/Feedback.model";
import { duration } from "moment";

@Injectable({
	providedIn: "root",
})
export class FirebaseService {
	private app = initializeApp(environment.firebaseConfig);
	private db = initializeFirestore(this.app, {
		cacheSizeBytes: CACHE_SIZE_UNLIMITED,
	});

	private auth: Auth = getAuth();

	private googleProvider = new GoogleAuthProvider();
	private metaProvider = new FacebookAuthProvider();
	private xProvider = new TwitterAuthProvider();

	constructor(private router: Router) {
		enableIndexedDbPersistence(this.db, { forceOwnership: true }).catch(e =>
			console.log(e)
		);
	}

	public async fixDB() {
		console.log("Fixing DB");

		const collectionReference = collection(this.db, "users");
		const querySnapshot = await getDocs(collectionReference);

		querySnapshot.forEach((doc: DocumentSnapshot) => {
			if (doc.id.startsWith("WU") || true) {
				const data = doc.data();

				console.log(data);

				let newData: User;

				console.log("parsing ", doc.id, data);

				newData = {
					username: data["username"] ?? "",
					customExercises: data["customExercises"] ?? [],
					follow: data["follow"] ?? [],
					visibility: data["visibility"] ?? false,
					trainingPrograms: this.normalizeTrainingPrograms(
						data["trainingPrograms"]
					),
					workout: this.normalizeWorkout(data["workouts"]),
					admin: data["admin"] ?? false,
				};

				console.log("complete parsing", doc.id, data, newData);
			}
		});
		console.log("db fixed");
	}

	private normalizeWorkout(workouts: any[]): Workout[] {
		let normalizedWorkout: Workout[] = [];

		workouts.forEach((workouts: any) => {
			let newWorkout: Workout;

			newWorkout = {
				name: workouts["name"],
				date: this.getDate(workouts["date"]),
				trainingTime: 0,
				exercises: [],
			};

			let exercises: EffectiveExercise[] = [];

			workouts["exercises"].forEach((exerciseObj: any) => {
				let newExercise: EffectiveExercise;

				newExercise = {
					name: exerciseObj["name"],
					set: this.getEffectiveSet(exerciseObj),
					note: exerciseObj["note"] ?? "",
					intensity: this.getIntensity(exerciseObj["RPE"]),
					rest: {
						minutes: exerciseObj.rest?.minutes ?? "00",
						seconds: exerciseObj.rest?.seconds ?? "00",
					},
				};

				exercises.push(newExercise);
			});

			newWorkout.exercises = exercises;

			normalizedWorkout.push(newWorkout);
		});

		return normalizedWorkout;
	}

	private getDate(date: string): Date {
		const [day, month, year] = date.split("/").map(Number);
		return new Date(year, month - 1, day);
	}

	private normalizeTrainingPrograms(
		trainingPrograms: any[]
	): TrainingProgram[] {
		let normalizedTraining: TrainingProgram[] = [];

		trainingPrograms.forEach((trainingProgram: any) => {
			let newNormalizedTraining: TrainingProgram;

			newNormalizedTraining = {
				name: trainingProgram["name"],
				session: [],
			};

			let session: Session[] = [];

			trainingProgram["session"].forEach((sessionObj: any) => {
				let newSession: Session;

				newSession = {
					name: sessionObj["name"],
					exercises: [],
				};

				sessionObj["exercises"].forEach((exerciseObj: any) => {
					let newExercise: TrainingProgramExercises;

					newExercise = {
						name: exerciseObj["name"],
						set: this.getSet(exerciseObj),
						note: exerciseObj["note"] ?? "",
						intensity: this.getIntensity(exerciseObj["RPE"]),
						rest: {
							minutes: exerciseObj.rest?.minutes ?? "00",
							seconds: exerciseObj.rest?.seconds ?? "00",
						},
					};

					newSession.exercises.push(newExercise);
				});

				session.push(newSession);
			});

			newNormalizedTraining.session = session;
			normalizedTraining.push(newNormalizedTraining);
		});

		return normalizedTraining;
	}

	private getIntensity(rpe: string): IntensityType {
		if (rpe === "10") return "failure";

		if (rpe === "9" || rpe === "8") return "hard";
		else return "light";
	}

	private getSet(exercise: any): Set[] {
		let set: Set[] = [];

		if ((exercise.configurationType ?? "basic") === "basic") {
			for (let i = 0; i < exercise["series"]; i++) {
				set.push({
					minimumReps: exercise.range[0],
					maximumReps: exercise.range[1],
				});
			}
		} else if (exercise.configurationType === "advanced") {
			exercise.advanced?.sets?.forEach((setObj: any) => {
				set.push({
					minimumReps: setObj["min"],
					maximumReps: setObj["max"],
				});
			});
		}

		return set;
	}

	private getEffectiveSet(exercise: any): EffectiveSet[] {
		let set: EffectiveSet[] = [];

		if ((exercise.configurationType ?? "basic") === "basic") {
			for (let i = 0; i < exercise["series"]; i++) {
				set.push({
					reps: exercise.reps,
					load: exercise.load,
				});
			}
		} else if (exercise.configurationType === "advanced") {
			exercise.advanced?.sets?.forEach((setObj: any) => {
				set.push({
					reps: setObj["reps"],
					load: setObj["load"],
				});
			});
		}

		return set;
	}

	public async getDocumentSnapshot(
		documentReference: DocumentReference
	): Promise<DocumentSnapshot> {
		let documentSnapshot: DocumentSnapshot;

		if (navigator.onLine) {
			documentSnapshot = await getDoc(documentReference);
		} else {
			documentSnapshot = await getDocFromCache(documentReference);
		}

		return documentSnapshot;
	}

	public async registerNewUser(email: string, password: string) {
		try {
			let userCredential = await createUserWithEmailAndPassword(
				this.auth,
				email,
				password
			);
			sendEmailVerification(this.auth.currentUser);
			return userCredential;
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	public async accessWithGoogle() {
		console.log(this.auth);
		return await signInWithPopup(this.auth, this.googleProvider);
	}

	public async accessWithMeta() {
		return await signInWithPopup(this.auth, this.metaProvider);
	}

	public async accessWithX() {
		return await signInWithPopup(this.auth, this.xProvider);
	}

	public async existInfoOf(uid: string) {
		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		return documentSnapshot.exists();
	}

	public async getUserData(uid: string) {
		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		if (!documentSnapshot.exists()) {
			return null;
		}

		return documentSnapshot.data();
	}

	public async loginEmailPsw(email: string, password: string) {
		let userCredential: UserCredential = await signInWithEmailAndPassword(
			this.auth,
			email,
			password
		);

		if (!this.auth.currentUser.emailVerified) return null;

		return userCredential;
	}

	public signout() {
		signOut(this.auth).catch(e => console.log(e));
	}

	public async getExercise(uid: string) {
		let exercise: string[] = [];

		let documentReference = doc(this.db, "exercise", "exercises");
		let documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		if (!documentSnapshot.exists()) {
			return [];
		}

		exercise = documentSnapshot.data()["name"];

		documentReference = doc(this.db, "users", uid);
		documentSnapshot = await this.getDocumentSnapshot(documentReference);

		if (!documentSnapshot.exists()) {
			return [];
		}

		let userExercise = documentSnapshot.data()["customExercises"];
		if (userExercise == undefined) {
			userExercise = [];
		}

		exercise = exercise.concat(userExercise);

		return exercise;
	}

	public addUser(body: User, uid: string) {
		setDoc(doc(this.db, "users", uid), body as WithFieldValue<DocumentData>).catch(e => console.log(e));
	}

	public async saveWorkout(body: Workout, uid: string) {
		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		if (documentSnapshot.exists()) {
			let data = documentSnapshot.data() as User;
			let workout: Workout[] = data.workout;

			workout.push(body);

			updateDoc(documentReference, { workout: workout });
		}
	}

	public async getWorkouts() {
		let uid = JSON.parse(localStorage.getItem("user")).uid;

		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		let workouts: Workout[] = [];

		if (documentSnapshot.exists()) {
			let data = documentSnapshot.data() as User;
			workouts = data.workout;
		}

		return workouts;
	}

	public updateWorkouts(workout: Workout[]) {
		const uid: string = JSON.parse(localStorage.getItem("user")).uid;
		const documentReference = doc(this.db, "users", uid);

		updateDoc(documentReference, { workout: workout }).catch(e =>
			console.log(e)
		);
	}

	public async addTrainingProgram(trainingProgram: TrainingProgram) {
		let uid: string = JSON.parse(localStorage.getItem("user"))["uid"];

		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		if (documentSnapshot.exists()) {
			let data = documentSnapshot.data() as User;
			data.trainingPrograms.push(trainingProgram);

			updateDoc(documentReference, {
				trainingPrograms: data.trainingPrograms,
			}).catch(e => console.log(e));
		}
	}

	public async editTrainingProgram(trainingProgram: TrainingProgram, index: number) {
		let uid: string = JSON.parse(localStorage.getItem("user"))["uid"];

		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		if (documentSnapshot.exists()) {
			let data = documentSnapshot.data() as User;

			data.trainingPrograms[index] = trainingProgram;

			updateDoc(documentReference, {
				trainingPrograms: data.trainingPrograms,
			}).catch(e => console.log(e));
		}
	}

	public async getTrainingPrograms() {
		let uid = JSON.parse(localStorage.getItem("user"))["uid"];

		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		let trainingPrograms: TrainingProgram[] = [];

		if (documentSnapshot.exists()) {
			let data = documentSnapshot.data() as User;
			trainingPrograms = data.trainingPrograms;
		}

		return trainingPrograms;
	}

	public async getTrainingProgramsFromUser(uid: string) {
		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		let trainingPrograms: TrainingProgram[] = [];

		if (documentSnapshot.exists()) {
			let data = documentSnapshot.data() as User;
			trainingPrograms = data.trainingPrograms;
		}

		return trainingPrograms;
	}

	public async updateTrainingPrograms(trainingPrograms: TrainingProgram[]) {
		let uid = JSON.parse(localStorage.getItem("user")).uid;
		const documentReference = doc(this.db, "users", uid);

		updateDoc(documentReference, {
			trainingPrograms: trainingPrograms,
		}).catch(e => console.log(e));
	}

	public async recoverPassword(email: string) {
		try {
			await sendPasswordResetEmail(this.auth, email);
		} catch (HttpErrorResponse) {
			console.log("Si è verificato un errore");
		}
	}

	public async getUsername(uid: string) {
		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		if (documentSnapshot.exists()) {
			let data = documentSnapshot.data() as User;

			return data.username;
		}

		return null;
	}

	public async updateUsername(username: string) {
		const uid = JSON.parse(localStorage.getItem("user")).uid;

		const collectionReference = collection(this.db, "users");
		const querySnapshot = navigator.onLine
			? await getDocs(
					query(
						collectionReference,
						where("username", "==", username)
					)
			  )
			: await getDocsFromCache(
					query(
						collectionReference,
						where("username", "==", username),
						where("uid", "==", uid)
					)
			  );

		if (querySnapshot.size != 0) {
			throw new Error("Username already exists");
		}

		const documentReference = doc(this.db, "users", uid);
		await updateDoc(documentReference, { username: username });
	}

	public async hasFollow() {
		const uid = JSON.parse(localStorage.getItem("user")).uid;

		let documentReference = doc(this.db, "users", uid);
		let documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		let hasFollow = false;

		if (documentSnapshot.exists()) {
			const data = documentSnapshot.data() as User;
			hasFollow = data.follow.length > 0;
		}

		return hasFollow;
	}

	public async getMatchingUsername(username: string) {
		let collectionReference = collection(this.db, "users");
		let querySnapshot = navigator.onLine
			? await getDocs(
					query(
						collectionReference,
						where("username", ">=", username),
						where("username", "<=", username + "\uf8ff"),
						limit(30)
					)
			  )
			: await getDocsFromCache(
					query(
						collectionReference,
						where("username", ">=", username),
						where("username", "<=", username + "\uf8ff"),
						limit(30)
					)
			  );

		let result: {uid: string, username: string}[] = [];

		let uid = JSON.parse(localStorage.getItem("user")).uid;

		querySnapshot.forEach((document: DocumentSnapshot) => {
			let user = { uid: "", username: "" };

			const userData = document.data() as User;

			user.uid = document.id;
			user.username = userData.username;

			if (uid != user.uid) {
				result.push(user);
			}
		});

		return result;
	}

	public async addFollow(uidToFollow: string) {
		let uid = JSON.parse(localStorage.getItem("user")).uid;

		let documentReference = doc(this.db, "users", uid);
		let documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		if (documentSnapshot.exists()) {
			const data = documentSnapshot.data() as User;

			let followed = data.follow;

			if (followed.includes(uidToFollow)) return;

			followed.push(uidToFollow);
			await updateDoc(documentReference, { follow: followed });
		}

	}

	public async getFollowed() {
		const uid = JSON.parse(localStorage.getItem("user")).uid;

		let documentReference = doc(this.db, "users", uid);
		let documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		if (!documentSnapshot.exists()) {
			return [];
		}

		const data = documentSnapshot.data() as User;

		let follow = data.follow;

		let result: {uid: string, username: string, visibilityPermission: boolean}[] = [];

		follow.forEach(async (followedUID: string) => {
			let documentReference = doc(this.db, "users", followedUID);
			let documentSnapshot = await this.getDocumentSnapshot(
				documentReference
			);

			if (!documentSnapshot.exists()) {
				return;
			}

			let userObj = {
				uid: followedUID,
				username: (documentSnapshot.data() as User).username,
				visibilityPermission: (documentSnapshot.data() as User).visibility
			};

			result.push(userObj);
		});

		return result;
	}

	public async unfollow(uid: string, uidToUnfollow: string) {
		let documentReference = doc(this.db, "users", uid);
		let documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		if (!documentSnapshot.exists()) {
			return;
		}

		const data = documentSnapshot.data() as User;

		const followed: string[] = data.follow;
		const index = followed.indexOf(uidToUnfollow);
		followed.splice(index, 1);

		await updateDoc(documentReference, { follow: followed });
	}

	public addFeedback(feedback: string) {
		addDoc(collection(this.db, "feedback"), {
			content: feedback,
			date: new Date().toLocaleDateString(),
		});
	}

	public async userIsAdmin() {
		let uid = JSON.parse(localStorage.getItem("user")).uid;

		let documentReference = doc(this.db, "users", uid);
		let documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		if (!documentSnapshot.exists()) {
			return false;
		}

		let data = documentSnapshot.data() as User;

		return data.admin ?? false;
	}

	public async getFeedbacks() {
		let feedbackCollection = collection(this.db, "feedback");
		let docs = navigator.onLine
			? await getDocs(feedbackCollection)
			: await getDocsFromCache(feedbackCollection);

		let feedback: Feedback[] = [];

		docs.forEach(document => {
			const data = document.data() as Feedback;
			const id = document.id;

			feedback.push({
				id: id,
				content: data.content,
				date: data.date,
			});
		});

		feedback.sort((a: Feedback, b: Feedback) => {
			const dateA = this.convertToDate(a.date);
			const dateB = this.convertToDate(b.date);
			return dateB.getTime() - dateA.getTime();
		});

		return feedback;
	}

	private convertToDate(dateString: string): Date {
		const [day, month, year] = dateString.split("/").map(Number);
		return new Date(year, month - 1, day);
	}

	public async removeFeedback(id: string) {
		await deleteDoc(doc(this.db, "feedback", id));
	}

	public async addExercise(exercise: string) {
		let documentReference = doc(this.db, "exercise", "exercises");
		let documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		if (!documentSnapshot.exists()) {
			return;
		}

		let data = documentSnapshot.data();
		let exercises: string[] = data["name"];
		exercises.push(exercise);

		await updateDoc(documentReference, { name: exercises });
	}

	public async addCustomExercise(exercise: string) {
		const uid: string = JSON.parse(localStorage.getItem("user")).uid;

		let documentReference = doc(this.db, "users", uid);
		let documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		if (!documentSnapshot.exists()) {
			return;
		}

		let data = documentSnapshot.data() as User;

		let exercises: string[] = data.customExercises;
		exercises.push(exercise);

		await updateDoc(documentReference, { customExercises: exercises });
	}

	public changePassword() {
		let email = this.auth.currentUser.email;
		sendPasswordResetEmail(this.auth, email);
	}

	public async deleteUser() {
		let uid = JSON.parse(localStorage.getItem("user")).uid;
		let documentReference = doc(this.db, "users", uid);

		await deleteDoc(documentReference);

		this.auth.currentUser.delete();
	}

	public updateVisibility(visibility: boolean) {
		let uid = JSON.parse(localStorage.getItem("user")).uid;
		let documentReference = doc(this.db, "users", uid);
		updateDoc(documentReference, { visibility: visibility });
	}

	public updateCustomExercises(customExercises: string[]) {
		let uid = JSON.parse(localStorage.getItem("user")).uid;
		let documentReference = doc(this.db, "users", uid);
		updateDoc(documentReference, { customExercises: customExercises });
	}
}
