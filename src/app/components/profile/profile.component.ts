import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FirebaseService } from "src/app/services/firebase.service";
import { NotesDialogComponent } from "../notes-dialog/notes-dialog.component";
import { Router } from "@angular/router";
import { TrainingProgram } from "src/app/Models/TrainingProgram.model";

@Component({
	selector: "app-profile",
	templateUrl: "./profile.component.html",
	styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit, OnDestroy {
	public username: string;
	public trainingPrograms: TrainingProgram[];
	public playlistUrl: string;
	public loading: boolean;

	constructor(
		private firebase: FirebaseService,
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
		private router: Router
	) {}

	async ngOnInit() {
		this.loading = true;

		try {
			let uid: string = JSON.parse(localStorage.getItem("user"))["uid"];
			let user: any = await this.firebase.getUserData(uid);

			this.trainingPrograms =
				await this.firebase.getTrainingProgramsFromUser(uid);
			this.username = user.username;
			this.playlistUrl = user.playlistUrl;

			if (!this.trainingPrograms) this.trainingPrograms = [];
		} catch {
			this.trainingPrograms = JSON.parse(
				localStorage.getItem("profileInfo")
			)["trainingPrograms"];
			this.username = JSON.parse(localStorage.getItem("profileInfo"))[
				"username"
			];
		} finally {
			localStorage.setItem(
				"profileInfo",
				JSON.stringify({
					trainingPrograms: this.trainingPrograms,
					username: this.username,
				})
			);
		}

		this.loading = false;
	}

	ngOnDestroy(): void {
		localStorage.removeItem("profileInfo");
	}

	onCancel() {
		this.router.navigate(["/home/friends"]);
	}

	isPlaylistUrlValid() {
		return (
			this.playlistUrl &&
			this.playlistUrl !== "" &&
			this.playlistUrl.includes("https://open.spotify.com/playlist/")
		);
	}

	focusCollapse(type: "program" | "session", index: number) {
		if (type === "program") {
			const collapsers: NodeListOf<Element> =
				document.querySelectorAll(".collapser");
			const collapses: NodeListOf<Element> =
				document.querySelectorAll(".collapse-body");

			for (let i = 0; i < collapsers.length; i++) {
				if (i !== index) {
					collapsers[i].classList.remove("collapsed");
					collapsers[i].setAttribute("aria-expanded", "false");
					collapses[i].classList.remove("show");
				}
			}
		}
	}

	saveWorkout(trainingProgramIndex: number) {
		this.firebase.addTrainingProgram(
			this.trainingPrograms[trainingProgramIndex]
		);
		this.snackBar.open("Scheda salvata!", "Ok", { duration: 3000 });
	}

	showNotes(
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
		});
	}
}
