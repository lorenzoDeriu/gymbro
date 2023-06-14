import { AuthService } from 'src/app/services/auth.service';
import { Injectable, OnChanges } from '@angular/core';
import { environment } from 'src/environments/environment';

import { initializeApp } from 'firebase/app';
import "firebase/firestore";
import { setDoc, doc, updateDoc, query, where, getDocs, collection, DocumentSnapshot, limit, addDoc, deleteDoc, initializeFirestore, CACHE_SIZE_UNLIMITED, enableIndexedDbPersistence, getDocFromServer, getDocFromCache, DocumentReference, getDoc, getDocsFromCache, onSnapshot, DocumentChange } from 'firebase/firestore';
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
} from "firebase/auth";
import { Router } from '@angular/router';

export interface user {
	uid: string,
	workout: any,
	trainingPrograms: any
}

@Injectable({
  	providedIn: 'root'
})
export class FirebaseService {
	private app = initializeApp(environment.firebaseConfig);
	private db = initializeFirestore(this.app, {
		cacheSizeBytes: CACHE_SIZE_UNLIMITED,
	});

	private auth: Auth = getAuth();
	private googleProvider = new GoogleAuthProvider();

  	constructor(private router: Router) {
		enableIndexedDbPersistence(this.db, {forceOwnership: true}).catch(e => console.log(e));
	}

	public async getDocumentSnapshot(documentReference: DocumentReference): Promise<DocumentSnapshot> {
		let documentSnapshot: DocumentSnapshot;

		if (navigator.onLine) {
			documentSnapshot = await getDoc(documentReference);
		} else {
			documentSnapshot = await getDocFromCache(documentReference);
		}

		return documentSnapshot;
	}

	async registerNewUser(email: string, password: string) {
		try {
			let userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
			sendEmailVerification(this.auth.currentUser)
			return userCredential;
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	async accessWithGoogle() {
		return await signInWithPopup(this.auth, this.googleProvider);
	}

	public async existInfoOf(uid: string) {
		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(documentReference);

		return documentSnapshot.exists()
	}

	async getUserData(uid: string) {
		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(documentReference);

		return documentSnapshot.data();
	}

	public async loginEmailPsw(email: string, password: string) {
		try {
			let userCredential = await signInWithEmailAndPassword(this.auth, email, password);
			if (!this.auth.currentUser.emailVerified) return null;
			return userCredential;
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	public signout() {
		signOut(this.auth).catch(e => console.log(e));
	}

	async getExercise(uid: string) {
		let exercise: string[] = [];

		let documentReference = doc(this.db, "exercise", "exercises")
		let documentSnapshot = await this.getDocumentSnapshot(documentReference);

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

	addUser(body: any, uid: string) {
		setDoc(doc(this.db, "users", uid), body).catch(e => console.log(e))
	}

	async saveWorkout(body: any, uid: string) {
		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(documentReference);

		if (documentSnapshot.exists()) {
			let data = documentSnapshot.data();
			let workouts: any[] = data["workouts"];

			workouts.push(body);

			updateDoc(documentReference, {workouts: workouts}).catch(e => console.log(e)).then(() => {
				if (Notification.permission == "granted") {
					let notification = new Notification("Allenamento Salvato", {
						body: "Un nuovo allenamento è stato aggiunto, controlla i tuoi progressi per vedere i miglioramenti!",
						icon: "assets/images/logo.png",
					});

					notification.onclick = () => {
						this.router.navigate(["home/progress"]);
					};

					console.log(notification)
				}
			})
		}
	}

	async getWorkouts() {
		let uid = JSON.parse(localStorage.getItem("user"))["uid"];

		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(documentReference);

		if (documentSnapshot.exists()) {
			let data = documentSnapshot.data();
			return data["workouts"];
		}
		return null;
	}

	updateWorkouts(workouts: any, uid: string) {
		const documentReference = doc(this.db, "users", uid);

		updateDoc(documentReference, {workouts: workouts}).catch(e => console.log(e))
	}

	async addTrainingProgram(trainingProgram: any) {
		let uid: any = JSON.parse(localStorage.getItem("user"))["uid"];

		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(documentReference);

		if (documentSnapshot.exists()) {
			let data = documentSnapshot.data();
			data["trainingPrograms"].push(trainingProgram);

			updateDoc(documentReference, {trainingPrograms: data["trainingPrograms"]}).catch(e => console.log(e));
		}
	}

	async getTrainingPrograms() {
		let uid = JSON.parse(localStorage.getItem("user"))["uid"];

		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(documentReference);

		if (documentSnapshot.exists()) {
			let data = documentSnapshot.data();
			return data["trainingPrograms"];
		}

		return null;
	}

	async getTrainingProgramsFromUser(uid: string) {
		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(documentReference);

		if (documentSnapshot.exists()) {
			let data = documentSnapshot.data();
			return data["trainingPrograms"];
		}

		return null;
	}

	async updateTrainingPrograms(trainingPrograms: any , uid: string) {
		const documentReference = doc(this.db, "users", uid);

		updateDoc(documentReference, {trainingPrograms: trainingPrograms}).catch(e => console.log(e));
	}

	async recoverPassword(email: string) {
		try {
			await sendPasswordResetEmail(this.auth, email);
		} catch (HttpErrorResponse) {
			console.log("Si è verificato un errore")
		}
	}

	async getUsername(uid: string) {
		const documentReference = doc(this.db, "users", uid);
		const documentSnapshot = await this.getDocumentSnapshot(documentReference);

		if (documentSnapshot.exists()) {
			let data: any = documentSnapshot.data();
			return (data["username"] != undefined) ? data["username"] : null;
		}

		return null;
	}

	async updateUsername(uid: string, username: string) {
		const collectionReference = collection(this.db, "users");
		const querySnapshot = (navigator.onLine) ? await getDocs(query(collectionReference, where("username", "==", username))) :
												   await getDocsFromCache(query(collectionReference, where("username", "==", username), where("uid", "==", uid)));

		if(querySnapshot.size != 0) {
			alert("L'username è già utilizzato, provane un'altro");
			return;
		}

		const documentReference = doc(this.db, "users", uid);

		await updateDoc(documentReference, {username: username});
	}

	async getFriendsUsernames(uid: string) {
		let documentReference  = doc(this.db, "users", uid);
		let documentSnapshot = await this.getDocumentSnapshot(documentReference)

		if (!documentSnapshot.exists()) return [];

		let data = documentSnapshot.data();
		let friendsUID = data["follow"];

		if (friendsUID == undefined) return []

		let usernames: string[] = [];

		friendsUID.forEach(async (uid: string) => {
			let documentReference = doc(this.db, "users", uid);
			let documentSnapshot = await this.getDocumentSnapshot(documentReference)

			if (documentSnapshot.exists()) {
				usernames = documentSnapshot.data()["username"]
			}
		})

		usernames.sort((a, b) => {
			if (a < b) return -1;
			if (a > b) return 1;
			return 0;
		});

		return usernames;
	}

	async hasFollow(uid: string) {
		let documentReference = doc(this.db, "users", uid);
		let documentSnapshot = await this.getDocumentSnapshot(documentReference);

		if (!documentSnapshot.exists() || documentSnapshot.data()["follow"] == undefined) {
			return false;
		}

		return documentSnapshot.data()["follow"].length > 0;
	}

	async getMatchingUsername(username: string) {
		let collectionReference = collection(this.db, "users");
		let querySnapshot = (navigator.onLine) ? await getDocs(query(collectionReference, where('username', '>=', username), where("username", "<=", username+"\uf8ff"), limit(30))) :
												 await getDocsFromCache(query(collectionReference, where('username', '>=', username), where("username", "<=", username+"\uf8ff"), limit(30)));

		let result: any[] = []

		let uid = JSON.parse(localStorage.getItem("user"))["uid"];

		querySnapshot.forEach((document: DocumentSnapshot) => {
			let user = {uid: "", username: ""};

			user["uid"] = document.id;
			user["username"] = document.data()["username"];

			if (uid != user["uid"])
			result.push(user);
		})

		return result;
	}

	async addFollow(uidToFollow: string) {
		let uid = JSON.parse(localStorage.getItem("user"))["uid"];

		let documentReference = doc(this.db, "users", uid);
		let documentSnapshot = await this.getDocumentSnapshot(documentReference);

		let followed = documentSnapshot.data()["follow"];

		if (followed == undefined)followed = [];
		if (followed.includes(uidToFollow)) return

		followed.push(uidToFollow)
		await updateDoc(documentReference, {follow: followed});
	}

	async getFollowed(uid: string) {
		let documentReference = doc(this.db, "users", uid);
		let documentSnapshot = await this.getDocumentSnapshot(documentReference);

		if (!documentSnapshot.exists()) {
			return null
		}

		let follow = documentSnapshot.data()["follow"];

		let result: any[] = [];

		if (follow == undefined) return result;

		follow.forEach(async (followedUID: string) => {
			let documentReference = doc(this.db, "users", followedUID);
			let documentSnapshot = await this.getDocumentSnapshot(documentReference);

			if (!documentSnapshot.exists()) {
				return
			}

			let userObj = {
				uid: followedUID,
				username: documentSnapshot.data()["username"] == undefined ? "" : documentSnapshot.data()["username"],
				visibilityPermission: documentSnapshot.data()["visibility"] == undefined ? false : documentSnapshot.data()["visibility"]
			};

			result.push(userObj);
		});

		return result;
	}

	async unfollow(uid: string, uidToUnfollow: string) {
		let documentReference = doc(this.db, "users", uid);
		let documentSnapshot = await this.getDocumentSnapshot(documentReference);

		if (!documentSnapshot.exists()) {
			return
		}

		let followed: string[] = documentSnapshot.data()["follow"];
		let index = followed.indexOf(uidToUnfollow);
		followed.splice(index, 1);

		await updateDoc(documentReference, {follow: followed});
	}

	addFeedback(feedback: string) {
		addDoc(collection(this.db, "feedback"), {content: feedback, date: new Date().toLocaleDateString()});
	}

	async userIsAdmin() {
		let uid = JSON.parse(localStorage.getItem("user"))["uid"];

		let documentReference = doc(this.db, "users", uid);
		let documentSnapshot = await this.getDocumentSnapshot(documentReference);

		if (!documentSnapshot.exists()) {
			return false;
		}

		let data = documentSnapshot.data()

		if (data["admin"]) {
			return true;
		}

		return false;
	}

	async getFeedbacks() {
		let feedbackCollection = collection(this.db, "feedback");
		let docs = (navigator.onLine) ? await getDocs(feedbackCollection) : await getDocsFromCache(feedbackCollection);

		let feedback: any[] = []

		docs.forEach((document) => {
			feedback.push({content: document.data()["content"], date: document.data()["date"], id: document.id});
		})

		feedback.sort((a, b) => {
			if (a["date"] < b["date"]) return 1;
			if (a["date"] > b["date"]) return -1;
			return 0;
		});

		// feedback.sort(this.compareDates);

		return feedback;
	}

	/* compareDates(a: any, b: any) {
		var dateA = new Date(
		  a.date.split('/').reverse().join('-') + 'T00:00:00'
		).getTime();
		var dateB = new Date(
		  b.date.split('/').reverse().join('-') + 'T00:00:00'
		).getTime();
		return dateA - dateB;
	  } */


	async removeFeedback(id: string) {
		await deleteDoc(doc(this.db, "feedback", id));
	}

	async addExercise(exercise: string) {
		let documentReference = doc(this.db, "exercise", "exercises");
		let documentSnapshot = await this.getDocumentSnapshot(documentReference);

		if (!documentSnapshot.exists()) {
			return;
		}

		let data = documentSnapshot.data();
		let exercises: string[] = data["name"];
		exercises.push(exercise);

		await updateDoc(documentReference, {name: exercises});
	}

	async addCustomExercise(exercise: string, uid: string) {
		let documentReference = doc(this.db, "users", uid);
		let documentSnapshot = await this.getDocumentSnapshot(documentReference);

		if (!documentSnapshot.exists()) {
			return;
		}

		let data = documentSnapshot.data();
		if (data["customExercises"] == undefined) {
			data["customExercises"] = [];
		}

		let exercises: string[] = data["customExercises"];
		exercises.push(exercise);

		await updateDoc(documentReference, {customExercises: exercises});
	}

	changePassword() {
		let email = this.auth.currentUser.email;
		sendPasswordResetEmail(this.auth, email)
	}

	async deleteUser() {
		let uid = JSON.parse(localStorage.getItem("user"))["uid"];
		let documentReference = doc(this.db, "users", uid);

		await deleteDoc(documentReference);

		this.auth.currentUser.delete();
	}

	updateVisibility(uid: string, visibility: boolean) {
		let documentReference = doc(this.db, "users", uid);
		updateDoc(documentReference, {visibility: visibility});
	}

	async deleteCustomExercise(uid: string, exercise: string) {
		let documentReference = doc(this.db, "users", uid);

		let documentSnapshot = await this.getDocumentSnapshot(documentReference);
		let exercises: string[] = documentSnapshot.data()["customExercises"];

		let index = exercises.indexOf(exercise);
		exercises.splice(index, 1);

		await updateDoc(documentReference, {customExercises: exercises});
	}
}
