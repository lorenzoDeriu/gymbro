import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AddExerciseDialogComponent } from "../add-exercise-dialog/add-exercise-dialog.component";
import { FirebaseService } from "src/app/services/firebase.service";
import { Feedback } from "src/app/Models/Feedback.model";
import { SafetyActionConfirmDialogComponent } from "../safety-action-confirm-dialog/safety-action-confirm-dialog.component";
import { ExpandFeedbackDialogComponent } from "../expand-feedback-dialog/expand-feedback-dialog.component";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { User } from "src/app/Models/User.model";
import { Workout } from "src/app/Models/Workout.model";
import { ExpandExercisesDialogComponent } from "../expand-exercises-dialog/expand-exercises-dialog.component";
import { ThemeService } from "src/app/services/theme.service";
import { NotificationService } from "src/app/services/notification.service";

@Component({
	selector: "app-admin",
	templateUrl: "./admin.component.html",
	styleUrls: ["./admin.component.css"],
})
export class AdminComponent implements OnInit {
	public theme: "light" | "dark";
	public feedbacks: Feedback[] = [];
	public loading: boolean = false;
	private users: DocumentData[] = [];
	private exercises: DocumentData[] = [];
	public exercisesLength: number = 0;
	public activeUsersLength: number = 0;
	public allUsersLength: number = 0;
	public adminUsersLength: number = 0;
	private twoMonthsAgo: number;

	constructor(
		private firebase: FirebaseService,
		private dialog: MatDialog,
		private themeService: ThemeService,
		private notification: NotificationService
	) {}

	public addExercise() {
		this.dialog.open(AddExerciseDialogComponent, {
			disableClose: false,
			panelClass: [
				this.theme === "dark" ? "dark-dialog" : "light-dialog",
			],
		});
	}

	async ngOnInit() {
		this.loading = true;

		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});

		const today = new Date();
		this.twoMonthsAgo = new Date(
			today.getFullYear(),
			today.getMonth() - 2,
			today.getDate()
		).getTime();

		this.exercises = await this.firebase.getAllExercises();
		this.exercisesLength = this.exercises.length;

		this.users = await this.firebase.getAllUsers();
		this.activeUsersLength = this.getActiveUsersLength();
		this.allUsersLength = this.users.length;
		this.adminUsersLength = this.users.filter(
			user => (user as User).admin
		).length;

		this.feedbacks = await this.firebase.getFeedbacks();

		this.loading = false;
	}

	private getActiveUsersLength() {
		let activeUsersLength = 0;

		for (let i in this.users) {
			const userWorkouts = (
				(this.users[i] as User).workout as Workout[]
			).sort((a: Workout, b: Workout) => {
				return b.date - a.date;
			});

			for (let j in userWorkouts) {
				if (userWorkouts[j].date >= this.twoMonthsAgo) {
					activeUsersLength++;
					break;
				}
			}
		}

		return activeUsersLength;
	}

	public reload() {
		window.location.reload();
	}

	public showFeedback(index: number) {
		this.dialog.open(ExpandFeedbackDialogComponent, {
			data: {
				message: this.feedbacks[index].content,
			},
			panelClass: [
				this.theme === "dark" ? "dark-dialog" : "light-dialog",
			],
		});
	}

	public showExercises() {
		this.dialog.open(ExpandExercisesDialogComponent, {
			data: {
				exercises: this.exercises,
			},
			panelClass: [
				this.theme === "dark" ? "dark-dialog" : "light-dialog",
			],
		});
	}

	public async removeFeedback(index: number) {
		this.dialog.open(SafetyActionConfirmDialogComponent, {
			data: {
				title: "Elimina feedback",
				message: "Sei sicuro di voler eliminare questo feedback?",
				args: [index],
				confirm: async (index: number) => {
					await this.firebase.removeFeedback(
						this.feedbacks[index].id
					);
					this.ngOnInit();
				},
			},
			panelClass: [
				this.theme === "dark" ? "dark-dialog" : "light-dialog",
			],
		});
	}
}
