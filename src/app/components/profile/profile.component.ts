import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FirebaseService } from "src/app/services/firebase.service";
import { NotesDialogComponent } from "../notes-dialog/notes-dialog.component";
import { ActivatedRoute, Router } from "@angular/router";
import { TrainingProgram } from "src/app/Models/TrainingProgram.model";
import { formatSets } from "src/app/utils/utils";
import { Set } from "src/app/Models/Exercise.model";
import { User } from "src/app/Models/User.model";

@Component({
	selector: "app-profile",
	templateUrl: "./profile.component.html",
	styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit, OnDestroy {
	public username: string;
	public searchUsername: string;
	public trainingPrograms: TrainingProgram[];
	public playlistUrl: string;
	public loading: boolean;

	constructor(
		private firebase: FirebaseService,
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
		private router: Router,
		private route: ActivatedRoute
	) {}

	async ngOnInit() {
		this.loading = true;

		if (this.route.snapshot.paramMap.get("username")) {
			this.searchUsername = this.route.snapshot.paramMap.get("username");
		}

		try {
			let uid: string = JSON.parse(localStorage.getItem("profile"))?.uid;
			let user: User = await this.firebase.getUserData(uid);

			console.log(user);
			console.log(uid)

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

	public formatSets(sets: Set[]) {
		return formatSets(sets);
	}

	public onCancel() {
		if (this.route.snapshot.paramMap.get("username")) {
			this.router.navigate([
				"/home/search-result",
				{ username: this.searchUsername },
			]);
		}

		else {
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
					collapsers[i].classList.remove("collapsed");
					collapsers[i].setAttribute("aria-expanded", "false");
					collapses[i].classList.remove("show");
				}
			}
		}
	}

	public saveTrainingProgram(trainingProgramIndex: number) {
		this.firebase.addTrainingProgram(
			this.trainingPrograms[trainingProgramIndex]
		);
		this.snackBar.open("Scheda salvata!", "Ok", { duration: 3000 });
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
		});
	}
}
