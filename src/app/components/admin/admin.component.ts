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

@Component({
	selector: "app-admin",
	templateUrl: "./admin.component.html",
	styleUrls: ["./admin.component.css"],
})
export class AdminComponent implements OnInit {
	public feedbacks: Feedback[] = [];
	public loading: boolean = false;
	private users: DocumentData[] = [];
	private exercises: DocumentData[] = [];
    public exercisesLength: number = 0;
    public activeUsersLength: number = 0;
    public allUsersLength: number = 0;
    public adminUsersLength: number = 0;
    private twoMonthsAgo: number;

	constructor(private firebase: FirebaseService, private dialog: MatDialog) {}

	addExercise() {
		this.dialog.open(AddExerciseDialogComponent, {
			disableClose: false,
		});
	}

	async ngOnInit() {
		this.loading = true;
    
        const today = new Date();
        this.twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate()).getTime();

		this.exercises = await this.firebase.getAllExercises();
        this.exercises.length = this.exercises.length;

		this.users = await this.firebase.getAllUsers();
        this.activeUsersLength = this.getActiveUsersLength();
        this.allUsersLength = this.users.length;
        this.adminUsersLength = this.users.filter((user) => (user as User).admin).length;

		this.feedbacks = await this.firebase.getFeedbacks();

		this.loading = false;
	}

    private getActiveUsersLength() {
        let activeUsersLength = 0;

        for (let i in this.users) {
            const userWorkouts = ((this.users[i] as User).workout as Workout[]).sort((a: Workout, b: Workout) => {
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

    public showFeedback(index: number) {
        this.dialog.open(ExpandFeedbackDialogComponent, {
            data: {
                message: this.feedbacks[index].content
            },
        });
    }

	async removeFeedback(index: number) {
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
		});
	}
}
