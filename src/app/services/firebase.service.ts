import { Workout } from "src/app/Models/Workout.model";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { v4 as uuidv4 } from "uuid";

import { initializeApp } from "firebase/app";
import {
	FirebaseStorage,
	StorageReference,
	deleteObject,
	getDownloadURL,
	getStorage,
	list,
	listAll,
	ref,
	uploadBytes,
} from "firebase/storage";
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
	getDocFromCache,
	DocumentReference,
	getDoc,
	getDocsFromCache,
	WithFieldValue,
	DocumentData,
	persistentLocalCache,
	Firestore,
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
	onAuthStateChanged,
} from "firebase/auth";
import { User } from "../Models/User.model";
import { Session, TrainingProgram } from "../Models/TrainingProgram.model";
import {
	EffectiveExercise,
	EffectiveSet,
	IntensityType,
	Set,
	TrainingProgramExercise,
} from "../Models/Exercise.model";
import { Feedback } from "../Models/Feedback.model";
import {
	FollowedUserInfo,
	SearchResult,
} from "../components/friends/friends.component";
import { generateId } from "../utils/utils";
import { FirebaseApp } from "@angular/fire/app";
import { Notification } from "../Models/Notification.model";

@Injectable({
	providedIn: "root",
})
export class FirebaseService {
	private app: FirebaseApp = initializeApp(environment.firebaseConfig);
	private db: Firestore = initializeFirestore(this.app, {
		localCache: persistentLocalCache({}),
	});

	private auth: Auth = getAuth();

	private storage: FirebaseStorage = getStorage(this.app);

	private googleProvider = new GoogleAuthProvider();
	private metaProvider = new FacebookAuthProvider();
	private xProvider = new TwitterAuthProvider();

	public async fixDB() {
		console.log("Fixing DB");

		const collectionReference = collection(this.db, "users");
		const querySnapshot = await getDocs(collectionReference);

		querySnapshot.forEach((doc: DocumentSnapshot) => {
			if (!doc.id.startsWith("WU")) {
				const data = doc.data();

				console.log("berfore parsing:", doc.id, data);

				let newData: User;

				newData = {
					username: data["username"] ?? "",
					visibility: data["visibility"] ?? false,
					admin: data["admin"] ?? false,
					playlistUrl: "",
					follow: data["follow"] ?? [],
					customExercises: data["customExercises"] ?? [],
					trainingPrograms: this.normalizeTrainingPrograms(
						data["trainingPrograms"]
					),
					workout: this.normalizeWorkout(data["workouts"]),
				};

				console.log("complete parsing", doc.id, newData);
				updateDoc(doc.ref, newData);
			}
		});
		console.log("db fixed");
	}

	public async getProfilePic(uid: string) {
		const profilePicsRef: StorageReference = ref(
			this.storage,
			"profile-pics/" + uid
		);
		const listOfPics = await listAll(profilePicsRef);

		if (listOfPics.items.length !== 0) {
			return getDownloadURL(listOfPics.items[0]).then(url => {
				return url;
			});
		}

		return null;
	}

	public async uploadProfilePic(file: File, uid: string) {
		const profilePicsRef: StorageReference = ref(
			this.storage,
			"profile-pics/" + uid
		);
		const profilePicRef: StorageReference = ref(
			this.storage,
			"profile-pics/" + uid + "/profile-pic"
		);
		const listOfPics = await list(profilePicsRef);

		if (listOfPics.items.length !== 0) {
			deleteObject(profilePicRef).then(async () => {
				await uploadBytes(profilePicRef, file);

				getDownloadURL(profilePicRef).then(url => {
					this.updateProfilePicUrl(url);
				});
			});
		} else {
			await uploadBytes(profilePicRef, file);

			getDownloadURL(profilePicRef).then(url => {
				this.updateProfilePicUrl(url);
			});
		}
	}

	public async removeProfilePic(uid: string) {
		const profilePicRef: StorageReference = ref(
			this.storage,
			"profile-pics/" + uid
		);
		const listOfPics = await listAll(profilePicRef);

		if (listOfPics.items.length !== 0) {
			await deleteObject(listOfPics.items[0]).then(() => {
				this.updateProfilePicUrl("");
			});
		}
	}

	async getAllUsers() {
		return await getDocs(collection(this.db, "users")).then(
			querySnapshot => {
				return querySnapshot.docs.map(doc => doc.data());
			}
		);
	}

	async getAllExercises() {
		return await getDocs(collection(this.db, "exercise")).then(
			querySnapshot => {
				return querySnapshot.docs.map(doc => doc.data())[0]["name"];
			}
		);
	}

	private normalizeWorkout(workouts: any[]): Workout[] {
		let normalizedWorkout: Workout[] = [];

		workouts.forEach((workouts: any) => {
			let newWorkout: Workout;

			newWorkout = {
				name: workouts["name"],
				date: this.getDate(workouts["date"]).getTime(),
				trainingTime: 0,
				exercises: [],
			};

			let exercises: EffectiveExercise[] = [];

			workouts["exercises"].forEach((exerciseObj: any) => {
				let newExercise: EffectiveExercise;

				newExercise = {
					name: exerciseObj["name"],
					set: this.getEffectiveSet(exerciseObj),
					intensity: this.getIntensity(exerciseObj["RPE"]),
					rest: {
						minutes: exerciseObj.rest?.minutes ?? "00",
						seconds: exerciseObj.rest?.seconds ?? "00",
					},
					note: exerciseObj["note"] ?? "",
					groupId: generateId(),
				};

				exercises.push(newExercise);
			});

			newWorkout.exercises = exercises;

			normalizedWorkout.push(newWorkout);
		});

		return normalizedWorkout.sort((a: Workout, b: Workout) => {
			return b.date - a.date;
		});
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
					let newExercise: TrainingProgramExercise;

					newExercise = {
						name: exerciseObj["name"],
						set: this.getSet(exerciseObj),
						note: exerciseObj["note"] ?? "",
						intensity: this.getIntensity(exerciseObj["RPE"]),
						rest: {
							minutes: exerciseObj.rest?.minutes ?? "00",
							seconds: exerciseObj.rest?.seconds ?? "00",
						},
						groupId: generateId(),
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
					reps: exercise.reps ?? 0,
					load: exercise.load ?? 0,
				});
			}
		} else if (exercise.configurationType === "advanced") {
			exercise.advanced?.sets?.forEach((setObj: any) => {
				set.push({
					reps: setObj["reps"] ?? 0,
					load: setObj["load"] ?? 0,
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
			return null;
		}
	}

	public async accessWithGoogle() {
		return await signInWithPopup(this.auth, this.googleProvider);
	}

	public async accessWithMeta() {
		return await signInWithPopup(this.auth, this.metaProvider);
	}

	public async accessWithX() {
		return await signInWithPopup(this.auth, this.xProvider);
	}

	public async existInfoOf(
		uid: string,
		username?: string
	): Promise<{
		exists: boolean;
		err: string;
	}> {
		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		if (documentSnapshot.exists())
			return { exists: true, err: "uid already exists" };
		if (!username || username === "") return { exists: false, err: "" };

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
						where("username", "==", username)
					)
			  );

		if (querySnapshot.size !== 0) {
			return { exists: true, err: "username already exists" };
		}

		return { exists: false, err: "" };
	}

	public async getUserData(uid?: string) {
		if (uid === undefined) {
			uid = await this.getUid();
		}

		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		if (!documentSnapshot.exists()) {
			return null;
		}

		return documentSnapshot.data() as User;
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

	public async getExercise() {
		let uid = await this.getUid();

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

		return exercise.sort();
	}

	public addUser(body: User, uid: string) {
		setDoc(
			doc(this.db, "users", uid),
			body as WithFieldValue<DocumentData>
		).catch(e => console.log(e));
	}

	public async saveWorkout(body: Workout) {
		let uid = await this.getUid();

		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		if (documentSnapshot.exists()) {
			let data = documentSnapshot.data() as User;
			let workouts: Workout[] = data.workout;

			workouts.push(body);

			updateDoc(documentReference, { workout: workouts });
		}
	}

	public async getWorkouts() {
		let uid = await this.getUid();

		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		let workouts: Workout[] = [];

		if (documentSnapshot.exists()) {
			let data = documentSnapshot.data() as User;
			workouts = data.workout;
		}

		return workouts.sort((a: Workout, b: Workout) => b.date - a.date);
	}

	public async updateWorkout(workout: Workout, index: number) {
		let uid = await this.getUid();

		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		if (documentSnapshot.exists()) {
			let data = documentSnapshot.data() as User;

			let workouts: Workout[] = data.workout;

			workouts.sort((a: Workout, b: Workout) => b.date - a.date);
			workouts[index] = workout;

			updateDoc(documentReference, { workout: workouts });
		}
	}

	public async updateWorkouts(workout: Workout[]) {
		const uid: string = await this.getUid();
		const documentReference = doc(this.db, "users", uid);

		updateDoc(documentReference, { workout: workout }).catch(e =>
			console.log(e)
		);
	}

	public async addTrainingProgram(trainingProgram: TrainingProgram) {
		let uid: string = await this.getUid();

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

	public async editTrainingProgram(
		trainingProgram: TrainingProgram,
		index: number
	) {
		let uid: string = await this.getUid();

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
		let uid = await this.getUid();

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
		let uid = await this.getUid();
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

	public async getUsername(uid?: string) {
		if (uid === undefined) {
			uid = await this.getUid();
		}

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
		const uid = await this.getUid();

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
		const uid = await this.getUid();

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

	public async getMatchingUsername(
		username: string
	): Promise<SearchResult[]> {
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

		let result: SearchResult[] = [];

		let uid = await this.getUid();

		querySnapshot.forEach((document: DocumentSnapshot) => {
			let user = { uid: "", username: "", profilePicUrl: "" };

			const userData = document.data() as User;

			user.uid = document.id;
			user.username = userData.username;
			user.profilePicUrl = userData.profilePicUrl;

			if (uid !== user.uid) {
				result.push(user);
			}
		});

		return result;
	}

	public async addFollow(uidToFollow: string) {
		let uid = await this.getUid();

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
		const uid = await this.getUid();

		let documentReference = doc(this.db, "users", uid);
		let documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		if (!documentSnapshot.exists()) {
			return [];
		}

		const data = documentSnapshot.data() as User;

		let follow = data.follow;

		let result: FollowedUserInfo[] = [];

		for (let followedUID of follow) {
			let documentReference = doc(this.db, "users", followedUID);
			let documentSnapshot = await this.getDocumentSnapshot(
				documentReference
			);

			if (documentSnapshot.exists()) {
				let userObj: FollowedUserInfo = {
					uid: followedUID,
					username: (documentSnapshot.data() as User).username,
					visibilityPermission: (documentSnapshot.data() as User)
						.visibility,
					profilePicUrl: (documentSnapshot.data() as User)
						.profilePicUrl,
				};

				result.push(userObj);
			}
		}

		return result as FollowedUserInfo[];
	}

	public async unfollow(uidToUnfollow: string) {
		const uid = await this.getUid();

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
		let uid = await this.getUid();

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
		const uid: string = await this.getUid();

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
		let uid = await this.getUid();
		let documentReference = doc(this.db, "users", uid);

		await deleteDoc(documentReference);

		this.auth.currentUser.delete();

		localStorage.clear();
	}

	public async updateVisibility(visibility: boolean) {
		let uid = await this.getUid();
		let documentReference = doc(this.db, "users", uid);
		updateDoc(documentReference, { visibility: visibility });
	}

	public async updateCustomExercises(customExercises: string[]) {
		let uid = await this.getUid();
		let documentReference = doc(this.db, "users", uid);
		updateDoc(documentReference, { customExercises: customExercises });
	}

	public async updatePlaylistUrl(playlistUrl: string) {
		let uid = await this.getUid();
		let documentReference = doc(this.db, "users", uid);
		await updateDoc(documentReference, { playlistUrl: playlistUrl });
	}

	public async updateProfilePicUrl(profilePicUrl: string) {
		let uid = await this.getUid();
		let documentReference = doc(this.db, "users", uid);
		await updateDoc(documentReference, { profilePicUrl: profilePicUrl });
	}

	public async getNotification() {
		let uid = await this.getUid();
		let documentReference = doc(this.db, "users", uid);
		let documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		if (!documentSnapshot.exists()) {
			return [];
		}

		let data = documentSnapshot.data() as User;

		if (!data.notification) {
			updateDoc(documentReference, { notification: [] });
		}

		return data.notification ?? [];
	}

	public async addNotification(to: string, newNotifications: Notification) {
		let documentReference = doc(this.db, "users", to);
		let documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		if (!documentSnapshot.exists()) {
			return;
		}

		let data = documentSnapshot.data() as User;
		const notifications = data.notification ?? [];
		notifications.push(newNotifications);

		await updateDoc(documentReference, { notification: notifications });
	}

	public async deleteNotification(id: string) {
		let uid = await this.getUid();
		let documentReference = doc(this.db, "users", uid);
		let documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		if (!documentSnapshot.exists()) {
			return;
		}

		let data = documentSnapshot.data() as User;
		const notifications = data.notification ?? [];
		const index = notifications.findIndex(
			notification => notification.id === id
		);
		notifications.splice(index, 1);

		await updateDoc(documentReference, { notification: notifications });
	}

	public async deleteAllNotifications() {
		let uid = await this.getUid();
		let documentReference = doc(this.db, "users", uid);
		let documentSnapshot = await this.getDocumentSnapshot(
			documentReference
		);

		if (!documentSnapshot.exists()) {
			return;
		}

		await updateDoc(documentReference, { notification: [] });
	}

	private async getAdminUid(): Promise<string[]> {
		let adminUid: string[] = [];

		let collectionReference = collection(this.db, "users");
		let querySnapshot = navigator.onLine
			? getDocs(query(collectionReference, where("admin", "==", true)))
			: getDocsFromCache(
					query(collectionReference, where("admin", "==", true))
			  );

		const qs = await querySnapshot;
		qs.forEach(document => {
			adminUid.push(document.id);
		});

		return adminUid;

	}

	public async addNotificationToAdmin() {
		let adminUid: string[] = await this.getAdminUid();

		adminUid.forEach((admin: string) => {
			this.addNotification(admin, {
				id: `ntf-${uuidv4()}`,
				type: "feedback",
			});
		});
	}

	// DO NOT TOUCH THIS!!!
	public async getUid() {
		return await new Promise<string>((resolve, _) => {
			onAuthStateChanged(this.auth, user => {
				if (user) {
					resolve(user.uid);
				} else {
					resolve("");
				}
			});
		});
	}
}
