import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { FirebaseService } from "src/app/services/firebase.service";
import { NotesDialogComponent } from "../notes-dialog/notes-dialog.component";
import { ActivatedRoute, Router } from "@angular/router";
import { TrainingProgram } from "src/app/Models/TrainingProgram.model";
import { formatSets } from "src/app/utils/utils";
import { Set } from "src/app/Models/Exercise.model";
import { User } from "src/app/Models/User.model";
import { UserService } from "src/app/services/user.service";
import { ThemeService } from "src/app/services/theme.service";
import { NotificationService } from "src/app/services/notification.service";

@Component({
	selector: "app-profile",
	templateUrl: "./profile.component.html",
	styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
	public username: string;
	public theme: "dark" | "light";
	public searchUsername: string;
	public trainingPrograms: TrainingProgram[];
	public playlistUrl: string;
	public loading: boolean;
	public profilePic: string;

	constructor(
		private firebase: FirebaseService,
		private userService: UserService,
		private dialog: MatDialog,
		private router: Router,
		private route: ActivatedRoute,
		private themeService: ThemeService,
		private notificationService: NotificationService
	) {}

	async ngOnInit() {
		this.loading = true;

		this.themeService.themeObs.subscribe(theme => {
			this.theme = theme;
		});

		if (this.route.snapshot.paramMap.get("username")) {
			this.searchUsername = this.route.snapshot.paramMap.get("username");
		}

		if (this.route.snapshot.paramMap.get("searchUsername")) {
			this.searchUsername =
				this.route.snapshot.paramMap.get("searchUsername");
		}

		let friendUid: string = this.userService.getUidProfile(); // this goes to undefined after the refresh

		if (!friendUid) {
			this.router.navigate(["/home/friends"]);
			return;
		}

		let user: User = await this.firebase.getUserData(friendUid);
		this.username = user.username;
		this.playlistUrl = user.playlistUrl;
		this.profilePic = user.profilePicUrl;

		this.trainingPrograms = await this.firebase.getTrainingProgramsFromUser(
			friendUid
		);

		this.notificationService.retriveNotification();
		this.loading = false;
	}

	public formatSets(sets: Set[]) {
		return formatSets(sets);
	}

	public onCancel() {
		if (this.route.snapshot.paramMap.get("searchUsername")) {
			this.router.navigate([
				"/home/search-result",
				{ searchUsername: this.searchUsername },
			]);
		} else {
			this.router.navigate(["/home/friends"]);
		}
	}

	public isPlaylistUrlValid() {
		return (
			this.playlistUrl &&
			this.playlistUrl !== "" &&
			this.playlistUrl.includes("https://open.spotify.com/playlist/")
		);
	}

	public focusCollapse(type: "program" | "session", index: number) {
		if (type === "program") {
			const collapsers: NodeListOf<Element> =
				document.querySelectorAll(".collapser");
			const collapses: NodeListOf<Element> =
				document.querySelectorAll(".collapse-body");

			for (let i = 0; i < collapsers.length; i++) {
				if (i !== index) {
					collapsers[i]?.classList.remove("collapsed");
					collapsers[i]?.setAttribute("aria-expanded", "false");
					collapses[i]?.classList.remove("show");
				}
			}
		}
	}

	public async saveTrainingProgram(trainingProgramIndex: number) {
		const exercisesAvailable = await this.firebase.getExercise();

		this.trainingPrograms[trainingProgramIndex].session.forEach(session => {
			session.exercises.forEach(async exercise => {
				if (!exercisesAvailable.includes(exercise.name)) {
					await this.firebase.addCustomExercise(exercise.name);
				}
			});
		});

		this.firebase.addTrainingProgram(
			this.trainingPrograms[trainingProgramIndex]
		);

		this.notificationService.sendNotification(
			this.userService.getUidProfile(),
			"download"
		);

		this.notificationService.showSnackBarNotification(
			"Scheda salvata!",
			"Ok",
			{
				duration: 3000,
				panelClass: [
					this.theme == "dark" ? "dark-snackbar" : "light-snackbar",
				],
			}
		);
	}

	public showNotes(
		programIndex: number,
		workoutIndex: number,
		exerciseIndex: number
	) {
		this.dialog.open(NotesDialogComponent, {
			width: "300px",
			data: {
				notes: this.trainingPrograms[programIndex].session[workoutIndex]
					.exercises[exerciseIndex].note,
			},
			panelClass: [
				this.theme === "dark" ? "dark-dialog" : "light-dialog",
			],
		});
	}
}
